import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "../Components/Header/Header";
import Loader from "../Components/Loader/Loader";
import Modal from "react-modal";
import { useLocation } from "react-router-dom";

export default function IndexPage() {
  const [places, setPlaces] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [priceFilters, setPriceFilters] = useState({
    range1: false,
    range2: false,
    range3: false,
    range4: false,
  });

  const location = useLocation();
  const { pathname } = location;

  useEffect(() => {
    axios.get("/places").then((response) => {
      setPlaces(response.data);
      setLoading(false);
    });
  }, []);

  function handleSearch(value) {
    setSearchValue(value);
  }

  function isFilterIconClicked(value) {
    if (pathname === "/") setShowModal(true);
  }

  const handlePriceFilterChange = (event) => {
    const { name, checked } = event.target;
    setPriceFilters((prevFilters) => ({
      ...prevFilters,
      [name]: checked,
    }));
  };

  const filteredByPricePlaces = places.filter((place) => {
    if (priceFilters.range1 && place.price >= 0 && place.price <= 999) {
      return true;
    }
    if (priceFilters.range2 && place.price >= 1000 && place.price <= 1999) {
      return true;
    }
    if (priceFilters.range3 && place.price >= 2000 && place.price <= 2999) {
      return true;
    }
    if (priceFilters.range4 && place.price >= 3000) {
      return true;
    }
    return false;
  });

  // Filter the places based on the searchValue
  const filteredPlaces = !(
    priceFilters.range1 ||
    priceFilters.range2 ||
    priceFilters.range3 ||
    priceFilters.range4
  )
    ? places.filter(
        (place) =>
          place.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          place.address.toLowerCase().includes(searchValue.toLowerCase())
      )
    : filteredByPricePlaces.filter(
        (place) =>
          place.title.toLowerCase().includes(searchValue.toLowerCase()) ||
          place.address.toLowerCase().includes(searchValue.toLowerCase())
      );

  // Pagination
  const indexOfLastPlace = currentPage * itemsPerPage;
  const indexOfFirstPlace = indexOfLastPlace - itemsPerPage;
  const currentPlaces = filteredPlaces.slice(
    indexOfFirstPlace,
    indexOfLastPlace
  );

  // Change page
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header onSearch={handleSearch} isFilterIconClick={isFilterIconClicked} />
      <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader />
          </div>
        ) : currentPlaces.length > 0 ? (
          currentPlaces.map((place) => (
            <Link to={"/place/" + place._id} key={place._id}>
              <div className="bg-gray-500 mb-2 rounded-2xl flex">
                {place.photos?.[0] && (
                  <img
                    className="rounded-2xl object-cover aspect-square"
                    src={"http://localhost:4000/uploads/" + place.photos?.[0]}
                    alt=""
                  />
                )}
              </div>
              <h2 className="font-bold">{place.address}</h2>
              <h3 className="text-sm text-gray-500 truncate">{place.title}</h3>
              <div className="mt-1">
                <span className="font-bold">₹{place.price} per night</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="grid place-items-center w-[90vw]">
        <div className="text-center bg-gray-200 p-4 rounded-lg">
          <h2 className="text-2xl mb-4">No Places found</h2>
          <p className="text-gray-500">Can't find places of the given price.</p>
        </div>
      </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {filteredPlaces.length > itemsPerPage && (
          <nav className="pagination">
            <ul className="flex space-x-2">
              {Array.from({
                length: Math.ceil(filteredPlaces.length / itemsPerPage),
              }).map((_, index) => (
                <li key={index}>
                  <button
                    className={`${
                      index + 1 === currentPage
                        ? "text-white bg-blue-500"
                        : "text-blue-500 bg-white"
                    } px-3 py-1 rounded-md`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
      
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        ariaHideApp={false}
        className="w-64 mx-auto bg-white rounded-lg p-4 shadow-md"
        overlayClassName="modal-overlay"
      >
        <h2 className="text-xl font-bold mb-4 text-center">Filter By Price</h2>
        <div className="mb-2">
          <input
            type="checkbox"
            name="range1"
            checked={priceFilters.range1}
            onChange={handlePriceFilterChange}
            className="form-checkbox mr-2"
          />
          <label>₹0 - ₹999</label>
        </div>
        <div className="mb-2 flex items-center">
          <input
            type="checkbox"
            name="range2"
            checked={priceFilters.range2}
            onChange={handlePriceFilterChange}
            className="form-checkbox mr-2"
          />
          <label>₹1000 - ₹1999</label>
        </div>
        <div className="mb-2 flex items-center">
          <input
            type="checkbox"
            name="range3"
            checked={priceFilters.range3}
            onChange={handlePriceFilterChange}
            className="form-checkbox mr-2"
          />
          <label>₹2000 - ₹2999</label>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="range4"
            checked={priceFilters.range4}
            onChange={handlePriceFilterChange}
            className="form-checkbox mr-2"
          />
          <label>₹3000 and above</label>
        </div>
        <div className="flex justify-center mt-4">
          <button
            className="px-4 py-2 rounded-lg hover:text-red-700"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </button>{" "}
        </div>
      </Modal>
    </>
  );
}
