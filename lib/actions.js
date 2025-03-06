"use server";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import { getCurrentDateTime, getLastDocNum } from "./utils";
import {
  createAuthSession,
  destroyAuthSession,
  hashPassword,
  verifyLogin,
} from "./auth";
import { createProcessingDocument, createUser, deleteUser } from "./db";
import { revalidatePath } from "next/cache";
import { create } from "domain";

export async function handleLogin(prevState, formData) {
  const username = formData.get("username");
  const password = formData.get("password");

  try {
    const userId = await verifyLogin(username, password);
    await createAuthSession(userId);
  } catch (err) {
    return {
      errors: {
        auth: err.message,
      },
    };
  }
  redirect("/");
}

export async function handleCreateUser(prevState, formData, userId) {
  const username = formData.get("username");
  const password = formData.get("password");
  const passwordCfm = formData.get("passwordCfm");
  const email = formData.get("email");
  const roleId = formData.get("role");

  const errors = {};

  // validate fields
  if (password.trim().length < 8) {
    errors.passwordLength = "Password must be at least 8 characters long.";
  }

  if (!(password == passwordCfm)) {
    errors.passwordMatch = "Passwords do not match.";
  }

  if (username.trim().length == 0) {
    errors.usernameMissing = "Username is required.";
  }

  if ((roleId == 1) & (email.trim().length == 0)) {
    errors.adminEmail = "Email is required for admin user creation.";
  }

  if ((roleId == 1) & (email.split("@")[1] != "unicofoods.com")) {
    errors.unicoEmail = "Unicofoods email required.";
  }

  const hashedPassword = await hashPassword(password);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }

  let inputEmail = email;

  if (!email) {
    inputEmail = null;
  }

  try {
    await createUser({
      username,
      hashedPassword,
      inputEmail,
      roleId,
      createdBy: userId,
    });
  } catch (err) {
    if (err.code == "ER_DUP_ENTRY") {
      errors.duplicate = "Username or email already exists.";
    }
  } finally {
    if (Object.keys(errors).length > 0) {
      return { errors };
    }
    revalidatePath("/admin/users");
    redirect("/admin/users");
  }
}

export async function handleLogOut() {
  await destroyAuthSession();
  redirect("/login");
}

export async function handleCreateDoc(userId) {
  const { todayDateStr } = getCurrentDateTime();
  const docDetails = {
    docDate: todayDateStr,
    createdBy: userId,
    lastUpdatedBy: userId,
    docStatus: "Active",
  };

  let insertedDocNum;
  try {
    insertedDocNum = await createProcessingDocument(docDetails);
  } catch (err) {
    console.log(err);
  }

  revalidatePath("/active");
  redirect(`/active/${insertedDocNum}`);
}

export async function updateDoc(formData, lineItems) {
  const docDetails = {
    docNum: formData.get("docNum"),
    createdOn: formData.get("createdOn"),
    createdBy: formData.get("createdBy"),
    processType: formData.get("processType"),
    processedBy: formData.get("processedBy"),
    processStart: formData.get("processStart"),
    processEnd: formData.get("processEnd"),
    weightLost: formData.get("weightLost"),
  };
  const newDoc = {
    docDetails: docDetails,
    lineItems: lineItems,
  };

  const data = await fs.readFile("./dummyData/dummyDocs.json");
  const docList = JSON.parse(data).docs;
  const newDocList = docList.filter(
    (doc) => doc.docDetails.docNum != docDetails.docNum
  );
  newDocList.push(newDoc);
  const output = JSON.stringify({ docs: newDocList });
  await fs.writeFile("./dummyData/dummyDocs.json", output, (err) => {
    if (err) throw err;
  });

  redirect(`/active/`);
}

export async function deleteDoc(docNum) {
  const data = await fs.readFile("./dummyData/dummyDocs.json");
  const docList = JSON.parse(data).docs;
  const newDocList = docList.filter((doc) => doc.docDetails.docNum != docNum);
  const output = JSON.stringify({ docs: newDocList });
  await fs.writeFile("./dummyData/dummyDocs.json", output, (err) => {
    if (err) throw err;
  });

  redirect(`/active/`);
}

export async function submitDocs() {
  const incomingDocs = await fs.readFile("./dummyData/dummyDocs.json");
  const confirmedDocs = await fs.readFile(
    "./dummyData/dummyConfirmedDocs.json"
  );
  const incomingDocList = JSON.parse(incomingDocs).docs;
  let confirmedDocList = [];
  if (confirmedDocs.length != 0) {
    confirmedDocList = JSON.parse(confirmedDocs).docs;
  }
  const outputDocList = [...confirmedDocList, ...incomingDocList];
  const output = JSON.stringify({ docs: outputDocList });
  await fs.writeFile("./dummyData/dummyConfirmedDocs.json", output, (err) => {
    if (err) throw err;
  });

  const clearedDummyDocs = JSON.stringify({ docs: [] });
  await fs.writeFile("./dummyData/dummyDocs.json", clearedDummyDocs, (err) => {
    if (err) throw err;
  });

  redirect(`/confirmed/`);
}

export async function searchDocuments(formData, allDocs) {
  const searchDocNum = formData.get("docNum");
  let startDate = formData.get("createdOnStart");
  let endDate = formData.get("createdOnEnd");
  if (startDate) {
    startDate = new Date(startDate);
    startDate.setHours(0);
    startDate.setMinutes(0);
  } else {
    startDate = new Date(2020, 0, 1);
    startDate.setHours(0);
    startDate.setMinutes(0);
  }
  if (endDate) {
    endDate = new Date(`${endDate}T:23:59`);
  } else {
    endDate = new Date();
    endDate.setHours(23);
    endDate.setMinutes(59);
  }

  const filterFn = (doc) => {
    const { docNum, createdOn } = doc.docDetails;

    const createdOnDate = new Date(createdOn);
    if (!searchDocNum)
      return createdOnDate >= startDate && createdOnDate <= endDate;
    return (
      docNum == searchDocNum &&
      createdOnDate >= startDate &&
      createdOnDate <= endDate
    );
  };

  const foundDocs = allDocs.filter(filterFn);
  return foundDocs;
}

export async function handleDeleteUser(userId, formData) {
  await deleteUser(userId);
  revalidatePath("admin/users");
}
