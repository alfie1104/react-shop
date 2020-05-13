import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continents, price } from "./Sections/Datas";
import RadioBox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";

function LandingPage() {
  const [products, setProducts] = useState([]);
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(1);
  const [postSize, setPostSize] = useState(0);
  const [filters, setFilters] = useState({
    continents: [],
    price: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

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
      <Card
        cover={
          <a href={`/product/${product._id}`}>
            <ImageSlider images={product.images} />
          </a>
        }
      >
        <Card.Meta title={product.title} description={`$${product.price}`} />
      </Card>
    </Col>
  ));

  const showFilterResults = (filters) => {
    const body = {
      skip: 0,
      limit,
      filters,
    };
    getProducts(body);
    setSkip(0);
  };

  const handlePrice = (value) => {
    const data = price;
    let array = [];
    for (let key in data) {
      if (data[key]._id === parseInt(value, 10)) {
        array = data[key].array;
        break;
      }
    }
    return array;
  };

  const handleFilters = (filterContent, category) => {
    const newFilters = { ...filters };
    newFilters[category] = filterContent;

    if (category === "price") {
      let priceValues = handlePrice(filterContent);
      newFilters[category] = priceValues;
    }

    showFilterResults(newFilters);
    setFilters(newFilters);
  };

  const updateSearchTerm = (newSearchTerm) => {
    const body = {
      skip: 0,
      limit,
      filters,
      searchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travle Anywhere
          <Icon type="rocket" />
        </h2>
      </div>

      {/* Filter */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <CheckBox
            list={continents}
            handleFilters={(filters) => handleFilters(filters, "continents")}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={updateSearchTerm} />
      </div>

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
