const express = require("express");
const router = express.Router();
const multer = require("multer");
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

/*  
  Multer 사용을 위한 셋팅
  - destination : 파일이 저장될 위치
  - filename : 파일 저장시 사용할 파일명
*/
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

var upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  // 받아온 정보들을 DB에 넣어준다.
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });

    return res.status(200).json({ success: true });
  });
});

router.post("/products", (req, res) => {
  // Product Collection에 있는 모든 상품정보를 가져오기
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;
  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  if (term) {
    Product.find(findArgs)
      .find({ $text: { $search: term } })
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productsInfo) => {
        if (err) return res.status(400).json({ success: false, err });

        return res
          .status(200)
          .json({ success: true, productsInfo, postSize: productsInfo.length });
      });
  } else {
    Product.find(findArgs)
      .populate("writer")
      .skip(skip)
      .limit(limit)
      .exec((err, productsInfo) => {
        if (err) return res.status(400).json({ success: false, err });

        return res
          .status(200)
          .json({ success: true, productsInfo, postSize: productsInfo.length });
      });
  }
});

router.get("/products_by_id", (req, res) => {
  //productId를 이용해서 DB에서 productId와 같은 정보를 가져온다.
  let type = req.query.type;
  let productIds = req.query.id;

  if (type === "array") {
    /*
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
    */
    productIds = req.query.id.split(",");
  }

  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).json({ success: true, product });
    });
});

module.exports = router;
