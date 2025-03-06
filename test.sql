SELECT
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
    ref_doc_num = ?;