#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import os
import csv

# 创建输出目录
os.makedirs('data/analysis_results', exist_ok=True)

# 连接数据库
conn = sqlite3.connect('data/tribit.db')
cursor = conn.cursor()

# 定义查询及其输出文件
queries = [
    {
        'name': '产品类别分析',
        'query': '''
        SELECT 
            CASE 
                WHEN suggestion_text LIKE '%speaker%' OR suggestion_text LIKE '%stormbox%' THEN 'Speakers'
                WHEN suggestion_text LIKE '%earbuds%' OR suggestion_text LIKE '%flybuds%' THEN 'Earbuds'
                WHEN suggestion_text LIKE '%headphones%' THEN 'Headphones'
                ELSE 'Other'
            END as product_category,
            COUNT(*) as suggestion_count,
            SUM(search_volume) as total_search_volume,
            AVG(cost_per_click) as avg_cpc
        FROM SearchSuggestions
        GROUP BY product_category
        ORDER BY total_search_volume DESC;
        ''',
        'file': 'category_analysis.csv'
    },
    {
        'name': '热门产品系列分析',
        'query': '''
        SELECT suggestion_text, search_volume, cost_per_click
        FROM SearchSuggestions
        WHERE (suggestion_text LIKE '%stormbox%' OR 
            suggestion_text LIKE '%flybuds%' OR
            suggestion_text LIKE '%xsound%' OR
            suggestion_text LIKE '%earbuds%' OR
            suggestion_text LIKE '%headphones%')
            AND search_volume > 0
        ORDER BY search_volume DESC
        LIMIT 15;
        ''',
        'file': 'top_product_series.csv'
    },
    {
        'name': '高CPC关键词分析',
        'query': '''
        SELECT suggestion_text, search_volume, cost_per_click,
            (search_volume * cost_per_click) as value_score
        FROM SearchSuggestions
        WHERE cost_per_click > 0
        ORDER BY cost_per_click DESC
        LIMIT 20;
        ''',
        'file': 'high_cpc_keywords.csv'
    },
    {
        'name': '问题类型搜索分析',
        'query': '''
        SELECT suggestion_text, search_volume, cost_per_click
        FROM SearchSuggestions
        WHERE modifier_type = 'Questions' AND search_volume > 0
        ORDER BY search_volume DESC
        LIMIT 15;
        ''',
        'file': 'question_searches.csv'
    },
    {
        'name': '竞争对手分析',
        'query': '''
        SELECT suggestion_text, search_volume, cost_per_click
        FROM SearchSuggestions
        WHERE (suggestion_text LIKE '%vs jbl%' OR 
            suggestion_text LIKE '%vs soundcore%' OR
            suggestion_text LIKE '%vs bose%' OR
            suggestion_text LIKE '%vs anker%' OR
            suggestion_text LIKE '%vs sony%')
            AND search_volume > 0
        ORDER BY search_volume DESC
        LIMIT 15;
        ''',
        'file': 'competitor_comparisons.csv'
    },
    {
        'name': '区域搜索建议分析',
        'query': '''
        SELECT suggestion, region, search_volume, cost_per_click
        FROM RegionalSearchSuggestions
        WHERE search_volume > 0
        ORDER BY search_volume DESC
        LIMIT 30;
        ''',
        'file': 'regional_top_searches.csv'
    },
    {
        'name': '字母分类搜索分布',
        'query': '''
        SELECT SUBSTR(modifier, 1, 1) as first_letter, COUNT(*) as count,
               SUM(search_volume) as total_volume
        FROM SearchSuggestions
        WHERE modifier_type = 'Alphabeticals'
        GROUP BY first_letter
        ORDER BY total_volume DESC;
        ''',
        'file': 'alphabetical_distribution.csv'
    },
    {
        'name': '修饰符类型分析',
        'query': '''
        SELECT modifier_type, COUNT(*) as count,
               SUM(search_volume) as total_volume,
               AVG(cost_per_click) as avg_cpc
        FROM SearchSuggestions
        GROUP BY modifier_type
        ORDER BY total_volume DESC;
        ''',
        'file': 'modifier_type_analysis.csv'
    }
]

