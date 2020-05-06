import React from "react";
import Dropzone from "react-dropzone";
import { Icon, Form } from "antd";
import { axios } from "axios";

const FileUpload = () => {
  const dropHandler = (files) => {
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };
    formData.append("file", files[0]);

    axios
      .post("/api/product/image", formData, config)
      .then((response) => {
        if (response.data.success) {
        } else {
          alert("파일을 저장하는데 실패했습니다.");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <section>
            <div
              style={{
                width: 300,
                height: 240,
                border: "1px solid lightgray",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <Icon type="plus" style={{ fontSize: "3rem" }} />
            </div>
          </section>
        )}
      </Dropzone>
    </div>
  );
};

export default FileUpload;
