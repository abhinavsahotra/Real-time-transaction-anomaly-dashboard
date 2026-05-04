import { Router } from "express";
import { Request, Response } from "express";
import { dashboardSummary } from "../services/dashboardSummary.js";

const dashboardRouter = Router();

dashboardRouter.get("/", async (req: Request, res: Response) => {
  try {
    const data = await dashboardSummary();
    return res.json({
        data: data
    })
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error in fetching dashboard stats",
    });
  }
});

export default dashboardRouter