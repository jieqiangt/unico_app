"use server";

import mysql from "mysql2/promise";
import { formatLineitems, formatToDateTimeStr } from "./utils";

export async function createMySQLConnection() {
  const conn = await mysql.createConnection({
    host: process.env.RDS_DB_HOST,
    user: process.env.RDS_DB_USER,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_DB_PW,
  });

  return conn;
}

export async function createMySQLConnectionPool() {
  const pool = mysql.createPool({
    host: process.env.RDS_DB_HOST,
    user: process.env.RDS_DB_USER,
    database: process.env.RDS_DB_NAME,
    password: process.env.RDS_DB_PW,
    waitForConnections: true,
    connectionLimit: 30,
    maxIdle: 5, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 5000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 5,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}

export async function testMySQLConnection() {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query("SELECT 1");
    if (results.length > 0) {
      console.log(
        "Pinged your deployment. You successfully connected to MySQL!"
      );
    }
  } finally {
    await conn.close();
  }
}

export async function getRoleOptions() {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query(
      "SELECT id AS 'value', role_name AS 'label' FROM dim_roles"
    );
    if (results.length <= 0) {
      throw Error("Unable to get roles from database.");
    }
    return results;
  } finally {
    await conn.close();
  }
}

export async function getProcessingEmpsOptions() {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query(
      `SELECT
        trs_users.id AS 'value',
        username AS 'label'
    FROM
        trs_users
    LEFT JOIN dim_roles ON trs_users.role_id = dim_roles.id
        WHERE processing_floor IS NOT NULL
        AND is_active = 1`
    );
    if (results.length <= 0) {
      throw Error("Unable to get users from database.");
    }
    return results;
  } finally {
    await conn.close();
  }
}

export async function getAllUsers() {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query(
      `SELECT
        trs_users.id AS 'userId',
        username AS 'username',
        IFNULL(email, 'N/A') AS 'email',
        role_name AS 'role',
        CASE
            WHEN is_active = 1 THEN 'active'
            ELSE 'inactive'
        END AS 'status',
        IFNULL(processing_floor, 'N/A') AS 'processingFloor'
    FROM
        trs_users
    LEFT JOIN dim_roles ON trs_users.role_id = dim_roles.id`
    );
    if (results.length <= 0) {
      throw Error("Unable to get users from database.");
    }
    return results;
  } finally {
    await conn.close();
  }
}

export async function getAllProductDetails() {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query(
      `SELECT 
        pdt_code AS 'pdtCode',
        pdt_name AS 'pdtName',
        foreign_pdt_name AS 'foreignName',
        uom AS 'uom'
      FROM dim_pdts
        WHERE is_active = 'Y';`
    );
    if (results.length <= 0) {
      throw Error("Unable to get product details from database.");
    }
    return results;
  } finally {
    await conn.close();
  }
}

export async function getDocDetails(docNum) {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query(
      `SELECT
          doc_num AS 'docNum',
          doc_date AS 'docDate',
          doc_status AS 'docStatus',
          created.username AS 'createdBy',
          updated.username AS 'lastUpdatedBy',
          trs_processing_documents.created_on AS 'createdOn'
      FROM
          trs_processing_documents
          LEFT JOIN trs_users AS created ON trs_processing_documents.created_by = created.id
          LEFT JOIN trs_users AS updated ON trs_processing_documents.last_updated_by = updated.id
      WHERE
        doc_num = ?;`,
      [docNum]
    );
    if (results.length <= 0) {
      throw Error("Unable to get product details from database.");
    }
    return results;
  } finally {
    await conn.close();
  }
}

