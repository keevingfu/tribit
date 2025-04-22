#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sqlite3
import csv
import json
from datetime import datetime

def analyze_youtube_comments():
    """分析YouTube评论数据并导入到数据库"""
    # 文件路径
    csv_file = '/Users/cavin/Desktop/tribit/VOC/dataset_youtube-comments-scraper_2025-02-24_05-32-52-047.csv'
    db_file = '/Users/cavin/Desktop/tribit/data/tribit.db'
    
    # 加载CSV文件
    print(f"正在加载CSV文件: {csv_file}")
    data = []
    
    with open(csv_file, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        print(f"文件包含以下列: {headers}")
        
        for row in reader:
            data.append(row)
    
    print(f"共读取了 {len(data)} 条评论数据")
    
    # 连接数据库
    conn = sqlite3.connect(db_file)
    cursor = conn.cursor()
    
    # 创建表（如果不存在）
    create_table(cursor)
    
    # 导入数据
    import_data(cursor, data)
    
    # 提交更改
    conn.commit()
    
    # 进行数据分析
    perform_analysis(cursor, data)
    
    # 关闭连接
    conn.close()
    
    print("分析完成")

def create_table(cursor):
    """创建YouTube评论表"""
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS youtube_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        video_id TEXT,
        video_title TEXT,
        comment_id TEXT,
        comment_text TEXT,
        comment_time TEXT,
        comment_likes INTEGER,
        author_name TEXT,
        author_channel TEXT,
        is_reply BOOLEAN,
        parent_comment_id TEXT,
        sentiment_score REAL,
        imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)
    print("YouTube评论表已创建或已存在")

