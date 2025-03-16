"use server";

import mysql from "mysql2/promise";
const { MongoClient, ServerApiVersion } = require("mongodb");

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
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 1800, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
  });

  return pool;
}

export async function createMongoClient() {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PW}@${process.env.MONGODB_HOST}/?retryWrites=true&w=majority&appName=${process.env.MONGODB_NAME}`;
  const client = new MongoClient(uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });
  return client;
}

export async function testMongoClient() {
  const client = await createMongoClient();
  try {
    await client.connect();
    await client.db("unico").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    await client.close();
  }
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
        pdt_code AS 'productCode',
        pdt_name AS 'productName',
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
          unit_idx AS 'unitIdx',
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
          unit_idx AS 'unitIdx',
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
  const conn = await createMySQLConnection();
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
    "INSERT INTO trs_processing_line_inputs (ref_doc_num, ref_line_id, unit_idx) VALUES (?,?,?)",
    [insertedDocNum, insertedLineId, 0]
  );
  await conn.execute(
    "INSERT INTO trs_processing_line_outputs (ref_doc_num, ref_line_id, unit_idx) VALUES (?,?,?)",
    [insertedDocNum, insertedLineId, 0]
  );

  await conn.close();
  return insertedDocNum;
}