export async function getLineUnitsForProcessDoc(docNum) {
  const conn = await createMySQLConnection();
  try {
    const [inputs, fields] = await conn.query(
      `SELECT
          line_input_id AS 'lineUnitId',
          ref_line_id AS 'refLineId',
          pdt_code AS 'pdtCode',
          pdt_name AS 'pdtName',
          foreign_name AS 'foreignName',
          uom AS 'uom',
          weight AS  'weight',
          quantity AS 'quantity'
      FROM
          trs_processing_line_inputs
      WHERE
         ref_doc_num = ?`,
      [docNum]
    );

    const [outputs, _] = await conn.query(
      `SELECT
          line_output_id AS 'lineUnitId',
          ref_line_id AS 'refLineId',
          pdt_code AS 'pdtCode',
          pdt_name AS 'pdtName',
          foreign_name AS 'foreignName',
          uom AS 'uom',
          weight AS  'weight',
          quantity AS 'quantity'
      FROM
          trs_processing_line_outputs
      WHERE
         ref_doc_num = ?`,
      [docNum]
    );
    return [inputs, outputs];
  } finally {
    await conn.close();
  }
}

export async function getLineItemsForProcessDoc(docNum) {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.query(
      `SELECT
          line_id AS 'lineId',
          processed_by AS 'processedBy',
          trs_users.username AS 'processedByLabel',
          process_type AS 'processType',
          process_name AS 'processTypeLabel',
          process_start AS 'processStart',
          process_end AS 'processEnd'
      FROM
          trs_processing_lines
          LEFT JOIN trs_users ON trs_processing_lines.processed_by = trs_users.id
          LEFT JOIN dim_process_types ON trs_processing_lines.process_type = dim_process_types.id 
      WHERE
         ref_doc_num = ?`,
      [docNum]
    );
    return results;
  } finally {
    await conn.close();
  }
}

async function enrichDoc(pool, doc) {
  const conn = await pool.getConnection();
  const [lineItems, fields] = await conn.query(
    `SELECT
          line_id AS 'lineId',
          processed_by AS 'processedBy',
          trs_users.username AS 'processedByLabel',
          process_type AS 'processType',
          process_name AS 'processTypeLabel',
          process_start AS 'processStart',
          process_end AS 'processEnd'
      FROM
          trs_processing_lines
          LEFT JOIN trs_users ON trs_processing_lines.processed_by = trs_users.id
          LEFT JOIN dim_process_types ON trs_processing_lines.process_type = dim_process_types.id
      WHERE
         ref_doc_num = ?`,
    [doc.docNum]
  );
  const [inputs, _fields] = await conn.query(
    `SELECT
        line_input_id AS 'lineUnitId',
        ref_line_id AS 'refLineId',
        pdt_code AS 'pdtCode',
        pdt_name AS 'pdtName',
        foreign_name AS 'foreignName',
        uom AS 'uom',
        weight AS  'weight',
        quantity AS 'quantity'
    FROM
        trs_processing_line_inputs
    WHERE
       ref_doc_num = ?`,
    [doc.docNum]
  );

  const [outputs, __fields] = await pool.query(
    `SELECT
        line_output_id AS 'lineUnitId',
        ref_line_id AS 'refLineId',
        pdt_code AS 'pdtCode',
        pdt_name AS 'pdtName',
        foreign_name AS 'foreignName',
        uom AS 'uom',
        weight AS  'weight',
        quantity AS 'quantity'
    FROM
        trs_processing_line_outputs
    WHERE
       ref_doc_num = ?`,
    [doc.docNum]
  );
  const formattedLineItems = formatLineitems(lineItems, inputs, outputs);
  conn.release();

  return { docDetails: doc, lineItems: formattedLineItems };
}

export async function getActiveDocuments() {
  const pool = await createMySQLConnectionPool();
  const conn = await pool.getConnection();

  try {
    const [docs, ___fields] = await conn.query(
      `SELECT
          doc_num AS 'docNum',
          doc_date AS 'docDate',
          doc_status AS 'docStatus',
          created.username AS 'createdBy',
          updated.username AS 'lastUpdatedBy'
      FROM
          trs_processing_documents
          LEFT JOIN trs_users AS created ON trs_processing_documents.created_by = created.id
          LEFT JOIN trs_users AS updated ON trs_processing_documents.last_updated_by = updated.id
      WHERE
        doc_status = 'Active'
        `
    );
    conn.release();

    if (docs.length == 0) {
      return [];
    }

    const enrichedDocs = Promise.all(docs.map(enrichDoc.bind(null, pool)));
    return enrichedDocs;
  } catch (err) {
    console.log(err);
  }
}

