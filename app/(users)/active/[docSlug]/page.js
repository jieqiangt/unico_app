import UpdateDocForm from "@/components/updateDoc/updateDocForm";
import classes from "./page.module.scss";
import {
  getAllProductDetails,
  getProcessingEmpsOptions,
  getLineItemsForProcessDoc,
  getDocDetails,
} from "@/lib/db";
import { verifyAuthSession } from "@/lib/auth";

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
  const productDetails = await getAllProductDetails();
  const processingEmpsOptions = await getProcessingEmpsOptions();

  return (
    <main className={classes["update"]}>
      <UpdateDocForm
        classes={classes}
        docDetails={docDetails}
        initialLineItems={lineItems}
        userId={userId}
        productDetails={productDetails}
        processingEmpsOptions={processingEmpsOptions}
      />
    </main>
  );
}
