import React from "react";
import { Collapse, Checkbox } from "antd";

const CheckBox = ({ list }) => {
  const renderCheckboxLists = () =>
    list &&
    list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox onChange={null}>
          <span>{value.name}</span>
        </Checkbox>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Collapse.Panel header="This is panel header 1" key="1">
          {renderCheckboxLists()}
        </Collapse.Panel>
      </Collapse>
      ,
    </div>
  );
};

export default CheckBox;
