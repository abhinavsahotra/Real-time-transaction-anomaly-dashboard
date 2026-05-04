import { Request, Response } from "express";
import { Router } from "express"
import { prisma } from "../lib/prisma.js";

const alerts = Router();

alerts.get("/", async(req: Request, res: Response) => {
    try {
        const getAlerts = await prisma.alert.findMany({
                orderBy: {
                    createdAt: "desc"
                }
            })
        return res.json({
            getAlerts
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error in finding the alerts"
        });
    }
});

export default alerts