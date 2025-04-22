#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import csv
import sqlite3
import os

# 连接到数据库
conn = sqlite3.connect('data/tribit.db')
cursor = conn.cursor()

# 读取CSV文件
csv_file_path = 'selfkoc/tribit_selfkoc_ins_20250410.csv'

# 准备导入数据
data_to_import = []

with open(csv_file_path, 'r', encoding='utf-8-sig') as file:
    csv_reader = csv.reader(file)
    # 跳过标题行
    next(csv_reader)
    
    for row in csv_reader:
        # 检查行是否有足够的数据
        if len(row) >= 7:
            post_url = row[0]
            likes = row[1] if row[1] else 0
            comments = row[2] if row[2] else 0
            views = row[3] if row[3] else "0"
            post_date = row[4] if row[4] else ""
            influencer = row[5] if row[5] else ""
            video_id = row[6] if row[6] else ""
            
            # 处理数字格式
            try:
                likes = int(likes)
            except ValueError:
                likes = 0
                
            try:
                comments = float(comments)
            except ValueError:
                comments = 0
            
            # 添加到导入列表
            data_to_import.append((
                "Instagram",  # channel
                post_url,
                likes,
                comments,
                views,
                post_date,
                influencer,
                video_id
            ))

# 插入数据
if data_to_import:
    cursor.executemany('''
        INSERT INTO selfkoc_instagram 
        (channel, post_url, likes, comments, views, post_date, influencer, video_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', data_to_import)
    
    # 提交更改
    conn.commit()
    print(f"成功导入 {len(data_to_import)} 条记录到 selfkoc_instagram 表")
else:
    print("没有找到可导入的数据")

# 关闭连接
conn.close()
