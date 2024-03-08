import { Link } from "react-router-dom";
import { UserContext } from "../../Context/UserContext.jsx";
import { useContext, useState, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function Header({ onSearch, isFilterIconClick }) {
  const { user } = useContext(UserContext);
  const [openSearchBar, setOpenSearchBar] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filterIconClicked, setFilterIconClicked] = useState(false);
  const searchInputRef = useRef();

  const location = useLocation();
  const { pathname } = location;

  function openSearch() {
    setOpenSearchBar(!openSearchBar);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }

  function closeSearch() {
    setOpenSearchBar(false);
    setSearchValue("");
    onSearch("");
  }

  function searchPlaces(event) {
    setSearchValue(event.target.value);
    onSearch(event.target.value);
  }

  function isFilterIconClicked() {
    const value = filterIconClicked;
    setFilterIconClicked(!value);
    isFilterIconClick(!value);
  }

  return (
    <header className="flex flex-col md:flex-row items-center justify-between">
      <Link to={"/"} className="flex items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
          <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg>
        <span className="font-bold text-xl">Blissful</span>
      </Link>
      <div className="flex flex-col md:flex-row gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300 relative mt-2 md:mt-0">
        {!openSearchBar && (
          <>
            <div className="hidden md:flex gap-2">
              <div>Any where</div>
              <div className="border-l border-gray-300"></div>
              <div>Any week</div>
              <div className="border-l border-gray-300"></div>
              <div>Add guests</div>
              <button
                className="bg-primary text-white p-1 rounded-full"
                onClick={openSearch}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
              {pathname === "/" && (
          <button
            className="bg-green-400 text-black rounded-full p-1"
            onClick={isFilterIconClicked}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
              />
            </svg>
          </button>
        )}
            </div>
            <div className="md:hidden flex  gap-2">
              <div className="text-xs">Any where</div>
              <div className="border-l border-gray-300"></div>
              <div className="text-xs">Any week</div>
              <div className="border-l border-gray-300"></div>
              <div className="text-xs">Add guests</div>
              <button
                className="bg-primary text-white p-1 rounded-full ml-2"
                onClick={openSearch}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
              {pathname === "/" && (
                <button
                  className="bg-green-400 text-black rounded-full p-1"
                  onClick={isFilterIconClicked}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                    />
                  </svg>
                </button>
              )}
            </div>
          </>
        )}

        {openSearchBar && (
          <div className="flex items-center">
            <input
              type="text"
              className="border-none focus:outline-none flex-grow h-2"
              value={searchValue}
              placeholder="search apartments..."
              onChange={searchPlaces}
              ref={searchInputRef}
            />
            <button
              className="bg-transparent text-gray-500 hover:text-gray-700 p-1 rounded-full"
              onClick={closeSearch}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
      <Link
        to={user ? "/account" : "/login"}
        className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4 mt-2 md:mt-0"
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
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6 relative top-1"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        {!!user && <div>{user.name.split(" ")[0]}</div>}
      </Link>
    </header>
  );
}
