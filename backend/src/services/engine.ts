import { IncomingTransaction, userbehaviour } from "../types/transaction.js"
import { geoTrack, velocityRule } from "../utils/rules.js"

export const fraudCheck = async(data: IncomingTransaction, userBehaviour: userbehaviour) => {
  let riskScore = 0
  const reasons: string[] = []

  if(data.amount > (userBehaviour.avgAmount)*5){
    riskScore += 30;
    reasons.push("AMOUNT_SPIKE");
  }

  if(!userBehaviour.countriesUsed.includes(data.country)){
    riskScore += 25;
    reasons.push("NEW_COUNTRY")
  }

  const timeStamp = data.timestamp;
  const hour = new Date(timeStamp).getHours();
  
  if(hour >= 0 && hour < 5){
    riskScore += 20;
    reasons.push("UNUSUAL_TIME");
  }

  const velocityCheck = await velocityRule(data.userId)
  riskScore += velocityCheck.risk
  if(velocityCheck.reason) reasons.push(velocityCheck.reason)

  const geoCheck = await geoTrack(data.userId, data.country)
  riskScore += geoCheck.risk
  if(geoCheck.reason) reasons.push(geoCheck.reason)

  const flagged = (riskScore >= 50) ? true : false

  console.log({riskScore, reasons, flagged})
  return {
    riskScore,
    reasons,
    flagged
  }
}