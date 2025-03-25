"use client";
import { useState } from "react";
import DocFieldSets from "@/components/generics/form/docFieldSets";
import LineItemRow from "./lineItemRow";
import { handleUpdateDoc } from "@/lib/actions";

const emptyLineUnit = {
  lineUnitId: null,
  refLineId: null,
  pdtCode: null,
  pdtName: null,
  foreignName: null,
  weight: null,
  quantity: null,
  uom: null,
};

const emptyLineItem = {
  lineId: null,
  processedByLabel: null,
  processedBy: "",
  processedType: null,
  processedTypeLabel: null,
  processStart: null,
  processEnd: null,
  inputs: [emptyLineUnit],
  outputs: [emptyLineUnit],
};
export default function UpdateDocForm({
  docDetails,
  initialLineItems,
  classes,
  productDetails,
  processingEmpsOptions,
  userId,
}) {
  const [lineItems, setLineItems] = useState(initialLineItems);

  const handleAddLineItem = (event) => {
    event.preventDefault();
    setLineItems((oldlineItems) => {
      const newLineItems = JSON.parse(JSON.stringify(oldlineItems));
      newLineItems.push(emptyLineItem);
      return newLineItems;
    });
  };
  const handleDeleteLineItem = (lineIdx) => {
    setLineItems((oldLineItems) => {
      const newLineItems = JSON.parse(JSON.stringify(oldLineItems));
      newLineItems.splice(lineIdx, 1);
      return newLineItems;
    });
  };

  const handleChangeInLineItem = (lineIdx, event) => {
    event.preventDefault();
    const { nodeName, name, value } = event.target;
    let label;
    let labelFieldName = `${name}Label`;

    if (nodeName === "SELECT") {
      label = event.target.selectedOptions[0].label;
    }

    setLineItems((oldLineItems) => {
      const newLineItems = JSON.parse(JSON.stringify(oldLineItems));
      newLineItems[lineIdx][name] = value;
      if (label) {
        newLineItems[lineIdx][labelFieldName] = label;
      }
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
        {lineItems.map((lineItem, lineIdx) => {
          return (
            <LineItemRow
              key={`${lineIdx}-${lineItem.processedBy}-${lineItem.processType}-${lineItem.processStart}-${lineItem.processEnd}`}
              lineIdx={lineIdx}
              lineItem={lineItem}
              handleDeleteLineItem={handleDeleteLineItem}
              handleAddLineUnit={handleAddLineUnit}
              handleChangeInLineItem={handleChangeInLineItem}
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
    <form
      className={classes["update-form"]}
      action={handleUpdateDoc.bind(null, lineItems, userId)}
    >
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
