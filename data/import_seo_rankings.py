#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Tribit SEO排名数据导入与分析脚本

该脚本用于将有机搜索排名数据从CSV导入到SQLite数据库，
并进行多维度分析，包括关键词排名、搜索量、流量和竞争情况等。
"""

import os
import csv
import sqlite3
import json
from datetime import datetime
import re
from collections import Counter

def import_and_analyze_seo_rankings():
    """导入并分析SEO排名数据"""
    # 文件路径
    csv_file = '/Users/cavin/Desktop/tribit/voc/tribit.com-organic.Positions-us-20250329-2025-03-30T15_51_45Z.csv'
    db_file = '/Users/cavin/Desktop/tribit/data/tribit.db'
    
    # 加载CSV文件
    print(f"正在加载SEO排名数据: {csv_file}")
    data = []
    
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"文件包含以下列: {headers}")
        
        for row in reader:
            data.append(row)
    
    print(f"共读取了 {len(data)} 条关键词排名数据")
    
    # 连接数据库
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    # 创建SEO排名表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS SEORankings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keyword TEXT,
        position INTEGER,
        previous_position INTEGER,
        search_volume INTEGER,
        keyword_difficulty INTEGER,
        cpc REAL,
        url TEXT,
        traffic REAL,
        traffic_percentage REAL,
        traffic_cost REAL,
        competition REAL,
        number_of_results INTEGER,
        trends TEXT,
        timestamp TEXT,
        serp_features TEXT,
        keyword_intents TEXT,
        position_type TEXT,
        imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    print("SEO排名表已创建或已存在")
    
    # 导入数据
    count = 0
    for row in data:
        # 准备数据
        keyword = row.get('Keyword', '')
        position = int(row.get('Position', 0)) if row.get('Position', '').isdigit() else 0
        previous_position = int(row.get('Previous position', 0)) if row.get('Previous position', '').isdigit() else 0
        
        # 处理搜索量
        search_volume = 0
        if row.get('Search Volume', ''):
            try:
                search_volume = int(row.get('Search Volume', 0))
            except (ValueError, TypeError):
                pass
        
        # 处理关键词难度
        keyword_difficulty = 0
        if row.get('Keyword Difficulty', ''):
            try:
                keyword_difficulty = int(row.get('Keyword Difficulty', 0))
            except (ValueError, TypeError):
                pass
        
        # 处理CPC
        cpc = 0.0
        if row.get('CPC', ''):
            try:
                cpc = float(row.get('CPC', 0.0))
            except (ValueError, TypeError):
                pass
        
        url = row.get('URL', '')
        
        # 处理流量
        traffic = 0.0
        if row.get('Traffic', ''):
            try:
                traffic = float(row.get('Traffic', 0.0))
            except (ValueError, TypeError):
                pass
        
        # 处理流量百分比
        traffic_percentage = 0.0
        if row.get('Traffic (%)', ''):
            try:
                traffic_percentage = float(row.get('Traffic (%)', 0.0))
            except (ValueError, TypeError):
                pass
        
        # 处理流量成本
        traffic_cost = 0.0
        if row.get('Traffic Cost', ''):
            try:
                traffic_cost = float(row.get('Traffic Cost', 0.0))
            except (ValueError, TypeError):
                pass
        
        # 处理竞争度
        competition = 0.0
        if row.get('Competition', ''):
            try:
                competition = float(row.get('Competition', 0.0))
            except (ValueError, TypeError):
                pass
        
        # 处理结果数量
        number_of_results = 0
        if row.get('Number of Results', ''):
            try:
                number_of_results = int(row.get('Number of Results', 0))
            except (ValueError, TypeError):
                pass
        
        trends = row.get('Trends', '')
        timestamp = row.get('Timestamp', '')
        serp_features = row.get('SERP Features by Keyword', '')
        keyword_intents = row.get('Keyword Intents', '')
        position_type = row.get('Position Type', '')
        
        # 插入数据
        cursor.execute('''
        INSERT INTO SEORankings 
        (keyword, position, previous_position, search_volume, keyword_difficulty, 
        cpc, url, traffic, traffic_percentage, traffic_cost, competition, 
        number_of_results, trends, timestamp, serp_features, keyword_intents, position_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            keyword, position, previous_position, search_volume, keyword_difficulty,
            cpc, url, traffic, traffic_percentage, traffic_cost, competition,
            number_of_results, trends, timestamp, serp_features, keyword_intents, position_type
        ))
        count += 1
    
    conn.commit()
    print(f"已导入 {count} 条SEO排名数据到数据库")
    
    # 进行数据分析
    print("\n开始分析SEO排名数据...")
    
    # 1. 排名分析 - 按排名分组
    cursor.execute('''
    SELECT 
        CASE 
            WHEN position BETWEEN 1 AND 3 THEN '1-3名'
            WHEN position BETWEEN 4 AND 10 THEN '4-10名'
            WHEN position BETWEEN 11 AND 20 THEN '11-20名'
            ELSE '20名以后'
        END as rank_group,
        COUNT(*) as keyword_count
    FROM SEORankings
    GROUP BY rank_group
    ORDER BY 
        CASE rank_group
            WHEN '1-3名' THEN 1
            WHEN '4-10名' THEN 2
            WHEN '11-20名' THEN 3
            ELSE 4
        END
    ''')
    rank_distribution = cursor.fetchall()
    
    print("\n关键词排名分布:")
    for rank_group, count in rank_distribution:
        print(f"{rank_group}: {count} 个关键词")
    
    # 2. 搜索量分析
    cursor.execute('''
    SELECT 
        CASE 
            WHEN search_volume > 10000 THEN '大搜索量 (>10000)'
            WHEN search_volume BETWEEN 1001 AND 10000 THEN '中搜索量 (1001-10000)'
            WHEN search_volume BETWEEN 101 AND 1000 THEN '小搜索量 (101-1000)'
            ELSE '极小搜索量 (≤100)'
        END as volume_group,
        COUNT(*) as keyword_count,
        SUM(search_volume) as total_volume
    FROM SEORankings
    GROUP BY volume_group
    ORDER BY 
        CASE volume_group
            WHEN '大搜索量 (>10000)' THEN 1
            WHEN '中搜索量 (1001-10000)' THEN 2
            WHEN '小搜索量 (101-1000)' THEN 3
            ELSE 4
        END
    ''')
    volume_distribution = cursor.fetchall()
    
    print("\n关键词搜索量分布:")
    for volume_group, count, total in volume_distribution:
        print(f"{volume_group}: {count} 个关键词，总搜索量 {total}")
    
    # 3. 流量分析 - 贡献最多流量的关键词
    cursor.execute('''
    SELECT keyword, position, search_volume, traffic, traffic_percentage
    FROM SEORankings
    ORDER BY traffic DESC
    LIMIT 10
    ''')
    top_traffic_keywords = cursor.fetchall()
    
    print("\n贡献最多流量的关键词:")
    for keyword, position, volume, traffic, percentage in top_traffic_keywords:
        print(f"{keyword}: 排名 {position}，搜索量 {volume}，流量 {traffic} ({percentage}%)")
    
    # 4. 关键词意图分析
    cursor.execute('''
    SELECT keyword_intents, COUNT(*) as count
    FROM SEORankings
    GROUP BY keyword_intents
    ORDER BY count DESC
    ''')
    intent_distribution = cursor.fetchall()
    
    print("\n关键词意图分布:")
    for intent, count in intent_distribution:
        print(f"{intent}: {count} 个关键词")
    
    # 5. 产品分析 - 不同产品系列的关键词表现
    cursor.execute('''
    SELECT 
        CASE 
            WHEN keyword LIKE '%stormbox%' THEN 'StormBox系列'
            WHEN keyword LIKE '%xsound%' THEN 'XSound系列'
            WHEN keyword LIKE '%flybuds%' THEN 'FlyBuds系列'
            WHEN keyword LIKE '%maxsound%' THEN 'MaxSound系列'
            WHEN keyword LIKE '%xfree%' THEN 'XFree系列'
            WHEN keyword LIKE '%quietplus%' THEN 'QuietPlus系列'
            WHEN keyword LIKE '%movebuds%' THEN 'MoveBuds系列'
            ELSE '其他/通用'
        END as product_series,
        COUNT(*) as keyword_count,
        AVG(position) as avg_position,
        SUM(search_volume) as total_volume,
        SUM(traffic) as total_traffic
    FROM SEORankings
    GROUP BY product_series
    ORDER BY total_traffic DESC
    ''')
    product_performance = cursor.fetchall()
    
    print("\n产品系列SEO表现:")
    for series, count, avg_pos, volume, traffic in product_performance:
        print(f"{series}: {count} 个关键词，平均排名 {avg_pos:.1f}，总搜索量 {volume}，总流量 {traffic:.1f}")
    
    # 6. SERP特性分析
    all_features = []
    cursor.execute('SELECT serp_features FROM SEORankings')
    for (features,) in cursor.fetchall():
        if features:
            feature_list = [f.strip() for f in features.split(',')]
            all_features.extend(feature_list)
    
    feature_counts = Counter(all_features)
    
    print("\nSERP特性分布:")
    for feature, count in feature_counts.most_common(10):
        print(f"{feature}: {count} 次出现")
    
    # 7. 排名变化分析
    cursor.execute('''
    SELECT 
        CASE 
            WHEN position < previous_position THEN '排名上升'
            WHEN position > previous_position THEN '排名下降'
            ELSE '排名不变'
        END as rank_change,
        COUNT(*) as keyword_count
    FROM SEORankings
    WHERE previous_position > 0
    GROUP BY rank_change
    ''')
    rank_changes = cursor.fetchall()
    
    print("\n排名变化分析:")
    for change, count in rank_changes:
        print(f"{change}: {count} 个关键词")
    
    # 8. 竞争度分析
    cursor.execute('''
    SELECT 
        CASE 
            WHEN competition > 0.66 THEN '高竞争 (>0.66)'
            WHEN competition BETWEEN 0.33 AND 0.66 THEN '中竞争 (0.33-0.66)'
            WHEN competition > 0 AND competition < 0.33 THEN '低竞争 (<0.33)'
            ELSE '无竞争 (0)'
        END as competition_level,
        COUNT(*) as keyword_count,
        AVG(cpc) as avg_cpc
    FROM SEORankings
    GROUP BY competition_level
    ORDER BY 
        CASE competition_level
            WHEN '高竞争 (>0.66)' THEN 1
            WHEN '中竞争 (0.33-0.66)' THEN 2
            WHEN '低竞争 (<0.33)' THEN 3
            ELSE 4
        END
    ''')
    competition_analysis = cursor.fetchall()
    
    print("\n竞争度分析:")
    for level, count, avg_cpc in competition_analysis:
        print(f"{level}: {count} 个关键词，平均CPC ${avg_cpc:.2f}")
    
    # 保存分析结果到JSON
    analysis_dir = os.path.join('/Users/cavin/Desktop/tribit/data/analysis_results')
    os.makedirs(analysis_dir, exist_ok=True)
    
    analysis_results = {
        "rank_distribution": [{"rank_group": group, "keyword_count": count} for group, count in rank_distribution],
        "volume_distribution": [{"volume_group": group, "keyword_count": count, "total_volume": total} for group, count, total in volume_distribution],
        "top_traffic_keywords": [{"keyword": keyword, "position": position, "search_volume": volume, "traffic": traffic, "percentage": percentage} for keyword, position, volume, traffic, percentage in top_traffic_keywords],
        "intent_distribution": [{"intent": intent, "count": count} for intent, count in intent_distribution],
        "product_performance": [{"series": series, "keyword_count": count, "avg_position": avg_pos, "total_volume": volume, "total_traffic": traffic} for series, count, avg_pos, volume, traffic in product_performance],
        "serp_features": [{"feature": feature, "count": count} for feature, count in feature_counts.most_common(10)],
        "rank_changes": [{"change": change, "keyword_count": count} for change, count in rank_changes],
        "competition_analysis": [{"level": level, "keyword_count": count, "avg_cpc": avg_cpc} for level, count, avg_cpc in competition_analysis]
    }
    
    output_file = os.path.join(analysis_dir, 'seo_rankings_analysis.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, ensure_ascii=False, indent=4)
    
    print(f"\n分析结果已保存到 {output_file}")
    print("分析完成")
    
    conn.close()

if __name__ == "__main__":
    import_and_analyze_seo_rankings()
