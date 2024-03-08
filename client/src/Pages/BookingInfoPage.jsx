import { useEffect, useState } from "react";
import Header from "../Components/Header/Header";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingInfoPage() {
  const { id } = useParams();
  const [bookingInfo, setBookingInfo] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const getBookingInfo = async () => {
      try {
        const response = await axios.get("/booking-info/" + id);
        setBookingInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    getBookingInfo();
  }, [id]);

  function handleSearch(value) {
    setSearchValue(value);
  }

  async function handleCancelBooking(id) {
    try {
      const response = await axios.delete("/adminCancelBooking/" + id);
      if (response) {
        setBookingInfo((prevBookings) =>
          prevBookings.filter((booking) => booking._id !== id)
        );
      }
    } catch (err) {}
  }

  return (
    <div className="container mx-auto px-4">
      <Header onSearch={handleSearch}/>

      {bookingInfo.length === 0 && (
        <div className="flex justify-center mt-8">
          <div className="text-center bg-gray-200 p-4 rounded-lg justify-center items-center">
            <h2 className="text-2xl mb-4">No Bookings Found...</h2>
          </div>
        </div>
      )}
      {bookingInfo.length !== 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
          {bookingInfo.map((booking) => (
            <div
              className="bg-gray-200 shadow-lg rounded-lg p-6 flex flex-col gap-4"
              key={booking.id}
            >
              <div className="text-center text-xl">
                <span className="font-bold">Booking Details</span>
              </div>
              <div>
                <span className="font-bold">Name:</span>{" "}
                <span>{booking.name}</span>
              </div>
              <div>
                <span className="font-bold">Email:</span>{" "}
                <span>{booking.email}</span>
              </div>
              <div>
                <span className="font-bold">Phone:</span>{" "}
                <span>{booking.phone}</span>
              </div>
              <div>
                <span className="font-bold">Number of Guests:</span>{" "}
                <span>{booking.guests}</span>
              </div>
              <div>
                <span className="font-bold">CheckIn:</span>{" "}
                <span>{booking.checkIn.substring(0, 10)}</span>
              </div>
              <div>
                <span className="font-bold">CheckOut:</span>{" "}
                <span>{booking.checkOut.substring(0, 10)}</span>
              </div>
              <div className="flex ">
                <button
                  className="bg-primary hover:bg-red-500 text-white py-1 px-4 rounded-2xl"
                  onClick={() => {
                    handleCancelBooking(booking._id);
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
