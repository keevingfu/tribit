#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import csv
import os

def create_tables_if_not_exist(cursor):
    """创建数据表（如果不存在）"""
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS SearchSuggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modifier_type TEXT,
        modifier TEXT,
        suggestion_text TEXT,
        language TEXT,
        keyword TEXT,
        search_volume INTEGER,
        cost_per_click REAL
    )
    ''')
    
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS RegionalSearchSuggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modifier_type TEXT,
        modifier TEXT,
        suggestion TEXT,
        language TEXT,
        region TEXT,
        keyword TEXT,
        search_volume INTEGER,
        cost_per_click REAL
    )
    ''')

def import_regional_search_suggestions(cursor, file_path):
    """导入区域性搜索建议数据"""
    with open(file_path, 'r', encoding='utf-8-sig') as f:
        # 跳过标题行
        next(f)
        reader = csv.reader(f)
        
        # 解析CSV文件头部，确定数据起始行
        header_found = False
        rows_to_insert = []
        
        for row in reader:
            if len(row) < 7:  # 跳过空行或格式不正确的行
                continue
                
            modifier_type = row[0]
            modifier = row[1]
            suggestion = row[2]
            language = row[3]
            region = row[4]
            keyword = row[5]
            
            # 处理搜索量和CPC，可能为空
            search_volume = row[6] if row[6] else 0
            cost_per_click = row[7] if len(row) > 7 and row[7] else 0.0
            
            # 将字符串转换为数值
            try:
                search_volume = int(search_volume)
            except ValueError:
                search_volume = 0
                
            try:
                cost_per_click = float(cost_per_click)
            except ValueError:
                cost_per_click = 0.0
                
            rows_to_insert.append((
                modifier_type, modifier, suggestion, language, region,
                keyword, search_volume, cost_per_click
            ))
        
        # 批量插入数据
        cursor.executemany('''
        INSERT INTO RegionalSearchSuggestions 
        (modifier_type, modifier, suggestion, language, region, keyword, search_volume, cost_per_click)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', rows_to_insert)
        
        return len(rows_to_insert)

def main():
    """主函数"""
    db_path = os.path.join('data', 'tribit.db')
    csv_path = os.path.join('search', 'tribit-en-us-suggestions-24-02-2025 (1).csv')
    
    # 确保数据目录存在
    os.makedirs('data', exist_ok=True)
    
    # 连接到SQLite数据库
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # 创建表格（如果不存在）
    create_tables_if_not_exist(cursor)
    
    # 导入区域性搜索建议数据
    rows_imported = import_regional_search_suggestions(cursor, csv_path)
    
    # 提交变更并关闭连接
    conn.commit()
    conn.close()
    
    print(f"导入完成：已从 {os.path.basename(csv_path)} 导入 {rows_imported} 条区域性搜索建议数据到 {db_path}")

if __name__ == '__main__':
    main()
