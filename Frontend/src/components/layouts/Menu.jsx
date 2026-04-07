import React,{useEffect} from "react";
import FoodItem from "./FoodItem";
import { useDispatch, useSelector } from "react-redux";
import { getMenus } from "../../actions/menuAction";
import { useNavigate, useParams } from "react-router-dom";
import Message from "./Message";
import { SkeletonFoodItem, SkeletonMenu, SkeletonGrid, SkeletonStyles } from "./Skeleton";

export default function Menu() {
  const dispatch =useDispatch();
  const navigate = useNavigate();
  const {id}=useParams();
  const {menus,loading,error}=useSelector((state)=>state.menus);
  
  useEffect(()=>{
    dispatch(getMenus(id));
  },[dispatch,id]);
  
  return (
    <div className="menu_page_container">
      <SkeletonStyles />
      <button
        type="button"
        className="btn btn-outline-secondary menu_back_btn"
        onClick={() => navigate("/")}
        aria-label="Go to Home"
      >
        ←
      </button>
      {loading ? (
        <div className="container">
          <SkeletonMenu />
          <SkeletonGrid count={6} component={SkeletonFoodItem} />
        </div>
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : menus && menus.length > 0 ? (
        menus.map((menu) => (
          <div key={menu._id}>
            <h2>{menu.category}</h2>
            <hr />
            {menu.items && menu.items.length > 0 ? (
              <div className="row">
                {menu.items.map((fooditem) => (
                  <FoodItem
                    key={fooditem._id}
                    fooditem={fooditem}
                    restaurant={id}
                  />
                ))}
              </div>
            ) : (
              <Message variant="info">No FoodItem Found</Message>
            )}
          </div>
        ))
      ) : (
        <Message variant="info">No Menus Found</Message>
      )}
  </div>    
  );
}
