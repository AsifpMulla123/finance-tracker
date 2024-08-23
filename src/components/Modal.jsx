import React, { useState } from "react";
import { MdOutlineCancel } from "react-icons/md";

function Modal({ Title, btnText, showModalFunc, type, onfinish }) {
  const [Name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onfinish(Name, amount, date, tag, type);
  };

  return (
    <div className="w-2/6 p-6 absolute bg-white shadow-lg border border-slate-200 left-1/2 top-1/2 -translate-x-2/4 -translate-y-2/4 rounded-md z-50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-xl">{Title}</h3>
        <MdOutlineCancel
          size={30}
          className="cursor-pointer"
          onClick={showModalFunc}
        />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="pb-4">
          <p>Name</p>
          <input
            type="text"
            className="border-b-2 border-slate-400 w-full outline-none pt-1"
            value={Name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </div>
        <div className="pb-4">
          <p>Amount</p>
          <input
            type="number"
            className="border-b-2 border-slate-400 w-full outline-none pt-1"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
            }}
            required
          />
        </div>
        <div className="pb-4">
          <p>Date</p>
          <input
            type="date"
            className="border-b-2 border-slate-400 w-full outline-none pt-4"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
            required
          />
        </div>
        <div className="pb-4">
          <p>Tag</p>
          <select
            name="tag"
            className="border-b-2 border-slate-400 w-full outline-none pt-4"
            onChange={(e) => {
              setTag(e.target.value);
            }}
            required
          >
            <option value="none">Select the Tag</option>
            <option value="salary">Salary</option>
            <option value="freelance">Freelance</option>
            <option value="investment">Investment</option>
            <option value="enjoyment">Enjoyment</option>
            <option value="travel">Travel</option>
            <option value="others">Others</option>
          </select>
        </div>
        <button
          className="bg-blue-500 text-white w-full rounded-sm py-2 px-8 font-medium mt-4 hover:bg-blue-600"
          type="submit"
        >
          {btnText}
        </button>
      </form>
    </div>
  );
}

export default Modal;
