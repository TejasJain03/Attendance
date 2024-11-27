import { useState } from "react";
import axios from "../axios";
import { useNavigate } from "react-router-dom";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    perDayRate: "",
    paymentDivision: {
      account: "",
      cash: "",
    },
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("paymentDivision")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        paymentDivision: {
          ...prev.paymentDivision,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted: ", formData);
    axios
      .post("/create-employee", formData)
      .then((response) => {
        console.log(response);
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center p-6">
      <div className="bg-white shadow-xl rounded-lg p-10 max-w-lg w-full">
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
          Employee Form
        </h2>
        <form className="space-y-8" onSubmit={handleSubmit}>
          {/* Employee Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Per Day Rate */}
          <div>
            <label
              htmlFor="perDayRate"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Per Day Rate
            </label>
            <input
              type="number"
              id="perDayRate"
              name="perDayRate"
              value={formData.perDayRate}
              onChange={handleChange}
              placeholder="Enter rate"
              className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>

          {/* Payment Division */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Payment Division
            </h3>
            {/* Account */}
            <div>
              <label
                htmlFor="account"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Account
              </label>
              <input
                type="number"
                id="account"
                name="paymentDivision.account"
                value={formData.paymentDivision.account}
                onChange={handleChange}
                placeholder="Account payment"
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
            {/* Cash */}
            <div className="mt-6">
              <label
                htmlFor="cash"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Cash
              </label>
              <input
                type="number"
                id="cash"
                name="paymentDivision.cash"
                value={formData.paymentDivision.cash}
                onChange={handleChange}
                placeholder="Cash payment"
                className="w-full border border-gray-300 rounded-md shadow-sm px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:outline-none transition transform hover:scale-105"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
