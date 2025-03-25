import DocRow from "@/components/generics/docRow";
import SubmitButton from "@/components/generics/submitButton";
import { handleCreateDoc } from "@/lib/actions";
import classes from "./page.module.scss";
import FunctionButton from "@/components/generics/functionButton";
import { verifyAuthSession } from "@/lib/auth";
import { getActiveDocuments } from "@/lib/db";

export default async function ActivePage() {
  const { user } = await verifyAuthSession();
  if (!user) {
    redirect("/login");
  }

  const docs = await getActiveDocuments();

  const docsDisplay = docs.length ? (
    <table className={classes["active-table"]}>
      <thead>
        <tr>
          <th>Document Number</th>
          <th>Document Date</th>
          <th>Created By</th>
          <th>Last Updated By</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {docs.map((doc) => {
          return (
            <DocRow
              buttonsClass={classes["active-table-buttons"]}
              buttonClass={classes["active-table-button"]}
              doc={doc}
              classes={classes}
              key={doc.docDetails.docNum}
              updatable={true}
              userId={user.id}
            />
          );
        })}
      </tbody>
    </table>
  ) : (
    <p className={classes["active-noDocs"]}>No active documents</p>
  );
  return (
    <main className={classes["active"]}>
      <p className={classes["active-summaryText"]}>
        Total Outstanding Documents: {docs.length}
      </p>
      <div className={classes["active-buttons"]}>
        <FunctionButton
          className={classes["active-button"]}
          onClickFn={handleCreateDoc.bind(null, user.id)}
        >
          New Document
        </FunctionButton>
        <SubmitButton
          className={classes["active-button"]}
          // submitFn={submitDocs}
        >
          Submit All Documents
        </SubmitButton>
      </div>
      {docsDisplay}
    </main>
  );
}
