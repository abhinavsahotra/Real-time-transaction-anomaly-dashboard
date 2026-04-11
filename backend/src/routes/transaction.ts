import { Router } from "express";
import { ingestTransaction } from "../controller/transactionroute.js"

const router = Router();

router.use("/", ingestTransaction);

export default router