import { Radio, Select, Table } from "antd";
import { parse, unparse } from "papaparse";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { toast } from "react-toastify";
const { Option } = Select;

function TransactionTable({ transactions, addTransaction, fetchTransactions }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Tag",
      dataIndex: "tag",
      key: "tag",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
  ];
  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );
  let sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") {
      return new Date(a.date) - new Date(b.date);
    } else if (sortKey === "date") {
      return a.amount - b.amount;
    } else {
      return 0;
    }
  });
  function exportCSV() {
    let csv = unparse({
      fields: ["name", "type", "tag", "date", "amount"],
      data: transactions,
    });
    const data = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.Csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  function importCSV(e) {
    e.preventDefault();
    try {
      parse(e.target.files[0], {
        header: true,
        complete: async function (result) {
          for (const transaction of result.data) {
            console.log(transaction);
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
        },
      });
      toast.success("All Transactions Added!");
      fetchTransactions();
      e.target.files = null;
    } catch (error) {
      toast.error(error.message);
    }
  }
  return (
    <div className="mt-8">
      <div className="flex justify-between items-center gap-4 mb-4">
        <div className="relative">
          <CiSearch size={18} className="absolute mt-1.5 ml-1" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Name"
            className="border border-gray-400 rounded-md py-1 px-7 focus:outline-none"
          />
        </div>
        <Select
          placeholder="Filter"
          allowClear
          value={typeFilter}
          onChange={(value) => setTypeFilter(value)}
          className="w-32"
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>
      <div>
        <div className="flex justify-between items-center w-full mb-4 flex-wrap gap-4">
          <h2 className="">My Transactions</h2>
          <Radio.Group
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="flex"
          >
            <Radio.Button value="">No sort</Radio.Button>
            <Radio.Button value="date">Sort by Date</Radio.Button>
            <Radio.Button value="amount">Sort by Amount</Radio.Button>
          </Radio.Group>
          <div className="flex gap-4">
            <button
              className="border border-gray-300 text-blue-500 text-sm p-2 rounded-md hover:bg-blue-500 hover:text-white"
              onClick={exportCSV}
            >
              Export to CSV
            </button>
            <label
              htmlFor="file-csv"
              className="border border-gray-300 bg-blue-500 text-sm p-2 rounded-md hover:text-blue-500 hover:bg-white text-white cursor-pointer"
            >
              Import from CSV
            </label>
            <input
              type="file"
              id="file-csv"
              required
              accept=".csv"
              onChange={importCSV}
              className="hidden"
            />
          </div>
        </div>
        <Table dataSource={sortedTransactions} columns={columns} />
      </div>
    </div>
  );
}

export default TransactionTable;
