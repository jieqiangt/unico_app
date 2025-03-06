"use client";

import { deleteDoc, updateDoc } from "@/lib/actions";
import LinkButton from "./linkButton";
import SubmitButton from "./submitButton";

export default function DocRow({ doc, buttonsClass, buttonClass, updatable }) {
  const { docDetails, lineItems } = doc;

  const {
    docNum,
    createdOn,
    createdBy,
    processStart,
    processEnd,
    processType,
    processedBy,
    weightLost,
  } = docDetails;

  let inputSummary = "No inputs";
  let outputSummary = "No outputs";

  if (lineItems) {
    lineItems.map((lineItem) => {
      const { inputs, outputs } = lineItem;
      inputSummary = inputs
        .map((input, idx) => `${idx + 1}. ${input.productName}`)
        .join(",");
      outputSummary = outputs
        .map((output, idx) => `${idx + 1}. ${output.productName}`)
        .join(", ");
    });
  }

  return (
    <tr>
      <td>{docNum}</td>
      <td>{createdOn}</td>
      <td>{createdBy}</td>
      <td>{processType}</td>
      <td>{processStart}</td>
      <td>{processEnd}</td>
      <td>{processedBy}</td>
      <td>{weightLost}</td>
      <td>{inputSummary}</td>
      <td>{outputSummary}</td>
      {updatable ? (
        <td>
          <div className={buttonsClass}>
            <LinkButton className={buttonClass} href={`/active/${docNum}`}>
              Update
            </LinkButton>
            <SubmitButton
              className={buttonClass}
              submitFn={() => deleteDoc(docNum)}
            >
              Delete
            </SubmitButton>
          </div>
        </td>
      ) : null}
    </tr>
  );
}
