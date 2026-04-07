import React, { useState } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { searchRestaurants } from "../../actions/restaurantAction";

export default function Search() {
  const dispatch = useDispatch();
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    dispatch(searchRestaurants(value));
  };

  const clearSearch = () => {
    setSearchValue("");
    dispatch(searchRestaurants(""));
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <div className="search_input_wrapper">
        <input
          type="text"
          placeholder="Search restaurants or food items..."
          id="search_field"
          className="form-control"
          value={searchValue}
          onChange={handleInputChange}
        />
        {searchValue.trim() !== "" && (
          <button
            type="button"
            id="clear_search_btn"
            className="btn"
            onClick={clearSearch}
            aria-label="Clear search"
          >
            <FaTimes />
          </button>
        )}
        <button id="search_btn" className="btn" tabIndex={-1}>
          <FaSearch className="fa-search" />
        </button>
      </div>
    </form>
  );
}