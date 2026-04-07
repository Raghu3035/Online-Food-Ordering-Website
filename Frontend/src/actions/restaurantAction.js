import axios from "axios";
import { ALL_RESTAURANTS_FAIL, ALL_RESTAURANTS_REQUEST ,ALL_RESTAURANTS_SUCCESS, CLEAR_ERROR, SORT_BY_RATINGS, SORT_BY_REVIEWS, TOGGLE_VEG_ONLY} from '../constants/restaurantConstant';

const restaurantMenuCache = {};

export const getRestaurants = () => {
  return async (dispatch) => {
    try{
        dispatch({ type: ALL_RESTAURANTS_REQUEST });
    let link='/api/v1/eats/stores';
    const {data}=await axios.get(link); 
    console.log(data);
    const {restaurants,count}=data;
    dispatch({
        type :ALL_RESTAURANTS_SUCCESS,
        payload:{restaurants,count},
    });
    }
    catch(err)
    {
      dispatch(
        {
          type:ALL_RESTAURANTS_FAIL,
          payload: err.response.data.message,
        }
      );
    }
  };
};
export const sortByRatings = () =>{
  return {
    type:SORT_BY_RATINGS,
  };
};
export const sortByReviews = () =>{
  return {
    type:SORT_BY_REVIEWS,
  };
};
export const toggleVegOnly = () =>{
  return {
    type:TOGGLE_VEG_ONLY,
  };
};
export const clearErrors = () =>{
  return {
    type:CLEAR_ERROR,
  };
};
const getRestaurantMenuData = async (restaurantId) => {
  if (restaurantMenuCache[restaurantId]) {
    return restaurantMenuCache[restaurantId];
  }

  const response = await axios.get(`/api/v1/eats/stores/${restaurantId}/menus`);
  const menuData = response?.data?.data?.[0]?.menu || [];
  restaurantMenuCache[restaurantId] = menuData;
  return menuData;
};

export const searchRestaurants = (keyword) => {
  return async (dispatch, getState) => {
    const searchTerm = (keyword || "").toLowerCase().trim();
    const { restaurants } = getState().restaurants;

    if (!searchTerm) {
      dispatch({
        type: 'SEARCH_RESTAURANTS',
        payload: {
          filteredRestaurants: restaurants,
          filteredFoodItems: [],
          isFoodSearchActive: false,
          searchKeyword: "",
        },
      });
      return;
    }

    const matchedRestaurantsByName = restaurants.filter((restaurant) =>
      (restaurant?.name || "").toLowerCase().includes(searchTerm)
    );

    try {
      const allMatchedFoodItems = [];

      await Promise.all(
        restaurants.map(async (restaurant) => {
          const menuData = await getRestaurantMenuData(restaurant._id);
          const itemNames = menuData
            .flatMap((menuSection) => menuSection?.items || [])
            .map((item) => (item?.name || "").toLowerCase());
          const hasItemMatch = itemNames.some((name) =>
            name.includes(searchTerm)
          );

          if (!hasItemMatch) {
            return;
          }

          menuData.forEach((menuSection) => {
            (menuSection?.items || []).forEach((item) => {
              const itemName = (item?.name || "").toLowerCase();
              if (itemName.includes(searchTerm)) {
                allMatchedFoodItems.push({
                  ...item,
                  restaurantId: restaurant._id,
                  restaurantName: restaurant.name,
                });
              }
            });
          });
        })
      );

      dispatch({
        type: 'SEARCH_RESTAURANTS',
        payload: {
          filteredRestaurants: matchedRestaurantsByName,
          filteredFoodItems: allMatchedFoodItems,
          isFoodSearchActive: true,
          searchKeyword: searchTerm,
        },
      });
    } catch (error) {
      dispatch({
        type: 'SEARCH_RESTAURANTS',
        payload: {
          filteredRestaurants: matchedRestaurantsByName,
          filteredFoodItems: [],
          isFoodSearchActive: true,
          searchKeyword: searchTerm,
        },
      });
    }
  };
};