"use client";

import { getEmployeesOptions, getProcessTypesOptions } from "@/lib/utils";
import LineItemUnit from "./lineItemUnit";
import DateTimeInput from "../generics/form/dateTimeInput";
import SelectInput from "../generics/form/selectInput";

export default function LineItemRow({
  lineItem,
  lineIdx,
  handleDeleteLineItem,
  handleAddLineUnit,
  handleChangeInLineItem,
  handleDeleteLineUnit,
  handleChangeInLineUnit,
  classes,
  productDetails,
  processingEmpsOptions,
}) {
  const inputs = lineItem.inputs;
  const outputs = lineItem.outputs;
  const processTypeOptions = getProcessTypesOptions();
  return (
    <li className={classes["update-form-lineItem"]}>
      <div className={classes["update-form-lineItem-header"]}>
        <div className={classes["update-form-lineItem-titleBox"]}>
          <p className={classes["update-form-lineItem-title"]}>
            Line {lineIdx + 1}
          </p>
          <button
            className={classes["update-form-lineItem-button-deleteLineItem"]}
            type="button"
            onClick={() => handleDeleteLineItem(lineIdx)}
          >
            Delete Line Item
          </button>
        </div>
        <div className={classes["update-form-lineItem-details"]}>
          <DateTimeInput
            fieldClassName={classes["update-form-lineItem-processStart"]}
            inputName="processStart"
            inputValue={lineItem.processStart}
            onChangeHandler={handleChangeInLineItem.bind(null, lineIdx)}
          >
            Process Start
          </DateTimeInput>
          <DateTimeInput
            fieldClassName={classes["update-form-lineItem-processEnd"]}
            inputName="processEnd"
            inputValue={lineItem.processEnd}
            onChangeHandler={handleChangeInLineItem.bind(null, lineIdx)}
          >
            Process End
          </DateTimeInput>
          <SelectInput
            fieldClassName={classes["update-form-lineItem-processType"]}
            options={processTypeOptions}
            inputName="processType"
            selectedValue={lineItem.processType}
            onChangeHandler={handleChangeInLineItem.bind(null, lineIdx)}
          >
            Process Type
          </SelectInput>
          <SelectInput
            fieldClassName={classes["update-form-lineItem-processedBy"]}
            options={processingEmpsOptions}
            inputName="processedBy"
            selectedValue={lineItem.processedBy}
            onChangeHandler={handleChangeInLineItem.bind(null, lineIdx)}
          >
            Processed By
          </SelectInput>
        </div>
      </div>
      <LineItemUnit
        lineId={lineItem.lineId}
        unitType="inputs"
        units={inputs}
        handleAddLineUnit={handleAddLineUnit}
        handleDeleteLineUnit={handleDeleteLineUnit}
        handleChangeInLineUnit={handleChangeInLineUnit}
        classes={classes}
        productDetails={productDetails}
      />
      <LineItemUnit
        lineId={lineItem.lineId}
        unitType="outputs"
        units={outputs}
        handleAddLineUnit={handleAddLineUnit}
        handleDeleteLineUnit={handleDeleteLineUnit}
        handleChangeInLineUnit={handleChangeInLineUnit}
        classes={classes}
        productDetails={productDetails}
      />
    </li>
  );
}
