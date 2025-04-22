#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sqlite3
import csv
import re

def find_column_index(headers, possible_names):
    """查找列索引，支持多个可能的列名"""
    for name in possible_names:
        if name in headers:
            return headers.index(name)
    return None

def create_database_schema(cursor):
    """创建搜索建议数据表"""
    cursor.execute("""
    DROP TABLE IF EXISTS SearchSuggestions
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS SearchSuggestions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        modifier_type TEXT,
        modifier TEXT,
        suggestion_text TEXT,
        language TEXT,
        region TEXT DEFAULT NULL,
        keyword TEXT,
        search_volume INTEGER DEFAULT 0,
        cost_per_click REAL DEFAULT 0.0,
        file_source TEXT
    )
    """)

def import_csv_files(conn, directory):
    """导入所有CSV文件到数据库"""
    cursor = conn.cursor()
    files_imported = 0
    
    for filename in os.listdir(directory):
        if filename.endswith(".csv") and "tribit" in filename.lower():
            filepath = os.path.join(directory, filename)
            
            # 检测文件编码
            encoding = 'utf-8'
            try:
                with open(filepath, 'r', encoding=encoding) as f:
                    f.read()
            except UnicodeDecodeError:
                encoding = 'utf-8-sig'  # 尝试带BOM的UTF-8
            
            print(f"处理文件: {filename}")
            
            # 读取CSV文件
            with open(filepath, 'r', encoding=encoding) as f:
                reader = csv.reader(f)
                try:
                    header = next(reader)  # 跳过标题行
                except StopIteration:
                    print(f"警告: 文件 {filename} 为空")
                    continue
                
                # 打印标题行以便调试
                print(f"文件标题: {header}")
                
                # 将标题转为小写方便比较
                header_lower = [h.lower() for h in header]
                
                # 更灵活地检查必要字段
                has_region = 'region' in header_lower
                region_index = None
                if has_region:
                    region_index = header_lower.index('region')
                
                has_suggestion = 'suggestion' in header_lower
                suggestion_index = header_lower.index('suggestion') if has_suggestion else None
                
                # 尝试不同的可能字段名
                modifier_type_index = find_column_index(header_lower, ['modifier type', 'modifiertype', 'type'])
                modifier_index = find_column_index(header_lower, ['modifier', 'mod'])
                language_index = find_column_index(header_lower, ['language', 'lang'])
                keyword_index = find_column_index(header_lower, ['keyword', 'key', 'term'])
                search_volume_index = find_column_index(header_lower, 
                                                        ['search volume', 'searchvolume', 'volume', 'search_volume'])
                cpc_index = find_column_index(header_lower, 
                                              ['cost per click', 'costperclick', 'cpc', 'cost_per_click'])
                
                # 如果找不到必要字段，尝试直接推断列的意义
                if suggestion_index is None:
                    # 尝试找出看起来像搜索词的列
                    for i, h in enumerate(header):
                        if 'tribit' in h.lower() or h.lower() in ['term', 'query', 'search term', 'keyword']:
                            suggestion_index = i
                            print(f"猜测列 '{h}' 包含搜索建议")
                            break
                
                # 检查是否有足够的字段来导入数据
                if suggestion_index is None:
                    print(f"警告: 跳过文件 {filename}，找不到搜索建议字段")
                    continue
                
                # 导入数据
                count = 0
                for row in reader:
                    if len(row) <= 1:  # 跳过空行
                        continue
                    
                    # 安全地获取值，处理None索引的情况
                    modifier_type = row[modifier_type_index] if modifier_type_index is not None and modifier_type_index < len(row) else ''
                    modifier = row[modifier_index] if modifier_index is not None and modifier_index < len(row) else ''
                    suggestion = row[suggestion_index] if suggestion_index is not None and suggestion_index < len(row) else ''
                    language = row[language_index] if language_index is not None and language_index < len(row) else ''
                    keyword = row[keyword_index] if keyword_index is not None and keyword_index < len(row) else ''
                    
                    region = None
                    if has_region and region_index is not None and region_index < len(row):
                        region = row[region_index]
                    
                    search_volume = 0
                    if search_volume_index is not None and search_volume_index < len(row):
                        try:
                            if row[search_volume_index]:
                                search_volume = int(row[search_volume_index])
                        except ValueError:
                            pass
                    
                    cpc = 0.0
                    if cpc_index is not None and cpc_index < len(row):
                        try:
                            if row[cpc_index]:
                                cpc = float(row[cpc_index])
                        except ValueError:
                            pass
                    
                    cursor.execute("""
                    INSERT INTO SearchSuggestions 
                    (modifier_type, modifier, suggestion_text, language, region, keyword, search_volume, cost_per_click, file_source)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """, (modifier_type, modifier, suggestion, language, region, keyword, search_volume, cpc, filename))
                    
                    count += 1
                
                print(f"从 {filename} 导入了 {count} 条记录")
                files_imported += 1
    
    return files_imported

def main():
    # 连接数据库
    db_path = 'tribit.db'
    conn = sqlite3.connect(db_path)
    
    # 创建数据库结构
    cursor = conn.cursor()
    create_database_schema(cursor)
    
    # 导入CSV文件
    search_directory = '../search'
    files_imported = import_csv_files(conn, search_directory)
    
    # 提交并关闭连接
    conn.commit()
    conn.close()
    
    print(f"完成！成功导入了 {files_imported} 个文件的数据")

if __name__ == '__main__':
    main()
