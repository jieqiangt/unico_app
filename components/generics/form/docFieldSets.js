import FixedInput from "@/components/generics/form/fixedInput";
export default function DocFieldSets({
  docDetails,
  fieldSetClassName,
  fieldClassName,
}) {
  return (
    <>
      <fieldset className={fieldSetClassName}>
        <FixedInput
          fieldClassName={fieldClassName}
          inputName="docNum"
          inputValue={docDetails.docNum}
        >
          Document No
        </FixedInput>
        <FixedInput
          fieldClassName={fieldClassName}
          inputName="createdOn"
          inputValue={docDetails.createdOn}
        >
          CreatedOn
        </FixedInput>
        <FixedInput
          fieldClassName={fieldClassName}
          inputName="createdBy"
          inputValue={docDetails.createdBy}
        >
          Created By
        </FixedInput>
      </fieldset>
    </>
  );
}
