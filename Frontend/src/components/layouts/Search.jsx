import React from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { searchRestaurants, getRestaurants } from "../../actions/restaurantAction";

export default function Search() {
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      dispatch(getRestaurants());
    } else {
      dispatch(searchRestaurants(value));
    }
  };

  return (
    <form onSubmit={e => e.preventDefault()}>
      <div className="input-group">
        <input
          type="text"
          placeholder="Search your favorite Restaurant..."
          id="search_field"
          className="form-control"
          onChange={handleInputChange}
        />
        <div className="input-group-append">
          <button id="search_btn" className="btn" tabIndex={-1}>
            <FaSearch className="fa-search" />
          </button>
        </div>
      </div>
    </form>
  );
}