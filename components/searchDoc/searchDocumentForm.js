"use client";

import { getEmployeesOptions, getProcessTypesOptions } from "@/lib/utils";
import DateInput from "../generics/form/dateInput";
import SelectInput from "../generics/form/selectInput";
import TextInput from "../generics/form/textInput";

export default function SearchDocumentForm({
  onSubmitFn,
  formClassName,
  fieldClassName,
  fieldSetClassName,
  buttonClassName,
}) {
  const employeeOptions = getEmployeesOptions();
  const processTypeOptions = getProcessTypesOptions();
  return (
    <form className={formClassName} action={onSubmitFn}>
      <fieldset className={fieldSetClassName}>
        <TextInput fieldClassName={fieldClassName} inputName="docNum">
          Document No
        </TextInput>
        <DateInput fieldClassName={fieldClassName} inputName="createdOnStart">
          Created Start Date
        </DateInput>
        <DateInput fieldClassName={fieldClassName} inputName="createdOnEnd">
          Created End Date
        </DateInput>
        {/* <SelectInput options={processTypeOptions} inputName="processType" inputValue={null}>
          Process Type
        </SelectInput>
        <SelectInput options={employeeOptions} inputName="processedBy">
          Processed By
        </SelectInput>
        <SelectInput options={employeeOptions} inputName="createdBy">Created By</SelectInput> */}
      </fieldset>
      <button className={buttonClassName}type="submit">Search</button>
    </form>
  );
}
