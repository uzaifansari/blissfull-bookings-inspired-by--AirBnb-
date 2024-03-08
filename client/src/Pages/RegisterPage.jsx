import axios from "axios";
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../Components/Header/Header";
import {
  validateEmail,
  validatePassword,
  validateName,
} from "../Components/ValidationsUtils/validationUtils";

export default function RegisterPage() {
  const [searchValue, setSearchValue] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function registerUser(event) {
    event.preventDefault();

    if (name.trim() === "") {
      toast("Name is required");
      return;
    } else if (!validateName(name)) {
      toast("Please enter a valid name with only alphabets.");
      return;
    }

    if (email.trim() === "") {
      toast("Please enter your email id");
      return;
    } else if (!validateEmail(email)) {
      toast("Please enter a valid email address.");
      return;
    }

    if (password.trim() === "") {
      toast("Please enter your password");
      return;
    } else if (!validatePassword(password)) {
      toast(
        "Please enter a valid password with at least 8 characters, including at least one uppercase letter, one numeric value, and one special character."
      );
      return;
    }

    try {
      await axios.post("/register", {
        name,
        email,
        password,
      });
      toast("Registration successful");
      setRedirect(true);
    } catch (err) {
      if (err.response.status === 409) {
        toast("User already exists");
      } else {
        toast("Registration failed");
      }
    }
  }

  function handleSearch(value) {
    setSearchValue(value);
  }

  if (redirect) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Header onSearch={handleSearch}></Header>
      <div className="flex items-center justify-center h-[88vh]">
        <div className="w-full max-w-md p-4 bg-gray-100 shadow-lg rounded">
          <h1 className="mb-4 text-3xl font-bold text-center">Register</h1>
          <form className="space-y-4" onSubmit={registerUser}>
            <div>
              <label htmlFor="name" className="text-gray-700">
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                placeholder="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div>
              <label htmlFor="email" className="text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-blue-500"
                placeholder="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>
            <div className="relative">
              <label htmlFor="email" className="text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="w-full px-4 py-2 rounded focus:outline-none focus:border-blue-500"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute top-10 right-3 text-gray-400"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>

            <button className="w-full py-2 text-white bg-primary rounded focus:outline-none">
              Register
            </button>
            <div className="text-center">
              <span className="text-sm text-gray-500">
                Already a member?{" "}
                <Link to="/login" className="underline text-blue-500">
                  Login
                </Link>
              </span>
            </div>
          </form>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}
