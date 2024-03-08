import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  validateName,
  validateEmail,
  validatePhoneNumber,
} from "../ValidationsUtils/validationUtils";

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  const [redirectToLogin, setRedirectToLogin] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  let numberOfNights = 0;

  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(
      new Date(checkOut),
      new Date(checkIn)
    );
  }

  async function bookThisPlace() {
    if (!user) {
      toast("please login first");
      setRedirectToLogin(true);
      return;
    }
    const today = new Date();
    if (!checkIn) {
      toast("Please select the check in date.");
      return;
    }
    if (!checkOut) {
      toast("Please select the check out date.");
      return;
    }
    const selectedCheckIn = new Date(checkIn);
    const selectedCheckOut = new Date(checkOut);
    if (selectedCheckIn < today || selectedCheckOut < today) {
      toast("Please select valid check-in and check-out dates.");
      return;
    }

    if (numberOfNights < 0) {
      toast("Please select valid check-in and check-out dates.");
    }

    if (guests > place.maxGuests) {
      toast(`Maximum ${place.maxGuests} guests are allowed`);
      return;
    }

    if (name.trim() === "") {
      toast("Name is required");
      return;
    } else if (!validateName(name)) {
      toast("Please enter a valid name with only alphabets.");
      return;
    }

    if (email.trim() === "") {
      toast("Email is required");
      return;
    } else if (!validateEmail(email)) {
      toast("Please enter a valid mail id.");
      return;
    }

    if (phone.trim() === "") {
      toast("Mobile Number is required");
      return;
    } else if (!validatePhoneNumber(phone)) {
      toast("Please enter a valid Indian phone number.");
      return;
    }

    const data = {
      checkIn,
      checkOut,
      guests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
      email,
    };

    var flag = 0;
    await axios.get("/allbookings").then((response) => {
      const allBookings = response.data;
      for (let i = 0; i < allBookings.length; i++) {
        if (allBookings[i].place === data.place) {
          const alreadyBookedPlaceCheckOut = new Date(allBookings[i].checkOut);
          const newBookingCheckIn = new Date(data.checkIn);
          if (
            differenceInCalendarDays(
              alreadyBookedPlaceCheckOut,
              newBookingCheckIn
            ) >= 0
          ) {
            toast("This Place is already booked by another user");
            flag = 1;
            return;
          }
        }
      }
    });

    if (flag === 0) {
      const response = await axios.post("/bookings", data);
      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    }
  }

  if (redirect) {
    return <Navigate to={redirect}></Navigate>;
  }

  if (redirectToLogin) {
    return <Navigate to="/login"></Navigate>;
  }

  return (
    <>
      <div className="bg-white shadow p-4 rounded-2xl">
        <div className="text-2xl text-center">
          Price : ₹{place.price} / per night
        </div>
        <div className="border rounded-2xl mt-4">
          <div className="flex">
            <div className="py-3 px-4">
              <label>Check in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="py-3 px-4 border-l">
              <label>Check out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
          </div>
          <div className="py-3 px-4 border-t">
            <label>Number of guests:</label>
            <input
              type="number"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
            />
          </div>
          {numberOfNights > 0 && (
            <div className="py-3 px-4 border-t">
              <label>Your full name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <label>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <label>Phone Number:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}
        </div>

        <button onClick={bookThisPlace} className="primary mt-4">
          Book this place
          {numberOfNights > 0 && <span> ₹{numberOfNights * place.price}</span>}
        </button>
      </div>
      <ToastContainer />
    </>
  );
}
