import LineItemUnitFieldSets from "./lineItemUnitFieldSets";

export default function LineItemUnit({
  lineIdx,
  unitType,
  units,
  handleAddLineUnit,
  handleDeleteLineUnit,
  handleChangeInLineUnit,
  classes,
  productDetails
}) {
  return (
    <div className={classes[`update-form-lineItem-${unitType}`]}>
      <div className={classes["update-form-lineItem-units-header"]}>
        <p className={classes["update-form-lineItem-units-title"]}>
          {unitType}
        </p>
        <button
          className={classes["update-form-lineItem-button-addUnit"]}
          type="button"
          onClick={() => handleAddLineUnit(unitType, lineIdx)}
        >
          Add
        </button>
      </div>
      <ul className={classes["update-form-lineItem-units"]}>
        {units.map((unit, unitIdx) => {
          return (
            <LineItemUnitFieldSets
              classes={classes}
              key={unitIdx}
              lineIdx={lineIdx}
              unitIdx={unitIdx}
              unitDetails={unit}
              unitType={unitType}
              handleDeleteLineUnit={handleDeleteLineUnit}
              handleChangeInLineUnit={handleChangeInLineUnit}
              productDetails={productDetails}
            />
          );
        })}
      </ul>
    </div>
  );
}
