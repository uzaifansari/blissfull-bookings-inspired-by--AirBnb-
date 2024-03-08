import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AccountNav from "../Components/AccountNavbar/AccountNav";
import axios from "axios";
import PlaceImg from "../Components/PlacesUtils/PlaceImg";
import Header from "../Components/Header/Header";
// import "./modal2.css";

export default function PlacesPage() {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    axios.get("/user-places").then(({ data }) => {
      setPlaces(data);
    });
  }, []);

  function handleSearch(value) {
    setSearchValue(value);
  }

  return (
    <div className="container mx-auto px-4">
      <Header onSearch={handleSearch} />
      <AccountNav />
      <div className="flex flex-col items-center mb-4">
        {places?.length === 0 && (
          <div className="text-center bg-gray-200 p-4 rounded-lg">
            <h2 className="text-2xl mb-4">No Places found</h2>
            <p className="text-gray-500">You haven't added any places yet.</p>
          </div>
        )}
      </div>
      <div className="text-center">
        <Link
          className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
          to={"/account/places/new"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z"
              clipRule="evenodd"
            />
          </svg>
          Add new place
        </Link>
      </div>
      <div className="mt-4">
        {places.length > 0 &&
          places.map((place) => (
            <div
              key={place._id}
              className="flex flex-col md:flex-row gap-4 bg-gray-200 rounded-2xl p-4 my-2 relative"
            >
              <div className="flex w-32 h-32 bg-gray-300 shrink-0">
                <PlaceImg place={place}></PlaceImg>
              </div>
              <div className="grow-0 shrink">
                <h2 className="text-xl">{place.title}</h2>
                <p className="text-sm mt-2">{place.description}</p>
              </div>
              <Link
                className="absolute top-2 right-8 text-gray-500 bg-transparent"
                to={"/account/places/booking-info/" + place._id}
              >
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
              </Link>
              <Link
                className="absolute top-2 right-2 text-purple-500 bg-transparent"
                to={"/account/places/" + place._id}
              >
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
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
}
