import { useEffect, useState } from "react";
import AccountNav from "../Components/AccountNavbar/AccountNav";
import Header from "../Components/Header/Header";
import axios from "axios";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateEmail,
  validateName,
} from "../Components/ValidationsUtils/validationUtils";

export default function AllUsers() {
  const [searchValue, setSearchValue] = useState("");
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [id, setId] = useState("");

  useEffect(() => {
    axios.get("/allUsers").then((response) => {
      setUsers(response.data);
    });
  }, []);

  const deleteUser = (userId) => {
    axios
      .delete(`/deleteUser/${userId}`)
      .then((response) => {
        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );
          setShowDeleteModal(false);
        }
      })
      .catch((error) => {
        console.log("Error cancelling booking:", error);
      });
  };

  function closeModal() {
    setShowModal(false);
  }

  async function updateUser(id) {
    {
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
        await axios.put("/updateUserBySuperAdmin", {
          id,
          name,
          email,
        });
        window.location.reload();
      } catch (err) {
        if (err?.response?.status === 409) {
          toast("Email id already exist");
          return;
        } else {
        }
      }
      closeModal();
    }
  }
  function handleSearch(value) {
    setSearchValue(value);
  }

  return (
    <>
      <Header onSearch={handleSearch} />
      <AccountNav />

      <div className="flex justify-center items-center h-full">
        {users?.length === 0 && (
          <div className="text-center bg-gray-200 p-4 rounded-lg">
            <h2 className="text-2xl mb-4">No users found</h2>
            <p className="text-gray-500">No user has registered yet!</p>
          </div>
        )}
      </div>

      {users?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {users.map(
            (user) =>
              !user.isSuperAdmin && (
                <div
                  key={user._id}
                  className="bg-gray-200 rounded-2xl overflow-hidden p-4 relative"
                >
                  <div className="mb-2">
                    <strong>Name:</strong> {user.name}
                    {user.isAdmin ? " (Admin)" : ""}
                    {user.isSuperAdmin ? " (Super Admin)" : ""}
                  </div>
                  <div>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                  </div>
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <button
                      className="text-purple-500 hover:text-blue-700 bg-transparent"
                      onClick={() => {
                        setName(user?.name);
                        setEmail(user?.email);
                        setShowModal(true);
                        setId(user?._id);
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
                      className="text-red-500 hover:text-red-700 bg-transparent"
                      onClick={() => {
                        setShowDeleteModal(true);
                        setId(user?._id);
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )
          )}
        </div>
      )}
      <Modal
        isOpen={showDeleteModal}
        onRequestClose={() => setShowDeleteModal(false)}
        ariaHideApp={false}
        className="modal-content w-fit"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this user?</p>
        <div className="flex justify-end">
          <button className="mr-2" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
          <button className="text-red-500" onClick={() => deleteUser(id)}>
            Confirm
          </button>
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
            onClick={() => updateUser(id)}
          >
            Confirm
          </button>
        </div>
      </Modal>
      <ToastContainer></ToastContainer>
    </>
  );
}
