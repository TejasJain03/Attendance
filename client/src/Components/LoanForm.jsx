/* eslint-disable react/prop-types */
import { useState } from "react";
import axios from "../axios";

const LoanForm = ({ employee, closeModal }) => {
  const [amount, setAmount] = useState("");
  const [dateTaken, setDateTaken] = useState(
    new Date().toISOString().split("T")[0]
  ); // Default to today's date

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newLoan = {
      amount,
      dateTaken,
    };

    try {
      await axios
        .put(`/employees/${employee._id}/add-loan`, newLoan)
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
      closeModal(); // Close modal after success
    } catch (error) {
      console.error("Error adding loan:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Amount
        </label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Date Taken
        </label>
        <input
          type="date"
          value={dateTaken}
          onChange={(e) => setDateTaken(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Add Loan
      </button>
    </form>
  );
};

export default LoanForm;
