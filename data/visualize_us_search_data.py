#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import pandas as pd
import matplotlib.pyplot as plt
import numpy as np
import os
import seaborn as sns
from matplotlib.ticker import FuncFormatter

# 设置中文显示
plt.rcParams['font.sans-serif'] = ['Arial Unicode MS', 'SimHei']  # 用来正常显示中文标签
plt.rcParams['axes.unicode_minus'] = False  # 用来正常显示负号

def connect_to_db():
    """连接到SQLite数据库"""
    db_path = os.path.join('data', 'tribit.db')
    conn = sqlite3.connect(db_path)
    return conn

def query_top_search_terms(conn):
    """查询搜索量最高的前15个搜索词"""
    sql = """
    SELECT suggestion, SUM(search_volume) AS total_search_volume
    FROM RegionalSearchSuggestions
    WHERE region = 'us' AND search_volume > 0
    GROUP BY suggestion
    ORDER BY total_search_volume DESC
    LIMIT 15;
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

def format_large_number(x, pos):
    """格式化大数字，用K表示千，M表示百万"""
    if x >= 1000000:
        return f'{x/1000000:.1f}M'
    elif x >= 1000:
        return f'{x/1000:.0f}K'
    else:
        return f'{x:.0f}'

def plot_top_search_terms(df):
    """绘制搜索量最高的关键词图表"""
    plt.figure(figsize=(12, 8))
    ax = sns.barplot(x='total_search_volume', y='suggestion', data=df, palette='viridis')
    plt.title('Tribit美国市场搜索量最高的关键词', fontsize=16)
    plt.xlabel('月搜索量', fontsize=14)
    plt.ylabel('搜索词', fontsize=14)
    
    # 在柱状图上显示数值
    for i, v in enumerate(df['total_search_volume']):
        ax.text(v + 1000, i, format_large_number(v, 0), va='center')
    
    # 设置x轴格式
    ax.xaxis.set_major_formatter(FuncFormatter(format_large_number))
    
    plt.tight_layout()
    plt.savefig('data/top_search_terms.png', dpi=300)
    print("已保存：top_search_terms.png")

def plot_product_categories(df):
    """绘制产品系列搜索量图表"""
    plt.figure(figsize=(12, 10))
    
    # 创建子图1：搜索量
    plt.subplot(2, 1, 1)
    bars = plt.bar(df['product_category'], df['total_search_volume'], color=sns.color_palette("viridis", len(df)))
    plt.title('Tribit产品系列搜索量对比', fontsize=16)
    plt.ylabel('月搜索量', fontsize=14)
    plt.xticks(rotation=45, ha='right')
    
    # 在柱状图上显示数值
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 1000,
                format_large_number(height, 0), ha='center', va='bottom')
    
    # 创建子图2：平均CPC
    plt.subplot(2, 1, 2)
    bars = plt.bar(df['product_category'], df['avg_cpc'], color=sns.color_palette("magma", len(df)))
    plt.title('Tribit产品系列平均点击成本(CPC)对比', fontsize=16)
    plt.ylabel('平均CPC ($)', fontsize=14)
    plt.xticks(rotation=45, ha='right')
    
    # 在柱状图上显示数值
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 0.01,
                f'${height:.2f}', ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('data/product_categories.png', dpi=300)
    print("已保存：product_categories.png")

def plot_user_features(df):
    """绘制用户关注功能特性图表"""
    # 过滤掉"其他功能"类别，因为它的数值太大，会影响图表比例
    df_filtered = df[df['feature_category'] != '其他功能']
    
    plt.figure(figsize=(12, 8))
    
    # 以饼图形式展示
    plt.subplot(1, 2, 1)
    plt.pie(df_filtered['total_search_volume'], labels=df_filtered['feature_category'], 
            autopct='%1.1f%%', startangle=90, colors=sns.color_palette("Set3", len(df_filtered)))
    plt.axis('equal')
    plt.title('Tribit用户关注的功能特性分布', fontsize=16)
    
    # 以柱状图形式展示，更清晰地显示数值差异
    plt.subplot(1, 2, 2)
    bars = plt.bar(df_filtered['feature_category'], df_filtered['total_search_volume'], 
                  color=sns.color_palette("Set3", len(df_filtered)))
    plt.xticks(rotation=45, ha='right')
    plt.title('用户关注功能特性搜索量', fontsize=16)
    plt.ylabel('月搜索量', fontsize=14)
    
    # 在柱状图上显示数值
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 100,
                format_large_number(height, 0), ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('data/user_features.png', dpi=300)
    print("已保存：user_features.png")

def plot_competitors(df):
    """绘制竞争对手分析图表"""
    plt.figure(figsize=(12, 8))
    
    # 使用横向条形图，更容易查看标签
    colors = sns.color_palette("cool", len(df))
    bars = plt.barh(df['competitor'], df['total_search_volume'], color=colors)
    
    plt.title('Tribit与竞争对手的比较搜索量', fontsize=16)
    plt.xlabel('月搜索量', fontsize=14)
    plt.ylabel('竞争品牌', fontsize=14)
    
    # 在柱状图上显示数值
    for bar in bars:
        width = bar.get_width()
        plt.text(width + 5, bar.get_y() + bar.get_height()/2.,
                str(int(width)), ha='left', va='center')
    
    plt.tight_layout()
    plt.savefig('data/competitor_analysis.png', dpi=300)
    print("已保存：competitor_analysis.png")

def plot_questions(df):
    """绘制用户问题分析图表"""
    plt.figure(figsize=(14, 8))
    
    # 将搜索建议文本进行简化处理
    df['short_suggestion'] = df['suggestion'].apply(lambda x: x[:30] + '...' if len(x) > 30 else x)
    
    bars = plt.bar(df['short_suggestion'], df['search_volume'], color=sns.color_palette("muted", len(df)))
    plt.title('Tribit用户常见问题搜索量', fontsize=16)
    plt.xlabel('搜索问题', fontsize=14)
    plt.ylabel('月搜索量', fontsize=14)
    plt.xticks(rotation=45, ha='right')
    
    # 在柱状图上显示数值
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2., height + 1,
                str(int(height)), ha='center', va='bottom')
    
    plt.tight_layout()
    plt.savefig('data/user_questions.png', dpi=300)
    print("已保存：user_questions.png")

def create_summary_dashboard():
    """创建总结性的仪表盘图表"""
    plt.figure(figsize=(16, 12))
    
    # 设置标题
    plt.suptitle('Tribit美国市场搜索数据分析仪表盘', fontsize=20, y=0.98)
    
    # 设置图表布局
    gs = plt.GridSpec(3, 4, wspace=0.3, hspace=0.5)
    
    # 连接数据库
    conn = connect_to_db()
    
    # 查询数据
    top_search_df = query_top_search_terms(conn)
    product_df = query_product_categories(conn)
    features_df = query_user_features(conn)
    competitors_df = query_competitors(conn)
    questions_df = query_questions(conn)
    
    # 查询总搜索量
    total_search = pd.read_sql_query("""
        SELECT SUM(search_volume) AS total
        FROM RegionalSearchSuggestions
        WHERE region = 'us'
    """, conn).iloc[0]['total']
    
    # 1. 绘制产品系列分布
    ax1 = plt.subplot(gs[0, :2])
    product_df_pie = product_df.copy()
    product_df_pie['percentage'] = product_df_pie['total_search_volume'] / product_df_pie['total_search_volume'].sum() * 100
    
    # 只显示前5个类别，其余归为"其他"
    if len(product_df_pie) > 5:
        top5 = product_df_pie.iloc[:5]
        others = pd.DataFrame({
            'product_category': ['其他小类别'],
            'total_search_volume': [product_df_pie.iloc[5:]['total_search_volume'].sum()],
            'avg_cpc': [product_df_pie.iloc[5:]['avg_cpc'].mean()],
            'percentage': [product_df_pie.iloc[5:]['percentage'].sum()]
        })
        product_df_pie = pd.concat([top5, others])
    
    ax1.pie(product_df_pie['percentage'], labels=product_df_pie['product_category'], 
            autopct='%1.1f%%', startangle=90, 
            colors=sns.color_palette("viridis", len(product_df_pie)))
    ax1.set_title('产品系列搜索量分布')
    
    # 2. 绘制前5个搜索词
    ax2 = plt.subplot(gs[0, 2:])
    top5_df = top_search_df.head(5)
    bars = ax2.barh(top5_df['suggestion'], top5_df['total_search_volume'], 
                   color=sns.color_palette("magma", len(top5_df)))
    ax2.set_title('前5位搜索词')
    ax2.set_xlabel('月搜索量')
    
    # 在柱状图上显示数值
    for bar in bars:
        width = bar.get_width()
        ax2.text(width + 1000, bar.get_y() + bar.get_height()/2.,
                format_large_number(width, 0), ha='left', va='center')
    
    # 3. 绘制用户关注功能
    ax3 = plt.subplot(gs[1, :2])
    features_filtered = features_df[features_df['feature_category'] != '其他功能']
    if len(features_filtered) > 0:  # 确保有非"其他功能"的数据
        bars = ax3.bar(features_filtered['feature_category'], 
                      features_filtered['total_search_volume'],
                      color=sns.color_palette("Set2", len(features_filtered)))
        ax3.set_title('用户关注功能')
        ax3.set_ylabel('月搜索量')
        ax3.tick_params(axis='x', rotation=45)
        
        # 在柱状图上显示数值
        for bar in bars:
            height = bar.get_height()
            ax3.text(bar.get_x() + bar.get_width()/2., height + 100,
                    format_large_number(height, 0), ha='center', va='bottom')
    
    # 4. 绘制竞争对手分析
    ax4 = plt.subplot(gs[1, 2:])
    ax4.barh(competitors_df['competitor'], competitors_df['total_search_volume'],
            color=sns.color_palette("cool", len(competitors_df)))
    ax4.set_title('竞争对手分析')
    ax4.set_xlabel('比较搜索量')
    
    # 5. 绘制用户问题
    ax5 = plt.subplot(gs[2, 1:3])
    questions_df['short_suggestion'] = questions_df['suggestion'].apply(lambda x: x[:20] + '...' if len(x) > 20 else x)
    bars = ax5.bar(questions_df['short_suggestion'].head(5), 
                  questions_df['search_volume'].head(5),
                  color=sns.color_palette("muted", 5))
    ax5.set_title('用户常见问题')
    ax5.set_ylabel('月搜索量')
    ax5.tick_params(axis='x', rotation=45)
    
    # 在柱状图上显示数值
    for bar in bars:
        height = bar.get_height()
        ax5.text(bar.get_x() + bar.get_width()/2., height + 1,
                str(int(height)), ha='center', va='bottom')
    
    # 添加总结信息
    plt.figtext(0.5, 0.02, 
                f"总分析记录数: 3,078 | 总搜索量: {format_large_number(total_search, 0)} | 主要竞争对手: JBL | 热门产品: 耳机类产品", 
                ha="center", fontsize=12, 
                bbox={"facecolor":"lightgray", "alpha":0.5, "pad":5})
    
    plt.tight_layout(rect=[0, 0.03, 1, 0.95])
    plt.savefig('data/search_dashboard.png', dpi=300)
    print("已保存：search_dashboard.png")
    
    # 关闭数据库连接
    conn.close()

def main():
    """主函数"""
    # 确保输出目录存在
    os.makedirs('data', exist_ok=True)
    
    # 连接数据库
    conn = connect_to_db()
    
    try:
        # 查询数据
        top_search_df = query_top_search_terms(conn)
        product_df = query_product_categories(conn)
        features_df = query_user_features(conn)
        competitors_df = query_competitors(conn)
        questions_df = query_questions(conn)
        
        # 绘制图表
        plot_top_search_terms(top_search_df)
        plot_product_categories(product_df)
        plot_user_features(features_df)
        plot_competitors(competitors_df)
        plot_questions(questions_df)
        
        # 创建总结仪表盘
        create_summary_dashboard()
        
        print("所有图表已生成完毕。")
    except Exception as e:
        print(f"生成图表时出错：{e}")
    finally:
        # 关闭数据库连接
        conn.close()

if __name__ == "__main__":
    main()
