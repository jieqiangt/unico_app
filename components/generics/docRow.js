"use client";

import { handleDeleteDoc, handleSubmitDoc } from "@/lib/actions";
import LinkButton from "./linkButton";

export default function DocRow({ doc, userId, buttonsClass, buttonClass, updatable }) {
  const { docDetails, lineItems } = doc;

  const { docNum, docDate, createdBy, lastUpdatedBy } = docDetails;

  return (
    <tr>
      <td>{docNum}</td>
      <td>{docDate.toISOString().split("T")[0]}</td>
      <td>{createdBy}</td>
      <td>{lastUpdatedBy}</td>
      {updatable ? (
        <td>
          <div className={buttonsClass}>
            <LinkButton className={buttonClass} href={`/active/${docNum}`}>
              Update
            </LinkButton>
            <form action={handleDeleteDoc.bind(null, docNum)}>
              <button className={buttonClass} type="submit">
                Delete
              </button>
            </form>
            <form action={handleSubmitDoc.bind(null, doc, userId, false)}>
              <button className={buttonClass} type="submit">
                Submit
              </button>
            </form>
          </div>
        </td>
      ) : null}
    </tr>
  );
}
