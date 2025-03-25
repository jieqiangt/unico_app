import SelectInput from "../generics/form/selectInput";
import TextInput from "../generics/form/textInput";
import FixedInput from "../generics/form/fixedInput";

export default function LineItemUnitFieldSets({
  unitDetails,
  unitType,
  lineIdx,
  unitIdx,
  handleDeleteLineUnit,
  handleChangeInLineUnit,
  classes,
  productDetails,
}) {
  const handleChangePdtCode = (event) => {
    const pdtCode = event.target.value;
    const newPdtName = productDetails.filter(
      (product) => product.pdtCode === pdtCode
    )[0].pdtName;
    const newUom = productDetails.filter(
      (product) => product.pdtCode === pdtCode
    )[0].uom;

    handleChangeInLineUnit("pdtCode", pdtCode, unitType, lineIdx, unitIdx);
    handleChangeInLineUnit("pdtName", newPdtName, unitType, lineIdx, unitIdx);
    handleChangeInLineUnit("uom", newUom, unitType, lineIdx, unitIdx);
  };

  const pdtCodeOptions = productDetails.map((product) => ({
    value: product.pdtCode,
    label: product.pdtCode,
  }));

  return (
    <li
      className={classes["update-form-lineItem-unit"]}
      key={`${unitIdx}-${unitDetails.pdtCode}`}
    >
      <fieldset className={classes["update-form-lineItem-unit-fields"]}>
        <SelectInput
          inputName={`${unitType}-${unitIdx}-pdtCode`}
          selectedValue={unitDetails.pdtCode}
          options={pdtCodeOptions}
          defaultOptionText={"Select Product Code"}
          onChangeHandler={handleChangePdtCode}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
        >
          Product Code
        </SelectInput>
        <FixedInput
          inputName={`${unitType}-${unitIdx}-pdtName`}
          inputValue={unitDetails.pdtName}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
        >
          Product Name
        </FixedInput>
        <FixedInput
          inputName={`${unitType}-${unitIdx}-uom`}
          inputValue={unitDetails.uom}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
        >
          UoM
        </FixedInput>
        <TextInput
          inputName={`${unitType}-${unitIdx}-quantity`}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
          inputValue={unitDetails.quantity}
          onChangeHandler={(event) => {
            event.preventDefault();
            handleChangeInLineUnit(
              "quantity",
              event.target.value,
              unitType,
              lineIdx,
              unitIdx
            );
          }}
        >
          Quantity
        </TextInput>
        <TextInput
          inputName={`${unitType}-${unitIdx}-weight`}
          fieldClassName={classes["update-form-lineItem-unit-field"]}
          inputValue={unitDetails.weight}
          onChangeHandler={(event) => {
            event.preventDefault();
            handleChangeInLineUnit(
              "weight",
              event.target.value,
              unitType,
              lineIdx,
              unitIdx
            );
          }}
        >
          Weight-KG
        </TextInput>
      </fieldset>
      <button
        className={classes["update-form-lineItem-button-deleteUnit"]}
        type="button"
        onClick={() => handleDeleteLineUnit(unitType, lineIdx, unitIdx)}
      >
        Delete
      </button>
    </li>
  );
}
