#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import json
import sqlite3
from collections import defaultdict

def connect_to_db():
    """连接到数据库"""
    db_path = os.path.join('..', 'data', 'tribit.db')
    return sqlite3.connect(db_path)

def get_top_search_terms(cursor, limit=20):
    """获取搜索量最大的搜索词"""
    cursor.execute("""
        SELECT suggestion_text, search_volume, cost_per_click
        FROM SearchSuggestions 
        WHERE search_volume > 0 
        ORDER BY search_volume DESC 
        LIMIT ?
    """, (limit,))
    
    results = cursor.fetchall()
    return [
        {
            "term": item[0],
            "search_volume": item[1],
            "cpc": item[2]
        }
        for item in results
    ]

def get_product_categories(cursor):
    """获取产品类别分析数据"""
    cursor.execute("""
    SELECT 
        CASE
            WHEN suggestion_text LIKE '%earbuds%' OR suggestion_text LIKE '%ear buds%' OR suggestion_text LIKE '%wireless earbuds%' THEN 'Earbuds'
            WHEN suggestion_text LIKE '%headphones%' OR suggestion_text LIKE '%quietplus%' THEN 'Headphones'
            WHEN suggestion_text LIKE '%speaker%' OR suggestion_text LIKE '%stormbox%' OR suggestion_text LIKE '%xsound%' THEN 'Speakers'
            ELSE 'Other'
        END as product_category,
        COUNT(*) as count,
        SUM(search_volume) as total_search_volume,
        CASE WHEN COUNT(*) > 0 THEN CAST(SUM(search_volume) AS REAL) / COUNT(*) ELSE 0 END as avg_search_volume
    FROM SearchSuggestions
    GROUP BY product_category
    ORDER BY total_search_volume DESC
    """)
    
    results = cursor.fetchall()
    return [
        {
            "category": item[0],
            "count": item[1],
            "total_search_volume": item[2] if item[2] is not None else 0,
            "avg_search_volume": round(item[3], 2) if item[3] is not None else 0
        }
        for item in results
    ]

def get_competitor_analysis(cursor):
    """获取竞争对手比较分析"""
    cursor.execute("""
    SELECT 
        suggestion_text, search_volume, cost_per_click
    FROM SearchSuggestions
    WHERE (modifier_type = 'Comparisons' AND modifier = 'vs') 
       OR suggestion_text LIKE '%vs %' 
       OR suggestion_text LIKE '% vs %'
    AND search_volume > 0
    ORDER BY search_volume DESC
    LIMIT 20
    """)
    
    results = cursor.fetchall()
    
    # 提取竞争对手名称
    competitors = defaultdict(int)
    for item in results:
        term = item[0].lower()
        parts = term.split('vs')
        if len(parts) == 2:
            # 找出哪一部分不包含"tribit"
            if 'tribit' not in parts[0]:
                competitor = parts[0].strip()
                competitors[competitor] += item[1]  # 累加搜索量
            elif 'tribit' not in parts[1]:
                competitor = parts[1].strip()
                competitors[competitor] += item[1]  # 累加搜索量
    
    # 转换为列表
    competitor_list = [
        {"competitor": k, "search_volume": v}
        for k, v in sorted(competitors.items(), key=lambda x: x[1], reverse=True)
        if k and not k.isspace() and len(k) > 1  # 过滤掉空字符和太短的值
    ]
    
    return {
        "raw_comparisons": [
            {
                "term": item[0],
                "search_volume": item[1],
                "cpc": item[2]
            }
            for item in results
        ],
        "competitors": competitor_list[:10]  # 只取前10个最常比较的竞争对手
    }

def get_keyword_modifiers(cursor):
    """获取搜索词修饰符分析"""
    cursor.execute("""
    SELECT modifier_type, COUNT(*) as count
    FROM SearchSuggestions
    GROUP BY modifier_type
    ORDER BY count DESC
    """)
    
    results = cursor.fetchall()
    return [
        {
            "type": item[0] if item[0] else "Unknown",
            "count": item[1]
        }
        for item in results
    ]