def import_data(cursor, data):
    """将数据导入到数据库"""
    # 检查数据结构，适配不同的列名
    sample = data[0] if data else {}
    
    # 映射字段 - 基于实际CSV文件列名直接指定
    field_mapping = {
        'video_id': 'videoId',
        'video_title': 'title',
        'comment_id': 'cid',
        'comment_text': 'comment',  # 使用comment字段而不是text字段
        'comment_time': 'date',
        'comment_likes': 'likes',
        'author_name': 'author',
        'author_channel': 'channelId',
        'is_reply': 'replyCount',
        'parent_comment_id': 'replyToCid',
    }
    
    print(f"字段映射: {field_mapping}")
    
    # 计算简单的情感分数
    for item in data:
        comment_text = item.get(field_mapping['comment_text'], '')
        if comment_text:
            # 简单情感分析（可以替换为更复杂的算法）
            positive_words = ['great', 'good', 'excellent', 'love', 'best', 'amazing', 'perfect', 'awesome']
            negative_words = ['bad', 'poor', 'terrible', 'hate', 'worst', 'awful', 'horrible', 'disappointed']
            
            # 转换为小写以便比较
            text_lower = comment_text.lower()
            
            # 计算正面和负面词的出现次数
            positive_count = sum(1 for word in positive_words if word in text_lower)
            negative_count = sum(1 for word in negative_words if word in text_lower)
            
            # 计算情感分数 (-1 到 1 之间)
            total = positive_count + negative_count
            if total > 0:
                item['sentiment_score'] = (positive_count - negative_count) / total
            else:
                item['sentiment_score'] = 0
        else:
            item['sentiment_score'] = 0
    
    # 导入数据
    for item in data:
        # 提取数据，使用映射的字段名
        video_id = item.get(field_mapping['video_id'], '')
        video_title = item.get(field_mapping['video_title'], '')
        comment_id = item.get(field_mapping['comment_id'], '')
        comment_text = item.get(field_mapping['comment_text'], '')
        comment_time = item.get(field_mapping['comment_time'], '')
        comment_likes = item.get(field_mapping['comment_likes'], 0) or 0
        author_name = item.get(field_mapping['author_name'], '')
        author_channel = item.get(field_mapping['author_channel'], '')
        is_reply = 1 if item.get(field_mapping['is_reply']) else 0
        parent_comment_id = item.get(field_mapping['parent_comment_id'], '')
        sentiment_score = item.get('sentiment_score', 0)
        
        # 插入数据
        cursor.execute("""
        INSERT INTO youtube_comments 
        (video_id, video_title, comment_id, comment_text, comment_time, comment_likes, 
         author_name, author_channel, is_reply, parent_comment_id, sentiment_score)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (video_id, video_title, comment_id, comment_text, comment_time, comment_likes, 
              author_name, author_channel, is_reply, parent_comment_id, sentiment_score))
    
    print(f"已导入 {len(data)} 条评论数据到数据库")

def perform_analysis(cursor, data):
    """对YouTube评论数据进行分析"""
    # 1. 情感分析统计
    cursor.execute("""
    SELECT 
        CASE 
            WHEN sentiment_score > 0.3 THEN '正面评论'
            WHEN sentiment_score < -0.3 THEN '负面评论'
            ELSE '中性评论'
        END as sentiment_category,
        COUNT(*) as count
    FROM youtube_comments
    GROUP BY sentiment_category
    """)
    sentiment_stats = cursor.fetchall()
    print("\n情感分析统计:")
    for category, count in sentiment_stats:
        print(f"{category}: {count}")
    
    # 2. 评论点赞数分析
    cursor.execute("""
    SELECT 
        AVG(comment_likes) as avg_likes,
        MAX(comment_likes) as max_likes,
        MIN(comment_likes) as min_likes
    FROM youtube_comments
    """)
    likes_stats = cursor.fetchone()
    print("\n评论点赞数分析:")
    print(f"平均点赞数: {likes_stats[0]:.2f}")
    print(f"最高点赞数: {likes_stats[1]}")
    print(f"最低点赞数: {likes_stats[2]}")
    
    # 3. 热门评论分析（点赞数最高的评论）
    cursor.execute("""
    SELECT comment_text, comment_likes, author_name
    FROM youtube_comments
    ORDER BY comment_likes DESC
    LIMIT 5
    """)
    top_comments = cursor.fetchall()
    print("\n热门评论（点赞数最高）:")
    for i, (text, likes, author) in enumerate(top_comments, 1):
        print(f"{i}. {text[:50]}... - {likes} 赞 (作者: {author})")
    
    # 4. 评论者分析
    cursor.execute("""
    SELECT author_name, COUNT(*) as comment_count
    FROM youtube_comments
    GROUP BY author_name
    ORDER BY comment_count DESC
    LIMIT 5
    """)
    top_commenters = cursor.fetchall()
    print("\n最活跃评论者:")
    for author, count in top_commenters:
        print(f"{author}: {count} 条评论")
    
    # 5. 评论长度分析
    cursor.execute("""
    SELECT 
        AVG(LENGTH(comment_text)) as avg_length,
        MAX(LENGTH(comment_text)) as max_length,
        MIN(LENGTH(comment_text)) as min_length
    FROM youtube_comments
    """)
    length_stats = cursor.fetchone()
    print("\n评论长度分析:")
    print(f"平均长度: {length_stats[0]:.2f} 字符")
    print(f"最长评论: {length_stats[1]} 字符")
    print(f"最短评论: {length_stats[2]} 字符")
    
    # 6. 保存分析结果到JSON文件
    analysis_results = {
        "sentiment_analysis": {category: count for category, count in sentiment_stats},
        "likes_stats": {
            "avg_likes": likes_stats[0],
            "max_likes": likes_stats[1],
            "min_likes": likes_stats[2]
        },
        "top_comments": [{"text": text[:100], "likes": likes, "author": author} for text, likes, author in top_comments],
        "top_commenters": {author: count for author, count in top_commenters},
        "length_stats": {
            "avg_length": length_stats[0],
            "max_length": length_stats[1],
            "min_length": length_stats[2]
        },
        "analysis_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }
    
    # 创建分析结果目录
    os.makedirs('../data/analysis_results', exist_ok=True)
    
    # 保存分析结果
    with open('../data/analysis_results/youtube_comments_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, ensure_ascii=False, indent=2)
    
    print("\n分析结果已保存到 ../data/analysis_results/youtube_comments_analysis.json")

if __name__ == "__main__":
    # 切换到脚本所在目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    analyze_youtube_comments()
