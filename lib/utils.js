import outstandingDocs from "@/dummyData/dummyDocs.json";
import confirmedDocs from "@/dummyData/dummyConfirmedDocs.json";
import processTypes from "@/dummyData/processTypeOptions.json";
import employees from "@/dummyData/employeesOptions.json";
import products from "@/dummyData/productCodeOptions.json";
export function getCurrentDateTime() {
  const date = new Date();
  const todayEpoch = Date.now();
  const monthNum = date.getMonth() + 1;

  const monthNumStr = monthNum < 10 ? `0${monthNum}` : `${monthNum}`;
  const dayNumStr =
    date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`;
  const todayDateStr = `${date.getFullYear()}-${monthNumStr}-${dayNumStr}`;
  const todayDateTimeStr = `${date.getFullYear()}-${monthNumStr}-${dayNumStr}T${date.getHours()}:${date.getMinutes()}`;

  return { todayEpoch, todayDateStr, todayDateTimeStr };
}

export function getOutstandingDocuments() {
  return outstandingDocs.docs;
}

export function getConfirmedDocuments() {
  return confirmedDocs.docs;
}

export function getDocDetails(docNum) {
  return outstandingDocs.docs.filter(
    (doc) => doc.docDetails.docNum === docNum.toString()
  )[0];
}

export function getProcessTypesOptions() {
  return processTypes.processTypes;
}

export function getEmployeesOptions() {
  return employees.employees;
}

export function getLastDocNum() {
  let docsList = [...outstandingDocs.docs];
  if (docsList.length == 0) {
    docsList = [...confirmedDocs.docs];
  }
  const docNums = docsList.map((doc) => doc.docDetails.docNum);
  const latestDocNum = Math.max(...docNums);

  if (latestDocNum) {
    return -1;
  }

  return latestDocNum;
}

export function getProductCodeOptions() {
  return products.products;
}
