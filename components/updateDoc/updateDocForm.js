"use client";
import { useState } from "react";
import DocFieldSets from "@/components/generics/form/docFieldSets";
import LineItemRow from "./lineItemRow";
import { updateDoc } from "@/lib/actions";
import { getCurrentDateTime } from "@/lib/utils";

export default function UpdateDocForm({
  docDetails,
  initialLineItems,
  classes,
  productDetails,
  processingEmpsOptions,
  userId,
}) {
  const { todayEpoch, todayDateStr, todayDateTimeStr } = getCurrentDateTime();
  const [lineItems, setLineItems] = useState(initialLineItems);

  const emptyLineUnit = {
    productCode: "",
    productName: "",
    weight: "",
    quantity: "",
    uom: "",
  };

  const emptyLineItem = {
    processedType: "",
    processedBy: "",
    processedStart: todayDateTimeStr,
    processedEnd: todayDateTimeStr,
    inputs: [emptyLineUnit],
    outputs: [emptyLineUnit],
  };

  const handleUpdateDocument = (formData) => {
    updateDoc(formData, lineItems);
  };

  const handleAddLineItem = (event) => {
    event.preventDefault();
    setLineItems((oldlineItems) => [...oldlineItems, emptyLineItem]);
  };
  const handleDeleteLineItem = (lineIdx) => {
    setLineItems((oldLineItems) => {
      const newLineItems = [...oldLineItems];
      newLineItems.splice(lineIdx, 1);
      return newLineItems;
    });
  };

  const handleAddLineUnit = (unitType, lineIdx) => {
    setLineItems((oldLineItems) => {
      const newLineItems = JSON.parse(JSON.stringify(oldLineItems));
      newLineItems[lineIdx][unitType] = [
        ...newLineItems[lineIdx][unitType],
        emptyLineUnit,
      ];
      return newLineItems;
    });
  };

  const handleDeleteLineUnit = (unitType, lineIdx, unitIdx) => {
    setLineItems((oldLineItems) => {
      const newLineItems = JSON.parse(JSON.stringify(oldLineItems));
      newLineItems[lineIdx][unitType].splice(unitIdx, 1);
      return newLineItems;
    });
  };

  const handleChangeInLineUnit = (label, value, unitType, lineIdx, unitIdx) => {
    setLineItems((oldLineItems) => {
      const newLineItems = JSON.parse(JSON.stringify(oldLineItems));
      newLineItems[lineIdx][unitType][unitIdx][label] = value;
      return newLineItems;
    });
  };

  let lineItemsOutput = (
    <p className={classes["update-form-noLine"]}>No line items added.</p>
  );

  if (lineItems.length != 0) {
    lineItemsOutput = (
      <ul className={classes["update-form-lineItems"]}>
        {lineItems.map((lineItem) => {
          return (
            <LineItemRow
              key={lineItem.lineId}
              lineItem={lineItem}
              handleDeleteLineItem={handleDeleteLineItem}
              handleAddLineUnit={handleAddLineUnit}
              handleDeleteLineUnit={handleDeleteLineUnit}
              handleChangeInLineUnit={handleChangeInLineUnit}
              classes={classes}
              processingEmpsOptions={processingEmpsOptions}
              productDetails={productDetails}
            />
          );
        })}
      </ul>
    );
  }

  return (
    <form className={classes["update-form"]} action={handleUpdateDocument}>
      <DocFieldSets
        fieldSetClassName={classes["update-form-docFieldSet"]}
        fieldClassName={classes["update-form-docField"]}
        docDetails={docDetails}
      />
      <div className={classes["update-form-buttons"]}>
        <button className={classes["update-form-button"]} type="submit">
          Update Document
        </button>
        <button
          className={classes["update-form-button"]}
          type="button"
          onClick={handleAddLineItem}
        >
          Add Line Item
        </button>
      </div>
      {lineItemsOutput}
    </form>
  );
}
