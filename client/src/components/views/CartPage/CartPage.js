import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";

const CartPage = (props) => {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  let cartItems = [];

  useEffect(() => {
    //리덕스 User state안에 cart안에 상품이 있는지 확인
    if (props.user.userData && props.user.userData.cart) {
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id);
        });

        dispatch(getCartItems(cartItems, props.user.userData.cart)).then(
          (response) => {
            calculateTotal(response.payload);
          }
        );
      }
    }
  }, [props.user.userData]);

  const calculateTotal = (cartDetail) => {
    let total = 0;
    cartDetail.forEach((item) => {
      total += parseInt(item.price, 10) * parseInt(item.quantity, 10);
    });
    setTotal(total);
  };

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {});
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <UserCardBlock
        products={props.user.cartDetail}
        removeItem={removeFromCart}
      />
      <div style={{ marginTop: "3rem" }}>
        <h2>Total amount: ${total}</h2>
      </div>
    </div>
  );
};

export default CartPage;
