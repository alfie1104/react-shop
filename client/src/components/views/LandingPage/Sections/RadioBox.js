import React, { useState } from "react";
import { Collapse, Radio } from "antd";

const RadioBox = (props) => {
  const [radioValue, setRadioValue] = useState(0);
  const renderRadioBox = () =>
    props.list &&
    props.list.map((value) => (
      <Radio key={value._id} value={value._id}>
        {value.name}
      </Radio>
    ));

  const handleChange = (event) => {
    setRadioValue(event.target.value);
    props.handleFilters(event.target.value);
  };

  return (
    <div>
      <Collapse defaultActiveKey={["0"]}>
        <Collapse.Panel header="Price" key="1">
          <Radio.Group onChange={handleChange} value={radioValue}>
            {renderRadioBox()}
          </Radio.Group>
        </Collapse.Panel>
      </Collapse>
    </div>
  );
};

export default RadioBox;
