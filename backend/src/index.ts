import "dotenv/config" 
import express from "express"
import routes from "./routes/index.js"
import http from "http"
import cors from "cors"
import { initWebSocket } from "./websockets/websockets.js"

const app = express();
const server = http.createServer(app);

initWebSocket(server);
app.use(express.json())
app.use(cors())

app.use("/", routes)

app.get("/", (req, res) => {
    res.json({
        message: "Server Started"
    })
})

server.listen(3000, () => {
    console.log("Server running")
})