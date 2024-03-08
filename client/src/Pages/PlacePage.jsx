import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingWidget from "../Components/Bookings/BookingWidget";
import PlaceGalary from "../Components/PlacesUtils/PlaceGalary";
import PlaceAddress from "../Components/PlacesUtils/PlaceAddress";
import Header from "../Components/Header/Header";

export default function PlacePage() {
  const [searchValue, setSearchValue] = useState("");
  const { id } = useParams();
  const [place, setPlace] = useState(null);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/places/${id}`).then((response) => {
      setPlace(response.data);
    });
  }, [id]);

  if (!place) {
    return "";
  }

  if (showAllPhotos) {
    return (
      <>
        <Header></Header>
        <div className="fixed inset-0 bg-black text-white">
          <div className="flex flex-col h-full">
            <div className="bg-black p-8 flex flex-col gap-4 overflow-y-auto">
              <div className="flex justify-between">
                <h2 className="text-3xl mb-4">Photos of {place.title}</h2>
                <div className="">
                  <button
                    onClick={() => setShowAllPhotos(false)}
                    className="flex items-center gap-1 py-2 px-4 rounded-2xl shadow-md bg-white text-black"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Close Photos
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {place?.photos?.length > 0 &&
                  place.photos.map((photo) => (
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={"http://localhost:4000/uploads/" + photo}
                        alt=""
                        className="object-cover w-full h-full"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  function handleSearch(value) {
    setSearchValue(value);
  }
  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="mt-4 bg-gray-100 -mx-8 px-8 pt-8">
        <h1 className="text-3xl">{place.title}</h1>

        <PlaceAddress place={place}></PlaceAddress>

        <PlaceGalary place={place}></PlaceGalary>

        <div className="mt-8 mb-8 grid gap-8 grid-cols-1 md:grid-cols-[2fr_1fr]">
          <div>
            <div className="my-4">
              <h2 className="font-semibold text-2xl">Description</h2>
              {place.description}
            </div>
            Check-in : {place.checkIn} <br /> Check-out : {place.checkOut}{" "}
            <br /> Maximum guests : {place.maxGuests}
          </div>
          <div>
            <BookingWidget place={place}></BookingWidget>
          </div>
        </div>
        <div className="bg-white -mx-8 px-8 py-8 border-t">
          <div>
            <h2 className="font-semibold text-2xl">Extra info</h2>
          </div>
          <div className="mb-4 mt-2 text-sm text-gray-700 leading-5">
            {place.extraInfo}
          </div>
        </div>
      </div>
    </>
  );
}
