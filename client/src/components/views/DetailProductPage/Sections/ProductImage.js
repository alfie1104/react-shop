import React, { useEffect, useState } from "react";
import ImageGallery from "react-image-gallery";

const ProductImage = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (props.detail.images && props.detail.images.length > 0) {
      const images = props.detail.images.map((image) => ({
        original: `http://localhost:5000/${image}`,
        thumbnail: `http://localhost:5000/${image}`,
      }));

      setItems(images);
    }
  }, [props.detail]);

  return <ImageGallery items={items} />;
};

export default ProductImage;
