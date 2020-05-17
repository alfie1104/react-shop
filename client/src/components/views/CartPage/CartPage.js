import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCartItems } from "../../../_actions/user_actions";
import axios from "axios";

const CartPage = (props) => {
  const dispatch = useDispatch();
  let cartItems = [];

  useEffect(() => {
    //리덕스 User state안에 cart안에 상품이 있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        dispatch(getCartItems(cartItems, props.user.userData.cart));
      }
    }
  }, [props.user.userData]);

  return <div></div>;
};

export default CartPage;
