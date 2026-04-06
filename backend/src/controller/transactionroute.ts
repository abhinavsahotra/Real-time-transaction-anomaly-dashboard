import { Request, Response } from "express"
import { prisma } from "../lib/prisma.js"
import { IncomingTransaction } from "../types/transaction.js"
import { fraudCheck } from "../services/engine.js"
import { broadcastTransaction } from "../websockets/websockets.js"

console.log("DB URL:", process.env.DATABASE_URL)
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

    const fraudAnalysis = await fraudCheck(data.userId, data.country)
    const riskScore = fraudAnalysis.riskScore
    const flagged = fraudAnalysis.flagged
    const reasons: string[] = fraudAnalysis.reasons

    // SAVE TRANSACTION
    const transaction = await prisma.transaction.create({
      data: {
        transactionId: data.transactionId,
        userId: data.userId,
        amount: data.amount,
        currency: data.currency,
        country: data.country,
        ip: data.ip,
        timestamp: new Date(data.timestamp),
        riskScore,
        flagged,
        reasons
      }
    })

    // UPDATE USER LAST COUNTRY
    await prisma.user.update({
      where: { userId: data.userId },
      data: { lastCountry: data.country }
    })

    broadcastTransaction(transaction)

    res.json({
      message: "Transaction processed",
      transaction
    })

  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Failed to ingest transaction" })
  }
}