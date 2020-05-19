import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getCartItems, removeCartItem } from "../../../_actions/user_actions";
import UserCardBlock from "./Sections/UserCardBlock";
import { Empty } from "antd";
import Paypal from "../../utils/Paypal";

const CartPage = (props) => {
  const dispatch = useDispatch();
  const [total, setTotal] = useState(0);
  const [showTotal, setShowTotal] = useState(false);
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
    setShowTotal(true);
  };

  const removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)).then((response) => {
      if (response.payload.productInfo.length <= 0) {
        setShowTotal(false);
      }
    });
  };

  const transactionSuccess = (data) => {
    dispatch(
      onSuccessBuy({
        paymentData: data,
        cartDetail: props.user.cartDetail,
      })
    ).then((response) => {
      if (response.payload.sucess) {
        setShowTotal(false);
      }
    });
  };

  return (
    <div style={{ width: "85%", margin: "3rem auto" }}>
      <h1>My Cart</h1>
      <UserCardBlock
        products={props.user.cartDetail}
        removeItem={removeFromCart}
      />
      {showTotal ? (
        <div style={{ marginTop: "3rem" }}>
          <h2>Total amount: ${total}</h2>
        </div>
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}
      {showTotal && <Paypal total={total} onSuccess={transactionSuccess} />}
    </div>
  );
};

export default CartPage;