export async function deleteUser(userId) {
  const conn = await createMySQLConnection();
  try {
    const [results, fields] = await conn.execute(
      `DELETE FROM trs_users WHERE id = ?;`,
      [userId]
    );
    return results;
  } finally {
    await conn.close();
  }
}

export async function createUser(user) {
  const conn = await createMySQLConnection();
  const { username, hashedPassword, inputEmail, roleId, createdBy } = user;

  await conn.execute(
    "INSERT INTO trs_users (username, hashed_password, email, role_id, created_by) VALUES (?, ?, ?, ?, ?)",
    [username, hashedPassword, inputEmail, roleId, createdBy]
  );

  await conn.close();
}

export async function createProcessingDocument(docDetails) {
  const { docDate, createdBy, lastUpdatedBy, docStatus } = docDetails;
  const pool = await createMySQLConnectionPool();
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();
    const processingDocInsertResult = await conn.execute(
      "INSERT INTO trs_processing_documents (doc_date, created_by, last_updated_by, doc_status) VALUES (?, ?, ?, ?)",
      [docDate, createdBy, lastUpdatedBy, docStatus]
    );
    const insertedDocNum = processingDocInsertResult[0].insertId;
    const processingLineItemInsertResult = await conn.execute(
      "INSERT INTO trs_processing_lines (ref_doc_num) VALUES (?)",
      [insertedDocNum]
    );

    const insertedLineId = processingLineItemInsertResult[0].insertId;
    await conn.execute(
      "INSERT INTO trs_processing_line_inputs (ref_doc_num, ref_line_id) VALUES (?,?)",
      [insertedDocNum, insertedLineId]
    );
    await conn.execute(
      "INSERT INTO trs_processing_line_outputs (ref_doc_num, ref_line_id) VALUES (?,?)",
      [insertedDocNum, insertedLineId]
    );
    await conn.commit();
    return insertedDocNum;
  } catch (err) {
    console.log(err);
    await conn.rollback();
    return null;
  } finally {
    conn.release();
    pool.end();
  }
}

async function updateProcessingDocument(
  conn,
  docNum,
  userId,
  todayDateTimeStr
) {
  await conn.execute(
    `UPDATE trs_processing_documents 
     SET last_updated_by = ?, updated_on = ? 
     WHERE doc_num = ?`,
    [userId, todayDateTimeStr, docNum]
  );
}

async function updateLineItem(conn, lineItem, todayDateTimeStr) {
  const { lineId, processedBy, processType, processStart, processEnd } =
    lineItem;
  await conn.execute(
    `UPDATE trs_processing_lines
     SET updated_on = ?, processed_by = ?, process_type = ?, process_start = ?, process_end = ?
     WHERE line_id = ?`,
    [
      todayDateTimeStr,
      processedBy,
      processType,
      processStart,
      processEnd,
      lineId,
    ]
  );
}

async function createLineItem(conn, lineItem, docNum) {
  const { processedBy, processType, processStart, processEnd } = lineItem;

  const lineItemInsertResult = await conn.execute(
    `INSERT INTO trs_processing_lines (ref_doc_num, processed_by, process_type, process_start, process_end) VALUES (?,?,?,?,?)`,
    [docNum, processedBy, processType, processStart, processEnd]
  );
  const refLineId = lineItemInsertResult[0].insertId;
  return refLineId;
}

