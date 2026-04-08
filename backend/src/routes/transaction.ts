import { Router } from "express";
import { ingestTransaction } from "../controller/transactionroute.js"
const router = Router();

router.post("/", ingestTransaction);

export default router