# 执行查询并导出结果
for query_info in queries:
    print(f"执行查询: {query_info['name']}...")
    
    # 执行查询
    cursor.execute(query_info['query'])
    results = cursor.fetchall()
    
    # 获取列名
    column_names = [description[0] for description in cursor.description]
    
    # 写入CSV文件
    output_path = os.path.join('data/analysis_results', query_info['file'])
    with open(output_path, 'w', newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(column_names)  # 写入列名
        writer.writerows(results)      # 写入数据行
    
    print(f"  已将结果保存到: {output_path}")

# 创建综合分析总结文件
print("创建分析总结报告...")
with open('data/analysis_results/analysis_summary.md', 'w', encoding='utf-8') as f:
    f.write("# Tribit搜索关键词数据分析总结\n\n")
    f.write("## 导出的数据文件\n\n")
    
    for query_info in queries:
        f.write(f"- **{query_info['name']}**: `{query_info['file']}`\n")
    
    f.write("\n## 主要分析发现\n\n")
    
    # 获取产品类别分析
    cursor.execute(queries[0]['query'])
    categories = cursor.fetchall()
    f.write("### 产品类别分析\n\n")
    f.write("| 产品类别 | 建议数量 | 总搜索量 | 平均CPC |\n")
    f.write("|---------|---------|---------|--------|\n")
    for cat in categories:
        f.write(f"| {cat[0]} | {cat[1]} | {cat[2]} | ${cat[3]:.3f} |\n")
    
    # 获取热门产品
    cursor.execute(queries[1]['query'])
    products = cursor.fetchall()
    f.write("\n### 热门产品系列\n\n")
    f.write("| 产品 | 搜索量 | CPC |\n")
    f.write("|------|--------|-----|\n")
    for prod in products[:5]:  # 只显示前5个
        f.write(f"| {prod[0]} | {prod[1]} | ${prod[2]} |\n")
    
    # 获取高CPC关键词
    cursor.execute(queries[2]['query'])
    high_cpc = cursor.fetchall()
    f.write("\n### 高商业价值关键词\n\n")
    f.write("| 关键词 | 搜索量 | CPC | 价值分数 |\n")
    f.write("|--------|--------|-----|----------|\n")
    for kw in high_cpc[:5]:  # 只显示前5个
        f.write(f"| {kw[0]} | {kw[1]} | ${kw[2]} | {kw[3]:.1f} |\n")
    
    # 获取常见问题
    cursor.execute(queries[3]['query'])
    questions = cursor.fetchall()
    f.write("\n### 常见问题分析\n\n")
    f.write("| 问题 | 搜索量 | CPC |\n")
    f.write("|------|--------|-----|\n")
    for q in questions[:5]:  # 只显示前5个
        f.write(f"| {q[0]} | {q[1]} | ${q[2]} |\n")
    
    # 竞争对手分析
    cursor.execute(queries[4]['query'])
    competitors = cursor.fetchall()
    f.write("\n### 竞争对手比较分析\n\n")
    f.write("| 比较搜索 | 搜索量 | CPC |\n")
    f.write("|----------|--------|-----|\n")
    for comp in competitors[:5]:  # 只显示前5个
        f.write(f"| {comp[0]} | {comp[1]} | ${comp[2]} |\n")
    
    f.write("\n## 营销建议\n\n")
    f.write("1. **耳塞产品营销重点**: 数据显示耳塞产品的搜索量最高，应将营销资源重点投入到该产品线。\n")
    f.write("2. **解决用户常见问题**: 创建关于如何连接Tribit设备的教程内容，解决用户最常搜索的问题。\n")
    f.write("3. **竞争差异化**: 针对JBL等主要竞争对手，制作产品对比内容，突出Tribit产品的优势。\n")
    f.write("4. **高价值关键词广告**: 在高CPC但搜索量也较高的关键词上投放广告，如stormbox blast系列。\n")
    f.write("5. **内容营销策略**: 创建关于产品使用技巧、护理方法和常见问题解答的内容，提高用户体验和品牌忠诚度。\n")

print("数据分析完成，所有结果已保存到 data/analysis_results/ 目录")
conn.close()
