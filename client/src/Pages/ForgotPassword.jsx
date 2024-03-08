import { useState } from "react";
import Header from "../Components/Header/Header";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ForgotPassword() {
  const [searchValue, setSearchValue] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const handelForgotPassword = async () => {
    try {
      const response = await axios.post("/forgot-password", { email });
      console.log(response);
      navigate("/login/forgotPassword/resetPassword");
    } catch (err) {
      if (err.response.data.error === "User not found") {
        toast("User not found");
        return;
      }
    }
  };

  function handleSearch(value) {
    setSearchValue(value);
  }
  return (
    <>
      <Header onSearch={handleSearch}></Header>

      <div className="flex items-center justify-center h-[80vh] bg-gradient-to-r">
        <div className="w-full max-w-sm p-8 bg-gray-100 rounded shadow-lg overflow-hidden">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Forgot Password
          </h1>
          <div className="mb-2">
            <label htmlFor="email" className="text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 rounded focus:outline  focus:ring-purple-500"
              placeholder="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            className="w-full py-2 text-white bg-primary rounded focus:outline-none"
            onClick={handelForgotPassword}
          >
            Send OTP
          </button>
        </div>
      </div>
      <ToastContainer></ToastContainer>
    </>
  );
}
