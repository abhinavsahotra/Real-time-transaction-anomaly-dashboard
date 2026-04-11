import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"
import { IncomingTransaction } from "../types/transaction.js"
import { fraudCheck } from "../services/engine.js"
import { broadcastTransaction } from "../websockets/websockets.js"
import { getUserBehaviour } from "../services/behaviour.js"
import { handleCase } from "../services/case.js"

console.log("DB URL:", process.env.DATABASE_URL)


export const getUserTransactions = async(userId: string, limit: number) => {
  const getTransactions = await prisma.transaction.findMany({
      where: {
        userId: userId
      },
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    })
    
    return getTransactions;
}

export const ingestTransaction = async (req: Request, res: Response) => {
  try {
    const data: IncomingTransaction = req.body

    // UPSERT USER (create if not exists)
    const user = await prisma.user.upsert({
      where: { userId: data.userId },
      update: {}, // nothing to update yet
      create: {
        userId: data.userId,
        lastCountry: data.country
      }
    })

    // SAVE TRANSACTION
    const transaction = await prisma.transaction.create({
      data: {
        transactionId: data.transactionId,
        userId: user.id,
        amount: data.amount,
        currency: data.currency,
        country: data.country,
        ip: data.ip,
        timestamp: new Date(data.timestamp),
      }
    })

    broadcastTransaction(transaction)

    const last30txns = await getUserTransactions(user.id, 30);
    console.log(last30txns)
    const userBehaviour = await getUserBehaviour(last30txns);

    const fraudAnalysis = await fraudCheck(data, userBehaviour)
    const riskScore = fraudAnalysis.riskScore

    if(riskScore > 50) 
      try {
          await handleCase(fraudAnalysis, user.id)  
      } catch (error) {
        console.log(error)
        res.status(500).json({
          "message": "Error during Alert/Case creation"
        })
      }

    else {
      await prisma.user.update({
        where: { userId: data.userId },
        data: { lastCountry: data.country },
      })

      const updatedTransaction = await prisma.transaction.update({
        where: {id: transaction.id},
        data: {status: "SUCCESS"}
      })
    }

    res.json({
      message: "Transaction processed",
      transaction
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to ingest transaction" })
  }
}