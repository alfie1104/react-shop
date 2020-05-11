import React, { useState } from "react";
import { Collapse, Checkbox } from "antd";

const CheckBox = (props) => {
  const [checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    // 클릭한 것의 인덱스를 구하고
    const currentIndex = checked.indexOf(value);
    //전체 checked된 state에서 현재 누른 checkbox가 이미 있다면

    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.handleFilters(newChecked);
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={checked.indexOf(value._id) === -1 ? false : true}
        >
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
    </div>
  );
};

export default CheckBox;
