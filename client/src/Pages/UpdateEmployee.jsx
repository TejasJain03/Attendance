/* eslint-disable no-unused-vars */
import  { useState, useEffect } from "react";
import axios from "../axios";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ROLES } from "../constants/constants";

const UpdateEmployee = () => {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    perDayRate: "",
    role: "",
    paymentDivision: {
      account: "",
      cash: "",
    },
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/employees/${employeeId}`);
        const data = response.data.employee;
        setFormData({
          ...data,
          paymentDivision: data.paymentDivision || { account: "", cash: "" },
        });
      } catch (error) {
        toast.error("Failed to load employee details.");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [employeeId]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error("Please select a valid role!");
      return;
    }

    const { account, cash } = formData.paymentDivision;
    if (
      parseFloat(account) + parseFloat(cash) !==
      parseFloat(formData.perDayRate)
    ) {
      toast.error("Account and Cash must sum up to Per Day Rate!");
      return;
    }

    try {
      setLoading(true);
      await axios.put(`/employees/${employeeId}`, formData);
      toast.success("Employee updated successfully!");
      navigate("/admin/employee-management");
    } catch (error) {
      toast.error(
        "Error occurred while updating the employee. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="px-4 py-8 sm:px-10">
              <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-8">
                Update Employee
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="perDayRate" className="block text-sm font-medium text-gray-700 mb-1">
                      Per Day Rate
                    </label>
                    <input
                      type="number"
                      id="perDayRate"
                      name="perDayRate"
                      value={formData.perDayRate}
                      onChange={handleChange}
                      className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="" disabled>Select a role</option>
                      {ROLES.map((role) => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Division</h3>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="account" className="block text-sm font-medium text-gray-700 mb-1">
                        Account
                      </label>
                      <input
                        type="number"
                        id="account"
                        name="paymentDivision.account"
                        value={formData.paymentDivision.account}
                        onChange={handleChange}
                        className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="cash" className="block text-sm font-medium text-gray-700 mb-1">
                        Cash
                      </label>
                      <input
                        type="number"
                        id="cash"
                        name="paymentDivision.cash"
                        value={formData.paymentDivision.cash}
                        onChange={handleChange}
                        className="mt-1 block w-full border-2 border-gray-300 rounded-xl shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
                  >
                    {loading ? (
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : null}
                    {loading ? "Updating Employee..." : "Update Employee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateEmployee;

