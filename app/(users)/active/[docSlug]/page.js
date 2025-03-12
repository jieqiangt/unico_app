import UpdateDocForm from "@/components/updateDoc/updateDocForm";
import classes from "./page.module.scss";
import {
  getAllProductDetails,
  getProcessingEmpsOptions,
  getLineItemsForProcessDoc,
  getDocDetails,
  getLineUnitsForProcessDoc,
} from "@/lib/db";
import { verifyAuthSession } from "@/lib/auth";
import { formatLineitems } from "@/lib/utils";

export default async function UpdateDocumentPage({ params }) {
  const { user } = await verifyAuthSession();
  if (!user) {
    redirect("/login");
  }

  const userId = user.id;
  const docSlug = await params;
  const docNum = docSlug.docSlug;
  const docDetails = await getDocDetails(docNum);
  const lineItems = await getLineItemsForProcessDoc(docNum);
  const [inputs, outputs] = await getLineUnitsForProcessDoc(docNum);
  const lineItemsWithUnits = formatLineitems(lineItems, inputs, outputs);
  const productDetails = await getAllProductDetails();
  const processingEmpsOptions = await getProcessingEmpsOptions();

  return (
    <main className={classes["update"]}>
      <UpdateDocForm
        classes={classes}
        docDetails={docDetails[0]}
        initialLineItems={lineItemsWithUnits}
        userId={userId}
        productDetails={productDetails}
        processingEmpsOptions={processingEmpsOptions}
      />
    </main>
  );
}
