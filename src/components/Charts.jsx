import { Line, Pie } from "@ant-design/charts";
import React from "react";

function Charts({ sortedTransactions }) {
  const data = sortedTransactions.map((item) => {
    return { date: item.date, amount: item.amount };
  });
  const spendingData = sortedTransactions.filter((transaction) => {
    if (transaction.type === "expense") {
      return { tag: transaction.tag, amount: transaction.amount };
    }
  });

  const finalSpendings = spendingData.reduce((acc, obj) => {
    let key = obj.tag;
    if (!acc[key]) {
      acc[key] = { tag: obj.tag, amount: obj.amount };
    } else {
      acc[key].amount += obj.amount;
    }
    return acc;
  }, {});
  const config = {
    data: data,
    width: 800,
    height: 400,
    autoFit: false,
    xField: "date",
    yField: "amount",
    point: {
      size: 5,
      shape: "diamond",
    },
    label: {
      style: {
        fill: "#aaa",
      },
    },
  };
  const spendingConfig = {
    data: spendingData,
    width: 500,
    angleField: "amount",
    colorField: "tag",
  };
  let chart;
  let Piechart;
  return (
    <div className="flex justify-center items-center gap-4 flex-wrap w-full">
      <div className="shadow-xl p-8 rounded-lg border border-slate-300">
        <h2 className="mb-6">Your Analytics</h2>
        <Line
          {...config}
          onReady={(chartInstance) => (chart = chartInstance)}
          className="w-1/2"
        />
      </div>
      <div className="shadow-xl p-8 rounded-lg border border-slate-300">
        <h2 className="mb-6">Your Spendings</h2>
        <Pie
          {...spendingConfig}
          onReady={(chartInstance) => (Piechart = chartInstance)}
        />
      </div>
    </div>
  );
}

export default Charts;