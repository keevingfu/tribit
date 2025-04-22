#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Tribit搜索建议数据导入脚本

该脚本用于将CSV格式的搜索建议数据导入到SQLite数据库中。
支持多个CSV文件的导入，处理不同格式和编码的CSV文件。
"""

import os
import sys
import csv
import sqlite3
import argparse
from pathlib import Path


def create_database_schema(conn):
    """创建数据库表结构"""
    cursor = conn.cursor()
    
    # 检查表是否已存在
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='SearchSuggestions'")
    if cursor.fetchone():
        print("SearchSuggestions表已存在，跳过创建步骤")
        return
    
    # 创建搜索建议表
    cursor.execute('''
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
    ''')
    
    conn.commit()
    print("数据库表结构创建完成")


def detect_csv_format(csv_file):
    """检测CSV文件的格式和编码"""
    encodings = ['utf-8', 'utf-8-sig', 'latin-1', 'gb18030']
    
    for encoding in encodings:
        try:
            with open(csv_file, 'r', encoding=encoding) as f:
                sample = f.read(4096)
                
                # 尝试寻找列名来确定文件格式
                if "Modifier Type" in sample and "Suggestion" in sample:
                    return {
                        'encoding': encoding,
                        'format': 'standard',
                        'header_row': 0
                    }
                elif "tribit - en Suggestions" in sample:
                    # 标题在第一行，列头在第二行
                    return {
                        'encoding': encoding,
                        'format': 'titled',
                        'header_row': 1
                    }
                
            print(f"使用编码 {encoding} 成功读取文件，但未识别出确切格式")
        except UnicodeDecodeError:
            continue
    
    # 无法确定格式，使用默认设置
    return {
        'encoding': 'utf-8',
        'format': 'unknown',
        'header_row': 0
    }


def extract_date_from_filename(filename):
    """从文件名中提取日期信息"""
    parts = filename.split('-')
    for part in parts:
        if part.strip().isdigit() and len(part.strip()) == 8:
            # 假设格式为YYYYMMDD
            return f"{part[0:4]}-{part[4:6]}-{part[6:8]}"
    
    # 尝试从文件内容中提取日期
    if 'Created:' in filename:
        date_part = filename.split('Created:')[1].strip().split()[0]
        # 假设格式为DD-MM-YYYY
        parts = date_part.split('-')
        if len(parts) == 3:
            return f"{parts[2]}-{parts[1]}-{parts[0]}"
    
    return None


def process_csv_file(conn, csv_file, verbose=False):
    """处理单个CSV文件并导入数据"""
    file_format = detect_csv_format(csv_file)
    filename = os.path.basename(csv_file)
    
    created_date = extract_date_from_filename(filename)
    if verbose:
        print(f"处理文件: {filename}")
        print(f"检测到的格式: {file_format}")
        print(f"提取的日期: {created_date or '未找到'}")
    
    try:
        # 使用csv模块读取CSV文件
        with open(csv_file, 'r', encoding=file_format['encoding']) as f:
            # 跳过标题行
            for _ in range(file_format['header_row']):
                next(f)
            
            # 读取CSV
            reader = csv.reader(f)
            
            # 获取列名
            headers = next(reader)
            
            # 标准化列名
            column_mapping = {
                'Modifier Type': 'modifier_type',
                'Modifier': 'modifier',
                'Suggestion': 'suggestion_text',
                'Language': 'language',
                'Region': 'region',
                'Keyword': 'keyword',
                'Search Volume': 'search_volume',
                'Cost Per Click': 'cost_per_click'
            }
            
            # 创建列索引映射
            col_indices = {}
            for i, header in enumerate(headers):
                # 查找标准化的列名
                if header in column_mapping:
                    col_indices[column_mapping[header]] = i
                # 如果找不到匹配，尝试查找包含suggestion的列作为suggestion_text
                elif 'suggestion' in header.lower():
                    col_indices['suggestion_text'] = i
            
            # 检查必要的列是否存在
            if 'suggestion_text' not in col_indices:
                print(f"错误: 在文件 {filename} 中找不到必要的suggestion_text列")
                return 0
            
            # 插入数据库
            cursor = conn.cursor()
            
            # 数据计数
            count = 0
            
            for row in reader:
                # 获取各列数据
                modifier_type = row[col_indices.get('modifier_type', -1)] if 'modifier_type' in col_indices else None
                modifier = row[col_indices.get('modifier', -1)] if 'modifier' in col_indices else None
                suggestion_text = row[col_indices.get('suggestion_text', -1)]
                language = row[col_indices.get('language', -1)] if 'language' in col_indices else None
                region = row[col_indices.get('region', -1)] if 'region' in col_indices else None
                keyword = row[col_indices.get('keyword', -1)] if 'keyword' in col_indices else None
                
                # 处理搜索量，确保是整数
                search_volume = 0
                if 'search_volume' in col_indices and row[col_indices['search_volume']]:
                    try:
                        search_volume = int(float(row[col_indices['search_volume']]))
                    except (ValueError, TypeError):
                        search_volume = 0
                
                # 处理点击价格，确保是浮点数
                cost_per_click = 0.0
                if 'cost_per_click' in col_indices and row[col_indices['cost_per_click']]:
                    try:
                        cost_per_click = float(row[col_indices['cost_per_click']])
                    except (ValueError, TypeError):
                        cost_per_click = 0.0
                
                # 跳过空的建议
                if not suggestion_text:
                    continue
                
                cursor.execute('''
                INSERT INTO SearchSuggestions 
                (modifier_type, modifier, suggestion_text, language, region, keyword, 
                search_volume, cost_per_click, file_source)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    modifier_type,
                    modifier,
                    suggestion_text,
                    language,
                    region,
                    keyword,
                    search_volume,
                    cost_per_click,
                    filename
                ))
                count += 1
            
            conn.commit()
            
            if verbose:
                print(f"成功导入 {count} 条记录")
            
            return count
        
    except Exception as e:
        print(f"处理文件 {filename} 时出错: {e}")
        return 0


def process_directory(conn, directory, verbose=False):
    """处理目录中的所有CSV文件"""
    total_records = 0
    
    # 获取目录中的所有CSV文件
    csv_files = [os.path.join(directory, f) for f in os.listdir(directory) 
                 if f.endswith('.csv') and os.path.isfile(os.path.join(directory, f))]
    
    if not csv_files:
        print(f"在 {directory} 目录中没有找到CSV文件")
        return 0
    
    print(f"找到 {len(csv_files)} 个CSV文件")
    
    for csv_file in csv_files:
        records = process_csv_file(conn, csv_file, verbose)
        total_records += records
    
    print(f"总共导入 {total_records} 条搜索建议记录")
    return total_records


def clear_existing_data(conn, confirm=False):
    """清除现有数据"""
    if not confirm:
        response = input("确定要清除现有的所有搜索建议数据吗? (y/n): ")
        if response.lower() != 'y':
            print("操作已取消")
            return False
    
    cursor = conn.cursor()
    cursor.execute("DELETE FROM SearchSuggestions")
    conn.commit()
    print("已清除现有数据")
    return True


def main():
    parser = argparse.ArgumentParser(description='Tribit搜索建议数据导入工具')
    parser.add_argument('--db', type=str, default='tribit.db', help='SQLite数据库文件路径')
    parser.add_argument('--dir', type=str, default='../search', help='CSV文件目录')
    parser.add_argument('--clear', action='store_true', help='清除现有数据')
    parser.add_argument('--force', action='store_true', help='强制清除数据，不询问确认')
    parser.add_argument('--verbose', action='store_true', help='显示详细信息')
    
    args = parser.parse_args()
    
    # 确保数据库目录存在
    db_dir = os.path.dirname(args.db)
    if db_dir and not os.path.exists(db_dir):
        os.makedirs(db_dir)
    
    # 连接数据库
    conn = sqlite3.connect(args.db)
    
    try:
        # 创建表结构
        create_database_schema(conn)
        
        # 清除现有数据（如果需要）
        if args.clear:
            if not clear_existing_data(conn, args.force):
                return
        
        # 处理目录中的CSV文件
        process_directory(conn, args.dir, args.verbose)
        
    finally:
        conn.close()


if __name__ == "__main__":
    main()
