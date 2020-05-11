import React from "react";
import { Collapse, Radio } from "antd";

const RadioBox = (props) => {
  const renderRadioBox = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Radio
          onChange={() => handleToggle(value._id)}
          checked={checked.indexOf(value._id) === -1 ? false : true}
        >
          <span>{value.name}</span>
        </Radio>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={["1"]}>
        <Collapse.Panel
          header="This is panel header 1"
          key="1"
        ></Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default RadioBox;
