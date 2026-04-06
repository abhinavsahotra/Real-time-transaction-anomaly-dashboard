import "dotenv/config" 
import express from "express"
import transactionRoutes from "./routes/transaction.js"
import http from "http"
import { initWebSocket } from "./websockets/websockets.js"

const app = express();
const server = http.createServer(app);

initWebSocket(server);
app.use(express.json())

app.use("/transactions", transactionRoutes)

app.get("/", (req, res) => {
    res.json({
        message: "Server Started"
    })
})

server.listen(3000, () => {
    console.log("Server running")
})