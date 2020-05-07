import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";

function LandingPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const body = {};
    // 몽고DB에 있는 상품데이터 가져오기
    axios.post("/api/product/products").then((response) => {
      if (response.data.success) {
        setProducts(response.data.productsInfo);
      } else {
        alert("상품들을 가져오는데 실패 했습니다.");
      }
    });
  }, []);

  const renderCards = products.map((product, index) => (
    <Col lg={6} md={8} xs={24} key={product._id}>
      <Card
        cover={
          <img
            style={{ width: "100%", maxHeight: "150px" }}
            src={`http://localhost:5000/${product.images[0]}`}
          />
        }
      >
        <Card.Meta title={product.title} description={`$${product.price}`} />
      </Card>
    </Col>
  ));

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travle Anywhere
          <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter */}

      {/* Search */}

      {/* Cards */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <div stype={{ display: "flex", justifyContent: "center" }}>
        <button>더보기</button>
      </div>
    </div>
  );
}

export default LandingPage;