def get_product_model_analysis(cursor):
    """获取产品型号搜索分析"""
    product_models = {
        "stormbox": "扬声器系列",
        "flybuds": "耳机系列",
        "xsound": "便携式音响系列",
        "quietplus": "降噪耳机系列",
        "maxsound": "高性能扬声器系列"
    }
    
    all_models = []
    
    for model, description in product_models.items():
        cursor.execute(f"""
        SELECT suggestion_text, search_volume, cost_per_click
        FROM SearchSuggestions
        WHERE suggestion_text LIKE '%{model}%'
        AND search_volume > 0
        ORDER BY search_volume DESC
        LIMIT 10
        """)
        
        results = cursor.fetchall()
        if results:
            model_data = {
                "model": model,
                "description": description,
                "total_search_volume": sum(item[1] for item in results),
                "variants": [
                    {
                        "term": item[0],
                        "search_volume": item[1],
                        "cpc": item[2]
                    }
                    for item in results
                ]
            }
            all_models.append(model_data)
    
    return all_models

def get_key_questions(cursor):
    """获取关键问题分析"""
    cursor.execute("""
    SELECT suggestion_text, search_volume
    FROM SearchSuggestions
    WHERE modifier_type = 'Questions'
    AND search_volume > 0
    ORDER BY search_volume DESC
    LIMIT 15
    """)
    
    results = cursor.fetchall()
    return [
        {
            "question": item[0],
            "search_volume": item[1]
        }
        for item in results
    ]

def get_search_alphabet_distribution(cursor):
    """获取搜索词字母分布"""
    cursor.execute("""
    SELECT 
        CASE 
            WHEN modifier_type = 'Alphabeticals' THEN modifier
            ELSE SUBSTR(suggestion_text, 1, 1)
        END as first_letter,
        COUNT(*) as count
    FROM SearchSuggestions
    GROUP BY first_letter
    ORDER BY count DESC
    """)
    
    results = cursor.fetchall()
    return [
        {
            "letter": item[0] if item[0] else "其他",
            "count": item[1]
        }
        for item in results
    ]

def get_regional_analysis(cursor):
    """获取地区分析数据"""
    cursor.execute("""
    SELECT region, COUNT(*) as suggestions_count, 
           SUM(search_volume) as total_search_volume
    FROM SearchSuggestions
    WHERE region IS NOT NULL AND region != ''
    GROUP BY region
    ORDER BY total_search_volume DESC
    """)
    
    results = cursor.fetchall()
    return [
        {
            "region": item[0],
            "count": item[1],
            "total_search_volume": item[2] if item[2] is not None else 0
        }
        for item in results
    ]

def generate_all_dashboard_data():
    """生成所有仪表板数据"""
    conn = connect_to_db()
    cursor = conn.cursor()
    
    # 收集所有数据
    dashboard_data = {
        "top_search_terms": get_top_search_terms(cursor),
        "product_categories": get_product_categories(cursor),
        "competitor_analysis": get_competitor_analysis(cursor),
        "keyword_modifiers": get_keyword_modifiers(cursor),
        "product_model_analysis": get_product_model_analysis(cursor),
        "key_questions": get_key_questions(cursor),
        "search_alphabet_distribution": get_search_alphabet_distribution(cursor),
        "regional_analysis": get_regional_analysis(cursor)
    }
    
    # 关闭数据库连接
    conn.close()
    
    # 将数据写入JSON文件
    output_dir = "dashboard_data"
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    with open(os.path.join(output_dir, "search_data.json"), "w", encoding="utf-8") as f:
        json.dump(dashboard_data, f, ensure_ascii=False, indent=2)
    
    print(f"仪表板数据已生成并保存到 {output_dir}/search_data.json")

if __name__ == "__main__":
    generate_all_dashboard_data()
