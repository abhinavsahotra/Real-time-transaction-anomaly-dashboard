import express from "express"
const app = express();

app.get("/", (req, res) => {
    res.json({
        message: "Server Started"
    })
    console.log("Server Started")
})

app.post('/transaction', ((req, res)=>{
    // recieve transaction
    //   const transaction = createTransaction();
    // create user if not exist

    // run fraud rules
    // save transaction with risk scores and reason
    // update users last country
}))
console.log(process.env.NODE_ENV);
app.listen(3000)