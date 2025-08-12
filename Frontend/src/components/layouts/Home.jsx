import React, { useEffect } from "react";
import CountRestaurant from "./CountRestaurant";
import Restaurant from "./Restaurant";
import { getRestaurants,sortByRatings,sortByReviews,toggleVegOnly, } from "../../actions/restaurantAction";
import { useDispatch, useSelector } from "react-redux";
import Message from "./Message";
import { SkeletonRestaurant, SkeletonGrid, SkeletonStyles } from "./Skeleton";

export default function Home() {
  const dispatch = useDispatch();
  const { loading: restaurantsLoading, error: restaurantsError, filteredRestaurants, showVegOnly } = useSelector(
    (state) => state.restaurants
  );

  useEffect(() => {
    dispatch(getRestaurants());
  }, [dispatch]);
  
  const handleSortByReview=() =>{
    dispatch(sortByReviews());
  };
  const handleSortByRating=() =>{
    dispatch(sortByRatings());
  };
  const handleToggleVegOnly=() =>{
    dispatch(toggleVegOnly());
  };
  
  return (
    <>
      <SkeletonStyles />
      <CountRestaurant />
      {restaurantsLoading ? (
        <div className="container">
          <div className="sort">
            <button className="sort_veg p-3" disabled>
              Pure Veg
            </button>
            <button className="sort_rev p-3" disabled>
              Sort By Review 
            </button>
            <button className="sort_rate p-3" disabled>
              Sort By Ratings
            </button>
          </div>
          <SkeletonGrid count={8} component={SkeletonRestaurant} />
        </div>
      ) : restaurantsError ? (
        <Message variant="danger">{restaurantsError}</Message>
      ) : (
        <>
          <section>
            <div className="sort">
              <button className="sort_veg p-3" onClick={handleToggleVegOnly} >
                {showVegOnly ? "Show All" :"Pure Veg"}
              </button>
              <button className="sort_rev p-3" onClick={handleSortByReview}>
                Sort By Review 
              </button>
              <button className="sort_rate p-3" onClick={handleSortByRating}>
                Sort By Ratings
              </button>
            </div>
            <div className="row mt-4">
              {filteredRestaurants ? (
                filteredRestaurants.map((restaurant) =>
                  !showVegOnly || (showVegOnly && restaurant.isVeg) ? (
                    <Restaurant key={restaurant._id} restaurant={restaurant} />
                  ) : null
                )
              ) : (
                <Message variant="info">No Restaurant Found</Message>
              )}
            </div>
          </section>
        </>
      )}
    </>
  );
}
