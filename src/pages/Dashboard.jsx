import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import TransactionTable from "../components/TransactionTable";
import Charts from "../components/Charts";
import NoTransaction from "../components/NoTransaction";

function Dashboard() {
  const [user] = useAuthState(auth);
  const [showTotalIncome, setShowTotalIncome] = useState(false);
  const [showTotalExpense, setShowTotalExpense] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [TotalBalance, setTotalBalance] = useState(0);

  useEffect(() => {
    fetchTransactions();
  }, [user]);
  useEffect(() => {
    calculateBalance();
  }, [transactions]);

  function calculateBalance() {
    let incomeTotal = 0;
    let expenseTotal = 0;
    transactions.forEach((trans) => {
      if (trans.type === "income") {
        incomeTotal += trans.amount;
      } else {
        expenseTotal += trans.amount;
      }
    });
    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }
  async function fetchTransactions() {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      toast.success("Transaction Fetched!");
    }
    setLoading(false);
  }

  function showIncomeModal() {
    setShowTotalIncome(!showTotalIncome);
  }
  function showExpenseModal() {
    setShowTotalExpense(!showTotalExpense);
  }

  function onFinish(name, amount, date, tag, type) {
    const newTransaction = {
      type: type,
      date: date,
      amount: parseFloat(amount),
      tag: tag,
      name: name,
    };
    addTransaction(newTransaction);
  }
  async function addTransaction(transaction, many) {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      if (!many) {
        toast.success("Transaction Added!");
      }
      let newArr = transactions;
      newArr.push(transaction);
      setTransactions(newArr);
      calculateBalance();
    } catch (error) {
      if (!many) {
        toast.error("Couldn't add Transaction!");
      }
    }
  }
  let sortedTransactions = transactions.sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });
  return (
    <div className="mx-6">
      {loading ? (
        <div className="loader absolute left-2/4 top-2/4 -translate-x-1/2"></div>
      ) : (
        <>
          <div className="flex justify-center items-center gap-10 my-8 flex-wrap">
            <div className="shadow-lg w-full md:w-96 p-4 rounded-md border border-slate-100">
              <h4 className="font-medium mb-3">Current Balance</h4>
              <p>₹ {TotalBalance}</p>
              <button className="w-full bg-blue-400 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-700" disabled>
                Reset Balance
              </button>
            </div>
            <div className="shadow-lg w-full md:w-96 p-4 rounded-md border border-slate-100">
              <h4 className="font-medium mb-3">Total Income</h4>
              <p>₹ {income}</p>
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-700"
                onClick={showIncomeModal}
              >
                Add Income
              </button>
            </div>
            <div className="shadow-lg w-full md:w-96 p-4 rounded-md border border-slate-100">
              <h4 className="font-medium mb-3">Total Expenses</h4>
              <p>₹ {expense}</p>
              <button
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-md mt-3 hover:bg-blue-700"
                onClick={showExpenseModal}
              >
                Add Expense
              </button>
            </div>
          </div>
          {showTotalIncome && (
            <Modal
              Title={"Add Income"}
              btnText={"Add Income"}
              showModalFunc={showIncomeModal}
              type="income"
              onfinish={onFinish}
            />
          )}
          {showTotalExpense && (
            <Modal
              Title={"Add Expense"}
              btnText={"Add Expense"}
              showModalFunc={showExpenseModal}
              type="expense"
              onfinish={onFinish}
            />
          )}
          <div className="">
            {transactions && transactions.length !== 0 ? (
              <Charts sortedTransactions={sortedTransactions} />
            ) : (
              <NoTransaction />
            )}
          </div>
          <TransactionTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
}
export default Dashboard;