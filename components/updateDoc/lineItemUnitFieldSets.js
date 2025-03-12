"use client";

import { useState } from "react";
import SelectInput from "../generics/form/selectInput";
import TextInput from "../generics/form/textInput";
import FixedInput from "../generics/form/fixedInput";

export default function LineItemUnitFieldSets({
  unitDetails,
  unitType,
  unitId,
  handleDeleteLineUnit,
  handleChangeInLineUnit,
  lineId,
  classes,
  productDetails,
}) {
  const [productName, setProductName] = useState(unitDetails.productName);
  const [uom, setUom] = useState(unitDetails.uom);

  const handleChangeProductCode = (event) => {
    const productCode = event.target.value;
    const newProductName = productDetails.filter(
      (product) => product.productCode === productCode
    )[0].productName;
    const newUom = productDetails.filter(
      (product) => product.productCode === productCode
    )[0].uom;
    setProductName(() => newProductName);
    setUom(() => newUom);
    handleChangeInLineUnit(
      "productCode",
      productCode,
      unitType,
      lineId,
      unitId
    );
    handleChangeInLineUnit(
      "productName",
      newProductName,
      unitType,
      lineId,
      unitId
    );
    handleChangeInLineUnit("uom", newUom, unitType, lineId, unitId);
  };

  const productCodeOptions = productDetails.map((product) => ({
    value: product.productCode,
    label: product.productCode,
  }));

  return (
    <li
      className={classes["update-form-lineItem-unit"]}
      key={`${unitDetails.productCode}${unitId}`}
    >
      <fieldset className={classes["update-form-lineItem-unit-fields"]}>
        <SelectInput
          inputName={`${unitType}ProductCode${unitId}`}
          selectedValue={unitDetails.productCode}
          options={productCodeOptions}
          onChange={handleChangeProductCode}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
        >
          Product Code
        </SelectInput>
        <FixedInput
          inputName={`${unitType}ProductName${unitId}`}
          inputValue={unitDetails.productName}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
        >
          Product Name
        </FixedInput>
        <FixedInput
          inputName={`${unitType}Uom${unitId}`}
          inputValue={unitDetails.uom}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
        >
          UoM
        </FixedInput>
        <TextInput
          inputName={`${unitType}Quantity${unitId}`}
          inputValue={unitDetails.quantity}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
          onChange={(event) =>
            handleChangeInLineUnit(
              "quantity",
              event.target.value,
              unitType,
              lineId,
              unitId
            )
          }
        >
          Quantity
        </TextInput>
        <TextInput
          inputName={`${unitType}Weight${unitId}`}
          inputValue={unitDetails.weight}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
          onChange={(event) =>
            handleChangeInLineUnit(
              "weight",
              event.target.value,
              unitType,
              lineId,
              unitId
            )
          }
        >
          Weight-KG
        </TextInput>
      </fieldset>
      <button
        className={classes["update-form-lineItem-button-deleteUnit"]}
        type="button"
        onClick={() => handleDeleteLineUnit(unitType, lineId, unitId)}
      >
        Delete
      </button>
    </li>
  );
}
