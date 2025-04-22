#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

# 设置中文显示
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei']  # 中文字体设置
plt.rcParams['axes.unicode_minus'] = False  # 解决保存图像是负号'-'显示为方块的问题

# 创建输出目录
os.makedirs('data/charts', exist_ok=True)

# 连接数据库
conn = sqlite3.connect('data/tribit.db')

# 1. 产品类别搜索量分析
print("生成产品类别搜索量图表...")
category_data = pd.read_sql('''
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
''', conn)

# 产品类别搜索量柱状图
plt.figure(figsize=(10, 6))
sns.barplot(x='product_category', y='total_search_volume', data=category_data)
plt.title('Tribit产品类别搜索量分析', fontsize=16)
plt.xlabel('产品类别', fontsize=14)
plt.ylabel('总搜索量', fontsize=14)
plt.grid(True, linestyle='--', alpha=0.7)
plt.savefig('data/charts/product_category_search_volume.png', dpi=300, bbox_inches='tight')
plt.close()

# 产品类别CPC柱状图
plt.figure(figsize=(10, 6))
sns.barplot(x='product_category', y='avg_cpc', data=category_data)
plt.title('Tribit产品类别平均CPC分析', fontsize=16)
plt.xlabel('产品类别', fontsize=14)
plt.ylabel('平均点击成本 ($)', fontsize=14)
plt.grid(True, linestyle='--', alpha=0.7)
plt.savefig('data/charts/product_category_avg_cpc.png', dpi=300, bbox_inches='tight')
plt.close()

# 2. 热门产品系列分析
print("生成热门产品系列图表...")
product_series = pd.read_sql('''
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
''', conn)

plt.figure(figsize=(12, 7))
ax = sns.barplot(x='suggestion_text', y='search_volume', data=product_series)
plt.title('Tribit热门产品系列搜索量', fontsize=16)
plt.xlabel('产品名称', fontsize=14)
plt.ylabel('搜索量', fontsize=14)
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.grid(True, linestyle='--', alpha=0.7)

# 给每个柱子标注数值
for i, p in enumerate(ax.patches):
    ax.annotate(format(int(p.get_height()), ','), 
                (p.get_x() + p.get_width() / 2., p.get_height()), 
                ha = 'center', va = 'bottom', 
                fontsize=10)

plt.savefig('data/charts/top_product_series.png', dpi=300, bbox_inches='tight')
plt.close()

# 3. 高CPC关键词分析
print("生成高CPC关键词图表...")
high_cpc = pd.read_sql('''
SELECT suggestion_text, search_volume, cost_per_click,
       (search_volume * cost_per_click) as value_score
FROM SearchSuggestions
WHERE cost_per_click > 0
ORDER BY cost_per_click DESC
LIMIT 10;
''', conn)

plt.figure(figsize=(12, 7))
sns.scatterplot(x='search_volume', y='cost_per_click', size='value_score', 
                sizes=(100, 1000), alpha=0.7, data=high_cpc)

# 添加标签
for i, row in high_cpc.iterrows():
    plt.text(row['search_volume']*1.05, row['cost_per_click']*1.02, 
             row['suggestion_text'], fontsize=9)

plt.title('Tribit高CPC关键词分析', fontsize=16)
plt.xlabel('搜索量', fontsize=14)
plt.ylabel('点击成本 ($)', fontsize=14)
plt.grid(True, linestyle='--', alpha=0.7)
plt.savefig('data/charts/high_cpc_keywords.png', dpi=300, bbox_inches='tight')
plt.close()

# 4. 问题类型搜索分析
print("生成问题类型搜索分析图表...")
questions = pd.read_sql('''
SELECT suggestion_text, search_volume
FROM SearchSuggestions
WHERE modifier_type = 'Questions' AND search_volume > 0
ORDER BY search_volume DESC
LIMIT 10;
''', conn)

plt.figure(figsize=(12, 7))
ax = sns.barplot(x='suggestion_text', y='search_volume', data=questions)
plt.title('Tribit常见问题类型搜索分析', fontsize=16)
plt.xlabel('问题', fontsize=14)
plt.ylabel('搜索量', fontsize=14)
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.grid(True, linestyle='--', alpha=0.7)

# 给每个柱子标注数值
for i, p in enumerate(ax.patches):
    ax.annotate(format(int(p.get_height()), ','), 
                (p.get_x() + p.get_width() / 2., p.get_height()), 
                ha = 'center', va = 'bottom', 
                fontsize=10)

plt.savefig('data/charts/common_questions.png', dpi=300, bbox_inches='tight')
plt.close()

# 5. 竞争对手分析
print("生成竞争对手分析图表...")
competitors = pd.read_sql('''
SELECT suggestion_text, search_volume, cost_per_click
FROM SearchSuggestions
WHERE (suggestion_text LIKE '%vs jbl%' OR 
      suggestion_text LIKE '%vs soundcore%' OR
      suggestion_text LIKE '%vs bose%' OR
      suggestion_text LIKE '%vs anker%' OR
      suggestion_text LIKE '%vs sony%')
      AND search_volume > 0
ORDER BY search_volume DESC
LIMIT 10;
''', conn)

plt.figure(figsize=(12, 7))
ax = sns.barplot(x='suggestion_text', y='search_volume', data=competitors)
plt.title('Tribit与竞争对手比较搜索分析', fontsize=16)
plt.xlabel('比较搜索', fontsize=14)
plt.ylabel('搜索量', fontsize=14)
plt.xticks(rotation=45, ha='right')
plt.tight_layout()
plt.grid(True, linestyle='--', alpha=0.7)

# 给每个柱子标注数值
for i, p in enumerate(ax.patches):
    ax.annotate(format(int(p.get_height()), ','), 
                (p.get_x() + p.get_width() / 2., p.get_height()), 
                ha = 'center', va = 'bottom', 
                fontsize=10)

plt.savefig('data/charts/competitor_comparisons.png', dpi=300, bbox_inches='tight')
plt.close()

print("所有图表已生成完成并保存在 data/charts/ 目录下")
conn.close()
