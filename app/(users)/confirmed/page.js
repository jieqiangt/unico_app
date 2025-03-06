"use client";

import DocRow from "@/components/generics/docRow";
import SearchDocumentForm from "@/components/searchDoc/searchDocumentForm";
import { searchDocuments } from "@/lib/actions";
import { getConfirmedDocuments } from "@/lib/utils";
import { useState } from "react";
import classes from "./page.module.scss";
export default function ConfirmedDocPage() {
  const allDocs = getConfirmedDocuments();
  const [displayDocs, setDisplayDocs] = useState(allDocs);
  const handleSearch = async (formData, allDocs) => {
    const foundDocs = await searchDocuments(formData, allDocs);
    setDisplayDocs(() => foundDocs);
  };

  const docsDisplay =
    displayDocs && displayDocs.length ? (
      <table className={classes["confirmed-table"]}>
        <thead>
          <tr>
            <th>Document Number</th>
            <th>Created On</th>
            <th>Created By</th>
            <th>Process Type</th>
            <th>Process Start</th>
            <th>Process End</th>
            <th>Processed By</th>
            <th>Weight Loss-KG</th>
            <th>Line Inputs</th>
            <th>Line Outputs</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {displayDocs.map((doc) => {
            return <DocRow doc={doc} key={doc.docDetails.docNum} />;
          })}
        </tbody>
      </table>
    ) : (
      <p className={classes["confirmed-noDocs"]}>
        No confirmed documents found!
      </p>
    );
  return (
    <main className={classes["confirmed"]}>
      <SearchDocumentForm
        formClassName={classes["confirmed-form"]}
        fieldSetClassName={classes["confirmed-form-fields"]}
        fieldClassName={classes["confirmed-form-field"]}
        buttonClassName={classes["confirmed-form-submitButton"]}
        onSubmitFn={(formData) => handleSearch(formData, allDocs)}
      />
      {docsDisplay}
    </main>
  );
}
