import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continents } from "./Sections/Datas";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(1);
  const [postSize, setPostSize] = useState(0);

  useEffect(() => {
    const body = {
      skip,
      limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    // 몽고DB에 있는 상품데이터 가져오기
    axios.post("/api/product/products", body).then((response) => {
      if (response.data.success) {
        if (body.loadMore) {
          setProducts([...products, ...response.data.productsInfo]);
        } else {
          setProducts(response.data.productsInfo);
        }
        setPostSize(response.data.postSize);
      } else {
        alert("상품들을 가져오는데 실패 했습니다.");
      }
    });
  };

  const loadMoreHandler = () => {
    let newSkip = skip + limit;

    const body = {
      skip: newSkip,
      limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(newSkip);
  };

  const renderCards = products.map((product, index) => (
    <Col lg={6} md={8} xs={24} key={product._id}>
      <Card cover={<ImageSlider images={product.images} />}>
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

      {/* CheckBox */}
      <CheckBox list={continents} />

      {/* RadioBox */}

      {/* Search */}

      {/* Cards */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      {postSize >= limit && (
        <div stype={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
