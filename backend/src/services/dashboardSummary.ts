import { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export const dashboardSummary = async () => {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const [transactionCount, caseCount, alertCount] = await Promise.all([
            prisma.transaction.count({
                where: {
                    createdAt: { gte: last24Hours }
                }
            }),
            prisma.case.count({
                where: {
                    createdAt: { gte: last24Hours }
                }
            }),
            prisma.alert.count({
                where: {
                    createdAt: { gte: last24Hours }
                }
            })
        ]);

        return {
            transactionCount,
            alertCount,
            caseCount
        };
};