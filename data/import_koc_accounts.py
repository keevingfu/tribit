#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import sqlite3
import os

# 连接到数据库
conn = sqlite3.connect('data/tribit.db')
cursor = conn.cursor()

# 读取CSV文件
csv_file_path = 'selfkoc/tribit_selkoc_account_20250410.csv'

# 准备导入数据
data_to_import = []

with open(csv_file_path, 'r', encoding='utf-8-sig') as file:
    csv_reader = csv.reader(file)
    # 跳过标题行
    next(csv_reader)
    
    for row in csv_reader:
        # 检查行是否有足够的数据
        if len(row) >= 4:
            channel = row[1] if row[1] else ""
            selfkoc = row[2] if row[2] else ""
            account_url = row[3] if row[3] else ""
            
            # 只有当必要字段都有值时才添加
            if channel and selfkoc and account_url:
                # 添加到导入列表
                data_to_import.append((
                    channel,
                    account_url,
                    selfkoc
                ))

# 插入数据
if data_to_import:
    cursor.executemany('''
        INSERT INTO selfkoc_accounts 
        (channel, account_url, selfkoc)
        VALUES (?, ?, ?)
    ''', data_to_import)
    
    # 提交更改
    conn.commit()
    print(f"成功导入 {len(data_to_import)} 条记录到 selfkoc_accounts 表")
else:
    print("没有找到可导入的数据")

# 关闭连接
conn.close()
