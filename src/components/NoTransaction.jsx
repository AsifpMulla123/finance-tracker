import React from "react";
import transaction from "../Assets/transactions.svg";

function NoTransaction() {
  return (
    <div className="flex justify-center items-center w-full flex-col mb-16">
      <img
        src={transaction}
        alt="No data to display"
        width={400}
        className="m-16"
      />
      <p className="text-center text-xl">You Have No Transactions Currently</p>
    </div>
  );
}

export default NoTransaction;
