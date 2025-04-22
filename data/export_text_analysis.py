#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import pandas as pd
import os
import json
from tabulate import tabulate

def connect_to_db():
    """连接到SQLite数据库"""
    db_path = os.path.join('data', 'tribit.db')
    conn = sqlite3.connect(db_path)
    return conn

def query_top_search_terms(conn):
    """查询搜索量最高的前20个搜索词"""
    sql = """
    SELECT suggestion, SUM(search_volume) AS total_search_volume, AVG(cost_per_click) AS avg_cpc
    FROM RegionalSearchSuggestions
    WHERE region = 'us' AND search_volume > 0
    GROUP BY suggestion
    ORDER BY total_search_volume DESC
    LIMIT 20;
    """
    return pd.read_sql_query(sql, conn)

def query_product_categories(conn):
    """查询按产品系列分组的搜索量"""
    sql = """
    SELECT 
        CASE 
            WHEN suggestion LIKE '%stormbox%' THEN 'Stormbox系列'
            WHEN suggestion LIKE '%flybuds%' THEN 'Flybuds系列'
            WHEN suggestion LIKE '%earbuds%' THEN '耳塞类产品'
            WHEN suggestion LIKE '%xsound%' THEN 'XSound系列'
            WHEN suggestion LIKE '%quietplus%' THEN 'QuietPlus系列'
            WHEN suggestion LIKE '%xfree%' THEN 'XFree系列'
            ELSE '其他产品'
        END AS product_category,
        SUM(search_volume) AS total_search_volume,
        AVG(cost_per_click) AS avg_cpc
    FROM RegionalSearchSuggestions
    WHERE region = 'us'
    GROUP BY product_category
    ORDER BY total_search_volume DESC;
    """
    return pd.read_sql_query(sql, conn)

def query_user_features(conn):
    """查询用户关注的功能特性"""
    sql = """
    SELECT 
        CASE 
            WHEN suggestion LIKE '%connect%' OR suggestion LIKE '%pair%' THEN '连接/配对问题'
            WHEN suggestion LIKE '%charge%' OR suggestion LIKE '%battery%' THEN '充电/电池问题'
            WHEN suggestion LIKE '%waterproof%' OR suggestion LIKE '%water%' THEN '防水功能'
            WHEN suggestion LIKE '%sound%' OR suggestion LIKE '%audio%' THEN '音质相关'
            WHEN suggestion LIKE '%mic%' OR suggestion LIKE '%voice%' THEN '麦克风相关'
            WHEN suggestion LIKE '%reset%' THEN '重置相关'
            ELSE '其他功能'
        END AS feature_category,
        SUM(search_volume) AS total_search_volume
    FROM RegionalSearchSuggestions
    WHERE region = 'us'
    GROUP BY feature_category
    ORDER BY total_search_volume DESC;
    """
    return pd.read_sql_query(sql, conn)

def query_competitors(conn):
    """查询与竞争对手相关的搜索"""
    sql = """
    SELECT 
        CASE 
            WHEN suggestion LIKE '%vs jbl%' THEN 'JBL'
            WHEN suggestion LIKE '%vs bose%' THEN 'Bose'
            WHEN suggestion LIKE '%vs sony%' THEN 'Sony'
            WHEN suggestion LIKE '%vs anker%' THEN 'Anker'
            WHEN suggestion LIKE '%vs soundcore%' THEN 'Soundcore'
            ELSE '其他竞品'
        END AS competitor,
        COUNT(*) AS mention_count,
        SUM(search_volume) AS total_search_volume
    FROM RegionalSearchSuggestions
    WHERE region = 'us' AND suggestion LIKE '%vs %'
    GROUP BY competitor
    ORDER BY total_search_volume DESC;
    """
    return pd.read_sql_query(sql, conn)

def query_questions(conn):
    """查询用户问题相关搜索"""
    sql = """
    SELECT suggestion, search_volume
    FROM RegionalSearchSuggestions
    WHERE region = 'us' AND modifier_type = 'Questions'
    AND search_volume > 0
    ORDER BY search_volume DESC
    LIMIT 10;
    """
    return pd.read_sql_query(sql, conn)

def query_total_stats(conn):
    """查询总体统计信息"""
    sql = """
    SELECT 
        COUNT(*) AS total_records,
        SUM(search_volume) AS total_search_volume,
        AVG(search_volume) AS avg_search_volume,
        AVG(cost_per_click) AS avg_cpc
    FROM RegionalSearchSuggestions
    WHERE region = 'us';
    """
    return pd.read_sql_query(sql, conn)

def format_table(df, title):
    """格式化表格数据为美观的文本"""
    headers = df.columns.tolist()
    return f"\n\n{title}\n{'-' * len(title)}\n" + tabulate(df, headers=headers, tablefmt="pipe", showindex=False)

def save_to_file(content, filename):
    """保存内容到文件"""
    output_dir = os.path.join('data', 'analysis_results')
    os.makedirs(output_dir, exist_ok=True)
    
    full_path = os.path.join(output_dir, filename)
    with open(full_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"已保存: {full_path}")

def main():
    """主函数"""
    # 连接数据库
    conn = connect_to_db()
    
    try:
        # 查询数据
        total_stats = query_total_stats(conn)
        top_search_df = query_top_search_terms(conn)
        product_df = query_product_categories(conn)
        features_df = query_user_features(conn)
        competitors_df = query_competitors(conn)
        questions_df = query_questions(conn)
        
        # 生成报告文本
        report = "# Tribit美国市场搜索建议数据分析报告 (文本版)\n\n"
        
        # 添加总体统计
        report += "## 总体统计\n"
        report += f"总记录数: {total_stats['total_records'].iloc[0]}\n"
        report += f"总搜索量: {total_stats['total_search_volume'].iloc[0]}\n"
        report += f"平均搜索量: {total_stats['avg_search_volume'].iloc[0]:.2f}\n"
        report += f"平均CPC: ${total_stats['avg_cpc'].iloc[0]:.2f}\n"
        
        # 添加各表格
        report += format_table(top_search_df, "## 搜索量最高的前20个搜索词")
        report += format_table(product_df, "## 产品系列分析")
        report += format_table(features_df, "## 用户关注的功能特性")
        report += format_table(competitors_df, "## 竞争对手分析")
        report += format_table(questions_df, "## 用户问题分析")
        
        # 保存报告
        save_to_file(report, "tribit_us_search_text_report.md")
        
        # 导出主要数据为CSV
        top_search_df.to_csv(os.path.join('data', 'analysis_results', 'top_searches.csv'), index=False)
        product_df.to_csv(os.path.join('data', 'analysis_results', 'product_categories.csv'), index=False)
        features_df.to_csv(os.path.join('data', 'analysis_results', 'user_features.csv'), index=False)
        competitors_df.to_csv(os.path.join('data', 'analysis_results', 'competitors.csv'), index=False)
        
        print("所有分析结果已生成完毕，保存在data/analysis_results/目录下。")
        
    except Exception as e:
        print(f"生成分析报告时出错：{e}")
    finally:
        # 关闭数据库连接
        conn.close()

if __name__ == "__main__":
    main()
