import { useContext, useState } from "react";
import { UserContext } from "../Context/UserContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "../Components/AccountNavbar/AccountNav";
import Header from "../Components/Header/Header";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateEmail,
  validateName,
} from "../Components/ValidationsUtils/validationUtils";
import "./modal2.css";
import Loader from "../Components/Loader/Loader";
import { UserX } from "react-feather";

export default function AccountPage() {
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [searchValue, setSearchValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalHeading, setModalHeading] = useState("");

  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = "profile";
  }

  async function logout() {
    await axios.post("/logout");
    setUser(null);
    setRedirect("/");
  }

  function openModal() {
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
  }

  async function handleUpdate() {
    setName(name.trim());
    setEmail(email.trim());
    if (name === "") {
      toast("Name is required");
      return;
    } else if (!validateName) {
      toast("Please enter the valid name with alphabets only");
      return;
    }

    if (email === "") {
      toast("Email is required");
      return;
    } else if (!validateEmail) {
      toast("Please enter the valid mail id");
      return;
    }

    try {
      const userInfo = await axios.put("/updateuser", {
        id: user._id,
        name,
        email,
      });
      setUser(userInfo.data);
    } catch (err) {
      if (err?.response?.status === 409) {
        toast("Email id already exist");
        return;
      } else {
      }
    }
    closeModal();
  }

  async function makeUserAsAdmin() {
    setShowDeleteModal(false);
    setUser((prevUser) => ({ ...prevUser, isAdmin: true }));
    try {
      setUser((prevUser) => ({ ...prevUser, isAdmin: true }));
      const makeAdmin = await axios.put("/changeUserToAdmin", {
        id: user._id,
      });

      setUser(makeAdmin.data);
    } catch (err) {}
  }

  async function deleteUser() {
    try {
      logout();
      await axios.delete("/deleteUser/" + user._id);
    } catch (err) {
      console.log(err);
    }
  }

  if (!ready) return <Loader></Loader>;

  if (ready && !user && !redirect) {
    return <Navigate to={"/login"} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  function handleSearch(value) {
    setSearchValue(value);
  }

  return (
    <div>
      <Header onSearch={handleSearch} />
      <AccountNav></AccountNav>
      {subpage === "profile" && (
        <div className="text-center max-w-lg mx-auto bg-gray-200 py-6 rounded-2xl">
          <p className="text-xl font-bold mb-2">
            Welcome, {user?.name}! {user.isSuperAdmin ? "(Super Admin)" : ""}
            {user.isAdmin && !user.isSuperAdmin ? "(Admin)" : ""}
          </p>
          <p className="text-gray-500 text-sm">Email: {user?.email}</p>

          <div className="flex justify-center mt-4 space-x-4">
            {!user?.isAdmin && !user.isSuperAdmin && (
              <button
                className="text-gray-500 hover:text-gray-600 bg-transparent"
                onClick={() => {
                  setShowDeleteModal(true);
                  setModalMessage("Are you sure you want to be an admin?");
                  setModalHeading("Confirm Admin");
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  />
                </svg>
              </button>
            )}
            <button
              className="text-blue-500 hover:text-blue-700 bg-transparent"
              onClick={() => {
                setName(user?.name);
                setEmail(user?.email);
                openModal();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(true);
                setModalMessage("Are you sure you want to logout?");
                setModalHeading("Confirm logout");
              }}
              className="text-gray-700 hover:text-gray-600 bg-transparent"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                />
              </svg>
            </button>
            <button
              onClick={() => {
                setShowDeleteModal(true);
                setModalMessage(
                  "Are you sure you want to delete your account?"
                );
                setModalHeading("Confirm deletion");
              }}
              className="text-red-500 hover:text-green-700 bg-transparent"
            >
              <UserX></UserX>
            </button>
          </div>
        </div>
      )}
      {subpage === "places" && <PlacesPage />}
      <ToastContainer></ToastContainer>
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        ariaHideApp={false}
        className="modal-content w-fit"
        overlayClassName="modal-overlay"
      >
        <h2>{modalHeading}</h2>
        <p>{modalMessage}</p>
        <div className="flex justify-end">
          <button className="mr-2" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          {modalMessage === "Are you sure you want to delete your account?" && (
            <button className="text-red-500" onClick={deleteUser}>
              Confirm
            </button>
          )}
          {modalMessage === "Are you sure you want to logout?" && (
            <button className="text-red-500" onClick={logout}>
              Confirm
            </button>
          )}
          {modalMessage === "Are you sure you want to be an admin?" && (
            <button className="text-red-500" onClick={makeUserAsAdmin}>
              Confirm
            </button>
          )}
        </div>
      </Modal>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <h2 className="text-2xl font-bold mb-4">User Details</h2>

        <div className="mb-4">
          <label htmlFor="name" className="text-gray-700 font-semibold">
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 rounded focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="text-gray-700 font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded focus:outline-none focus:ring focus:ring-purple-500"
          />
        </div>

        <div className="flex justify-end mt-6">
          <button
            className="mr-2 px-4 py-2 text-gray-700 bg-gray-200 rounded font-semibold hover:bg-gray-300"
            onClick={closeModal}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-red-500 rounded font-semibold hover:bg-red-600"
            onClick={handleUpdate}
          >
            Confirm
          </button>
        </div>
      </Modal>
    </div>
  );
}
