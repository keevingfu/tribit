-- 验证所有表是否为空
.headers on
.mode column
.width 40 10

WITH AllTables AS (
    SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'
)
SELECT 
    name AS TableName,
    (SELECT COUNT(*) FROM (SELECT 1 FROM "' || name || '" LIMIT 1)) AS HasData
FROM 
    AllTables
ORDER BY 
    TableName;
