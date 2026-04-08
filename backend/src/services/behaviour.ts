import { getTransactions } from "../types/transaction.js";


export const getUserBehaviour = async(last30txns: getTransactions[]) => {
    const avgAmount = last30txns.length>0 ? last30txns.reduce((totalAmount, tx) => totalAmount + tx.amount, 0):0;
    const maxAmount = Math.max(...last30txns.map((tx => tx.amount)));
    const countriesUsed = [...new Set(last30txns.map(tx => tx.country))];

    const data = ({
        avgAmount,
        maxAmount,
        countriesUsed
    })
    return data;
}
