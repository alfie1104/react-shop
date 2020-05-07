const express = require("express");
const router = express.Router();
const multer = require("multer");
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

module.exports = router;
