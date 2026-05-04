import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { Router } from "express";
import { IncomingTransaction } from "../types/transaction.js";
import { fraudCheck } from "../services/engine.js";
import { broadcastTransaction } from "../websockets/websockets.js";
import { getUserBehaviour } from "../services/behaviour.js";
import { handleCase } from "../services/case.js";

console.log("DB URL:", process.env.DATABASE_URL);
const ingestionRouter = Router();

export const getUserTransactions = async (userId: string, limit: number) => {
  const getTransactions = await prisma.transaction.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: limit,
  });

  return getTransactions;
};

ingestionRouter.post("/", async (req: Request, res: Response) => {
  try {
    // TODO: ZOD Validation
    const data: IncomingTransaction = req.body;

    // UPSERT USER (create if not exists)
    const user = await prisma.user.upsert({
      where: { userId: data.userId },
      update: {}, // nothing to update yet
      create: {
        userId: data.userId,
        lastCountry: data.country,
      },
    });

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
      },
    });

    const last30txns = await getUserTransactions(user.id, 30);
    const userBehaviour = await getUserBehaviour(last30txns);

    const fraudAnalysis = await fraudCheck(data, userBehaviour);
    const riskScore = fraudAnalysis.riskScore;
    let updatedTransaction;
    const status = fraudAnalysis.flagged ? "FLAGGED" : "SUCCESS";

    if (riskScore > 30)
      try {
        await handleCase(fraudAnalysis, user.id);
        updatedTransaction = await prisma.transaction.update({
          where: {id: transaction.id},
          data: {
            status: status,
            riskScore: fraudAnalysis.riskScore,
            reasons: fraudAnalysis.reasons,
            flagged: fraudAnalysis.flagged,
          }
        })
      } catch (error) {
        console.log(error);
        return res.status(500).json({
          message: "Error during Alert/Case creation",
        });
      }
    else {
      await prisma.user.update({
        where: { userId: data.userId },
        data: { lastCountry: data.country },
      });

      updatedTransaction = await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: "SUCCESS",
          riskScore: fraudAnalysis.riskScore,
          reasons: fraudAnalysis.reasons,
          flagged: fraudAnalysis.flagged,
        },
      });
      
      if(updatedTransaction){
        broadcastTransaction(updatedTransaction);
      }
    }

    res.json({
      message: "Transaction processed",
      transaction,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to ingest transaction" });
  }
});

ingestionRouter.get("/recent", async (req: Request, res: Response) => {
  try {
    const transactions = await prisma.transaction.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        transactionId: true,
        userId: true,
        amount: true,
        currency: true,
        country: true,
        status: true,
        riskScore: true,
        createdAt: true,
      },
    });

    return res.json({
      transactions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Failed to fetch recent transactions",
    });
  }
});

export default ingestionRouter;
