const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");

const { auth } = require("../middleware/auth");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "Auth failed, email not found",
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "Wrong password" });

      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post("/addToCart", auth, (req, res) => {
  // 먼저 User Collection에서 해당 유저의 정보를 가져옴
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    if (!userInfo) {
      return res.status(400).json({
        success: false,
        message: "User Info doesn't exist",
      });
    }
    //가져온 정보에서 카트에 넣으려하는 상품이 이미 들어있는지 확인
    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });

    if (duplicate) {
      //이미 들어 있을 경우 수량을 한개 증가시킴
      //Update된 User정보를 받기 위해 findOneAndUpdate함수에서 new: true 옵션을 줘야함.
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          "cart.id": req.body.productId,
        },
        { $inc: { "cart.$.quantity": 1 } },
        { new: true },
        (err, newUserInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).send(newUserInfo.cart);
        }
      );
    } else {
      //없다면 상품을 등록
      //Update된 User정보를 받기 위해 findOneAndUpdate함수에서 new: true 옵션을 줘야함.
      User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, newUserInfo) => {
          if (err) return res.status(400).json({ success: false, err });
          res.status(200).send(newUserInfo.cart);
        }
      );
    }
  });
});

router.get("/removeFromCart", auth, (req, res) => {
  //먼저 Cart안에 내가 지우려고 한 상품을 지워주기
  //pull을 이용하여 데이터 삭제가능
  //auth 모듈을 이용해서 req.user 정보 획득가능
  //new : true를 해야지 업데이트 된 새로운 데이터를 가져올 수 있음
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: {
        cart: {
          id: req.query.id,
        },
      },
    },
    { new: true },
    (err, userInfo) => {
      //product collection에서 현재 남아있는 상품들의 정보를 가져오기
      let cart = userInfo.cart;
      let array = cart.map((item) => item.id);

      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, productInfo) => {
          return res.status(200).send(productInfo, cart);
        });
    }
  );
});

router.post("/successBuy", auth, (req, res) => {
  //1. User collection안의 History 필드안에 간단한 결제 정보 넣어주기
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentId,
    });
  });

  //2. Payment collection안에 자세한 결제정보 넣어주기

  //3. Product collection의 sold 필드값을 팔린 갯수만큼 증가시키기
});
module.exports = router;
