#!/bin/bash

# 获取所有表名
tables=$(sqlite3 data/tribit.db ".tables" | tr -s ' ' '\n' | grep -v '^$')

# 遍历每个表并检查记录数
for table in $tables; do
  count=$(sqlite3 data/tribit.db "SELECT COUNT(*) FROM \"$table\";")
  echo "$table: $count"
  
  # 如果表不为空，记录下来
  if [ "$count" -gt 0 ]; then
    echo "$table 表中有 $count 条记录" >> non_empty_tables.txt
  fi
done
