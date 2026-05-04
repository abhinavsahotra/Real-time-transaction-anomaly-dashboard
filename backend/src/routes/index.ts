import { Router } from "express";
import ingestionRouter from "../controller/transactionroute.js"
import investigation from "../controller/investigation.js";
import alerts from"../controller/alerts.js"
import dashboardRouter from "../controller/dashboard.js";

const router = Router();

router.use("/dashboard", dashboardRouter);
router.use("/cases", investigation);
router.use("/alerts", alerts)
router.use("/ingestion", ingestionRouter);

export default router