async function updateLineUnit(
  conn,
  unitDetails,
  unitType,
  refLineId,
  todayDateTimeStr
) {
  const { lineUnitId, pdtCode, pdtName, foreignName, uom, weight, quantity } =
    unitDetails;
  if (unitType == "inputs") {
    await conn.execute(
      `UPDATE trs_processing_line_inputs
       SET updated_on = ?, ref_line_id = ?, pdt_code = ?, pdt_name = ?, foreign_name = ?, uom = ? , weight = ? , quantity = ? 
       WHERE line_input_id = ?`,
      [
        todayDateTimeStr,
        refLineId,
        pdtCode,
        pdtName,
        foreignName,
        uom,
        weight,
        quantity,
        lineUnitId,
      ]
    );
  }
  if (unitType == "outputs") {
    await conn.execute(
      `UPDATE trs_processing_line_outputs
       SET updated_on = ?, ref_line_id = ?, pdt_code = ?, pdt_name = ?, foreign_name = ?, uom = ? , weight = ? , quantity = ? 
       WHERE line_output_id = ?`,
      [
        todayDateTimeStr,
        refLineId,
        pdtCode,
        pdtName,
        foreignName,
        uom,
        weight,
        quantity,
        lineUnitId,
      ]
    );
  }
}
async function createLineUnit(conn, unitDetails, unitType, refLineId) {
  const { pdtCode, pdtName, foreignName, uom, weight, quantity } = unitDetails;
  if (unitType == "inputs") {
    await conn.execute(
      `INSERT INTO trs_processing_line_inputs (ref_line_id, pdt_code, pdt_name, foreign_name, uom, weight, quantity) VALUES (?,?,?,?,?,?,?)`,
      [refLineId, pdtCode, pdtName, foreignName, uom, weight, quantity]
    );
  }

  if (unitType == "outputs") {
    await conn.execute(
      `INSERT INTO trs_processing_line_outputs (ref_line_id, pdt_code, pdt_name, foreign_name, uom, weight, quantity) VALUES (?,?,?,?,?,?,?)`,
      [refLineId, pdtCode, pdtName, foreignName, uom, weight, quantity]
    );
  }
}

export async function updateExistingProcessingDocument(
  lineItems,
  userId,
  docNum,
  todayDateTimeStr
) {
  const pool = await createMySQLConnectionPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await updateProcessingDocument(conn, docNum, userId, todayDateTimeStr);
    for (const lineItem of lineItems) {
      const { lineId, inputs, outputs } = lineItem;
      let refLineId = lineId;
      let formattedLineItem;
      if (lineId) {
        formattedLineItem = {
          ...lineItem,
          processEnd:
            lineItem.processEnd && formatToDateTimeStr(lineItem.processEnd),
          processStart:
            lineItem.processStart && formatToDateTimeStr(lineItem.processStart),
        };
        await updateLineItem(conn, lineItem, todayDateTimeStr);
      } else {
        refLineId = await createLineItem(conn, lineItem, docNum);
      }
      for (const input of inputs) {
        if (input.lineUnitId) {
          await updateLineUnit(
            conn,
            input,
            "inputs",
            refLineId,
            todayDateTimeStr
          );
        } else {
          await createLineUnit(conn, input, "inputs", refLineId);
        }
      }
      for (const output of outputs) {
        if (output.lineUnitId) {
          await updateLineUnit(
            conn,
            output,
            "outputs",
            refLineId,
            todayDateTimeStr
          );
        } else {
          await createLineUnit(conn, output, "outputs", refLineId);
        }
      }
    }
    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    conn.release();
    pool.end();
  }
}

export async function deleteExistingProcessingDocument(docNum) {
  const pool = await createMySQLConnectionPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await conn.execute(
      `DELETE FROM trs_processing_line_inputs WHERE ref_doc_num = ?;`,
      [docNum]
    );

    await conn.execute(
      `DELETE FROM trs_processing_line_outputs WHERE ref_doc_num = ?;`,
      [docNum]
    );

    await conn.execute(
      `DELETE FROM trs_processing_lines WHERE ref_doc_num = ?;`,
      [docNum]
    );

    const result = await conn.execute(
      `DELETE FROM trs_processing_documents WHERE doc_num = ?;`,
      [docNum]
    );

    await conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
  } finally {
    conn.release();
    pool.end();
  }
}

async function submitProcessingDocument(conn, docDetails, lineItems) {
  const result = await conn.execute(
    `UPDATE trs_processing_documents 
     SET doc_status = "Confirmed"
     WHERE doc_num = ?`,
    [docNum]
  );
}
export async function submitSingleProcessingDocument(docNum) {
  const pool = await createMySQLConnectionPool();
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    await submitProcessingDocument(conn, docNum);
    conn.commit();
  } catch (err) {
    console.log(err);
    await conn.rollback();
  }
  conn.release();
  pool.end();
}
