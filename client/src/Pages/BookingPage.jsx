import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaceAddress from "../Components/PlacesUtils/PlaceAddress";
import PlaceGalary from "../Components/PlacesUtils/PlaceGalary";
import BookingDates from "../Components/Bookings/BookingDates";
import Header from "../Components/Header/Header";

export default function BookingPage() {
  const { id } = useParams();
  const [searchValue, setSearchValue] = useState("");
  const [booking, setBooking] = useState(null);
  useEffect(() => {
    if (id) {
      axios.get("/bookings").then((response) => {
        const foundBooking = response.data.find((data) => data._id === id);
        if (foundBooking) {
          setBooking(foundBooking);
        }
      });
    }
  }, [id]);

  if (!booking) {
    return "";
  }
  function handleSearch(value) {
    setSearchValue(value);
  }
  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="my-8">
        <h1 className="text-3xl">{booking.place.title}</h1>
        <PlaceAddress place={booking.place}></PlaceAddress>
        <div className="bg-gray-200 p-6 my-6 rounded-2xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl mb-4">Your booking information</h2>
            <BookingDates booking={booking}></BookingDates>
          </div>
          <div className="bg-primary p-6 text-white rounded-2xl">
            <div>Total Price</div>
            <div className="text-3xl">₹{booking.price}</div>
          </div>
        </div>
        <PlaceGalary place={booking.place}></PlaceGalary>
      </div>
    </>
  );
}
