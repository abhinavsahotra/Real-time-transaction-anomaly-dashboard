"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

type Transaction = {
  transactionId: string
  userId: string
  amount: number
  country: string
  riskScore: number
  status: string
  reasons: string[]
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([])

useEffect(() => {
  fetch("http://localhost:3000/transactions/recent")
    .then(res => res.json())
    .then(data => setTransactions(data.transactions))
    .catch(err => console.error("Failed to load transactions:", err));

  const ws = new WebSocket("ws://localhost:3000");

  ws.onopen = () => console.log("WebSocket connected");

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.type === "TRANSACTION_UPDATE") {
        const data: Transaction = msg.data;
        setTransactions(prev => [data, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return () => ws.close();
}, []);

  return (
    <main className="p-10 w-full">
      <h1 className="flex justify-center text-5xl font-bold mb-6">
        🚨 Real-Time Fraud Dashboard
      </h1>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex font-bold gap-3 px-4 py-2 bg-gray-200 rounded">
            <div className="w-1/6">Transaction ID</div>
            <div className="w-1/6">User ID</div>
            <div className="w-1/6">Amount</div>
            <div className="w-1/6">Country</div>
            <div className="w-1/6">Risk Score</div>
            <div className="w-1/6">Flagged</div>
          </div>

            {transactions.map((tx, index) => (
              <div 
              onClick={() => <Link href={"/transactions/detail"}></Link>}
              key={index} className="flex gap-3 cursor-pointer px-4 py-2 shadow rounded">
              <div className="w-1/6">{tx.transactionId}</div>
              <div className="w-1/6">{tx.userId}</div>
              <div className="w-1/6">{tx.amount}</div>
              <div className="w-1/6">{tx.country}</div>
              <div className="w-1/6">{tx.riskScore}</div>
              <div className="w-1/6">{tx.status === "FLAGGED" ? "YES" : "NO"}</div>
            </div>
          ))}
      </div>
      </div>
    </main>
  )
}