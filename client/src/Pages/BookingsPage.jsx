import { useEffect, useState } from "react";
import AccountNav from "../Components/AccountNavbar/AccountNav";
import axios from "axios";
import PlaceImg from "../Components/PlacesUtils/PlaceImg";
import BookingDates from "../Components/Bookings/BookingDates";
import Header from "../Components/Header/Header";
import Modal from "react-modal";
import "./modal.css";
import { differenceInCalendarDays } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BookingsPage() {
  const [searchValue, setSearchValue] = useState("");
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [editBookingId, setEditBookingId] = useState(null);
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");
  const [editGuests, setEditGuests] = useState(1);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  useEffect(() => {
    axios.get("/bookings").then((response) => {
      setBookings(response.data);
    });
  }, []);

  function cancelBooking(bookingId) {
    setSelectedBookingId(bookingId);
    setShowModal(true);
  }

  function handleConfirmCancel() {
    axios
      .delete(`/bookings/${selectedBookingId}`)
      .then((response) => {
        if (response.status === 200) {
          setBookings((prevBookings) =>
            prevBookings.filter((booking) => booking._id !== selectedBookingId)
          );
          setShowModal(false);
        }
      })
      .catch((error) => {
        console.log("Error cancelling booking:", error);
      });
  }

  function editBooking(
    bookingId,
    checkIn,
    checkOut,
    guests,
    name,
    email,
    phone
  ) {
    setEditBookingId(bookingId);
    setEditCheckIn(checkIn);
    setEditCheckOut(checkOut);
    setEditGuests(guests);
    setEditName(name);
    setEditEmail(email);
    setEditPhone(phone);
    setShowModalEdit(true);
  }

  async function handleUpdateBooking(e) {
    e.preventDefault();
    let numberOfNights = 0;

    if (editCheckIn && editCheckOut) {
      numberOfNights = differenceInCalendarDays(
        new Date(editCheckOut),
        new Date(editCheckIn)
      );
    }
    try {
      await axios.put(`/bookings/${editBookingId}`, {
        editBookingId,
        editCheckIn,
        editCheckOut,
        editGuests,
        editName,
        editEmail,
        editPhone,
        numberOfNights,
      });
      window.location.reload();
    } catch (err) {
      if (err?.response?.status === 422) {
        toast("Maximum Guest Limit Exceeded");
        return;
      } else {
        toast("Network error");
      }
    }
  }

  function handleSearch(value) {
    setSearchValue(value);
  }

  return (
    <div className="container mx-auto px-4">
      <Header onSearch={handleSearch} />
      <AccountNav />

      <div className="flex justify-center items-center h-full">
        {bookings?.length === 0 && (
          <div className="text-center bg-gray-200 p-4 rounded-lg">
            <h2 className="text-2xl mb-4">No bookings found</h2>
            <p className="text-gray-500">You haven't made any bookings yet.</p>
          </div>
        )}
      </div>

      {bookings?.length > 0 &&
        bookings.map((booking) => (
          <div
            key={booking._id}
            className="flex flex-col md:flex-row gap-4 bg-gray-200 rounded-2xl overflow-hidden mb-2"
          >
            <div className="w-full md:w-48 h-40">
              <PlaceImg place={booking?.place} />
            </div>
            <div className="py-3 grow pr-3 flex flex-col justify-between">
              <div className="flex justify-end">
                <button
                  className="bg-transparent text-purple-500"
                  onClick={() =>
                    editBooking(
                      booking._id,
                      booking.checkIn,
                      booking.checkOut,
                      booking.guests,
                      booking.name,
                      booking.email,
                      booking.phone
                    )
                  }
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
                  className="bg-transparent text-red-500"
                  onClick={() => cancelBooking(booking._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h2 className="text-xl">{booking.place.title}</h2>
              <div className="text-xl">
                <BookingDates
                  booking={booking}
                  className="mb-2 mt-4 text-sm text-gray-500"
                />
                <div className="flex gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-8 h-8"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                    />
                  </svg>
                  <span className="text-2xl">
                    Total Price: ₹{booking.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        ariaHideApp={false}
        className="modal-content w-fit"
        overlayClassName="modal-overlay"
      >
        <h2>Confirm Cancellation</h2>
        <p>Are you sure you want to cancel this booking?</p>
        <div className="flex justify-end">
          <button className="mr-2" onClick={() => setShowModal(false)}>
            Cancel
          </button>
          <button className="text-red-500" onClick={handleConfirmCancel}>
            Confirm
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={showModalEdit}
        onRequestClose={() => setShowModalEdit(false)}
        className="modal-content"
        overlayClassName="modal-overlay"
        ariaHideApp={false}
      >
        <h2>Edit Booking</h2>
        <form onSubmit={handleUpdateBooking}>
          <div className="form-group">
            <label htmlFor="checkIn">Check-in Date:</label>
            <input
              id="checkIn"
              type="date"
              value={editCheckIn}
              onChange={(e) => setEditCheckIn(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="checkOut">Check-out Date:</label>
            <input
              id="checkOut"
              type="date"
              value={editCheckOut}
              onChange={(e) => setEditCheckOut(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="guests">Number of Guests:</label>
            <input
              id="guests"
              type="number"
              value={editGuests}
              onChange={(e) => setEditGuests(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
            <input
              id="phone"
              type="number"
              value={editPhone}
              onChange={(e) => setEditPhone(e.target.value)}
            />
          </div>

          <div className="flex justify-end">
            <button className="mr-2" onClick={() => setShowModalEdit(false)}>
              Cancel
            </button>
            <button className="text-red-500" type="submit">
              Update
            </button>
          </div>
        </form>
      </Modal>
      <ToastContainer></ToastContainer>
    </div>
  );
}
