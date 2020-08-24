import React, { useRef, useEffect } from "react";
import ReactSelect from "react-select";
import { useField } from "@unform/core";

const Select = ({ name, options, ...rest }) => {
  const selectRef = useRef(null);
  const { fieldName, defaultValue, registerField, error } = useField(name);

  console.log(defaultValue);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: selectRef.current,
      path: "state.value",
      getValue: ref => {
        if (rest.isMulti) {
          if (!ref.state.value) {
            return [];
          }
          return ref.state.value.map(option => option.value);
        } else {
          if (!ref.state.value) {
            return "";
          }
          return ref.state.value.value;
        }
      }
    });
  }, [fieldName, registerField, rest.isMulti]);

  return (
    <ReactSelect
      defaultValue={
        defaultValue && options.find(option => option.value === defaultValue)
      }
      ref={selectRef}
      classNamePrefix="react-select"
      options={options}
      {...rest}
    />
  );
};
export default Select;
