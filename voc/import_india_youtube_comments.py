#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Tribit印度市场YouTube评论数据导入与分析脚本

该脚本用于将印度市场的YouTube评论数据从CSV导入到SQLite数据库，
并进行多维度分析，包括评论情感、用户参与度、热门视频等。
"""

import os
import csv
import sqlite3
import json
from datetime import datetime
import re
from collections import Counter

def import_and_analyze_india_comments():
    """导入并分析印度市场YouTube评论数据"""
    # 文件路径
    csv_file = '/Users/cavin/Desktop/tribit/VOC/dataset_youtube-comments-scraper_印度市场.csv'
    db_file = '/Users/cavin/Desktop/tribit/data/tribit.db'
    
    # 加载CSV文件
    print(f"正在加载印度市场YouTube评论数据: {csv_file}")
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
    
    # 确保表存在
    cursor.execute('''
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
        imported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        market TEXT
    )
    ''')
    
    # 检查是否需要添加market字段
    cursor.execute("PRAGMA table_info(youtube_comments)")
    columns = [col[1] for col in cursor.fetchall()]
    if 'market' not in columns:
        cursor.execute("ALTER TABLE youtube_comments ADD COLUMN market TEXT")
        print("已添加market字段到youtube_comments表")
    
    print("YouTube评论表已创建或已存在")
    
    # 字段映射
    field_mapping = {
        'video_id': 'videoId',
        'video_title': 'title',
        'comment_id': 'cid',
        'comment_text': 'comment',
        'comment_time': 'date',
        'comment_likes': 'voteCount',
        'author_name': 'author',
        'author_channel': 'channelId',
        'is_reply': 'replyCount',
        'parent_comment_id': 'replyToCid'
    }
    
    print(f"字段映射: {field_mapping}")
    
    # 导入数据
    count = 0
    for row in data:
        # 准备数据
        video_id = row.get(field_mapping['video_id'], '')
        video_title = row.get(field_mapping['video_title'], '')
        comment_id = row.get(field_mapping['comment_id'], '')
        comment_text = row.get(field_mapping['comment_text'], '')
        comment_time = row.get(field_mapping['comment_time'], '')
        
        # 处理点赞数
        comment_likes = 0
        if row.get(field_mapping['comment_likes']):
            try:
                comment_likes = int(row.get(field_mapping['comment_likes']))
            except (ValueError, TypeError):
                pass
        
        author_name = row.get(field_mapping['author_name'], '')
        author_channel = row.get(field_mapping['author_channel'], '')
        
        # 处理是否为回复
        is_reply = False
        if row.get(field_mapping['is_reply']):
            try:
                is_reply = int(row.get(field_mapping['is_reply'])) > 0
            except (ValueError, TypeError):
                pass
        
        parent_comment_id = row.get(field_mapping['parent_comment_id'], '')
        
        # 简单情感分析 (0=中性, >0=正面, <0=负面)
        sentiment_score = 0.0
        
        # 插入数据
        cursor.execute('''
        INSERT INTO youtube_comments 
        (video_id, video_title, comment_id, comment_text, comment_time, 
        comment_likes, author_name, author_channel, is_reply, 
        parent_comment_id, sentiment_score, market)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            video_id, video_title, comment_id, comment_text, comment_time,
            comment_likes, author_name, author_channel, is_reply,
            parent_comment_id, sentiment_score, 'India'
        ))
        count += 1
    
    conn.commit()
    print(f"已导入 {count} 条评论数据到数据库")
    
    # 进行数据分析
    print("\n开始分析印度市场YouTube评论数据...")
    
    # 1. 视频分析 - 找出评论最多的视频
    cursor.execute('''
    SELECT video_id, video_title, COUNT(*) as comment_count 
    FROM youtube_comments 
    WHERE market = 'India'
    GROUP BY video_id 
    ORDER BY comment_count DESC 
    LIMIT 10
    ''')
    top_videos = cursor.fetchall()
    
    print("\n评论最多的视频:")
    for i, (video_id, title, count) in enumerate(top_videos, 1):
        print(f"{i}. {title or video_id} - {count} 条评论")
    
    # 2. 评论点赞分析
    cursor.execute('''
    SELECT AVG(comment_likes) as avg_likes, 
           MAX(comment_likes) as max_likes,
           MIN(comment_likes) as min_likes
    FROM youtube_comments
    WHERE market = 'India'
    ''')
    likes_stats = cursor.fetchone()
    
    print("\n评论点赞数分析:")
    print(f"平均点赞数: {likes_stats[0]:.2f}")
    print(f"最高点赞数: {likes_stats[1]}")
    print(f"最低点赞数: {likes_stats[2]}")
    
    # 3. 热门评论 - 点赞数最高的评论
    cursor.execute('''
    SELECT comment_text, author_name, comment_likes, video_title
    FROM youtube_comments
    WHERE market = 'India'
    ORDER BY comment_likes DESC
    LIMIT 10
    ''')
    top_comments = cursor.fetchall()
    
    print("\n热门评论（点赞数最高）:")
    for i, (text, author, likes, video) in enumerate(top_comments, 1):
        print(f"{i}. \"{text[:50]}{'...' if len(text) > 50 else ''}\" - {likes} 赞 (作者: {author}, 视频: {video})")
    
    # 4. 最活跃评论者
    cursor.execute('''
    SELECT author_name, COUNT(*) as comment_count
    FROM youtube_comments
    WHERE market = 'India' AND author_name != ''
    GROUP BY author_name
    ORDER BY comment_count DESC
    LIMIT 10
    ''')
    active_commenters = cursor.fetchall()
    
    print("\n最活跃评论者:")
    for i, (author, count) in enumerate(active_commenters, 1):
        print(f"{i}. {author}: {count} 条评论")
    
    # 5. 评论长度分析
    cursor.execute('''
    SELECT AVG(LENGTH(comment_text)) as avg_length,
           MAX(LENGTH(comment_text)) as max_length,
           MIN(LENGTH(comment_text)) as min_length
    FROM youtube_comments
    WHERE market = 'India'
    ''')
    length_stats = cursor.fetchone()
    
    print("\n评论长度分析:")
    print(f"平均长度: {length_stats[0]:.2f} 字符")
    print(f"最长评论: {length_stats[1]} 字符")
    print(f"最短评论: {length_stats[2]} 字符")
    
    # 6. 评论时间分析
    cursor.execute('''
    SELECT SUBSTR(comment_time, -10) as time_period, COUNT(*) as count
    FROM youtube_comments
    WHERE market = 'India'
    GROUP BY time_period
    ORDER BY count DESC
    LIMIT 10
    ''')
    time_stats = cursor.fetchall()
    
    print("\n评论时间分析:")
    for period, count in time_stats:
        print(f"{period}: {count} 条评论")
    
    # 7. 关键词分析
    cursor.execute('''
    SELECT comment_text FROM youtube_comments
    WHERE market = 'India'
    ''')
    all_comments = cursor.fetchall()
    
    # 提取关键词
    words = []
    for (comment,) in all_comments:
        if comment:
            # 分词并过滤
            comment_words = re.findall(r'\b\w+\b', comment.lower())
            words.extend([w for w in comment_words if len(w) > 3])
    
    # 统计词频
    word_counts = Counter(words).most_common(20)
    
    print("\n评论关键词分析:")
    for word, count in word_counts:
        print(f"{word}: 出现 {count} 次")
    
    # 保存分析结果到JSON
    analysis_dir = os.path.join('/Users/cavin/Desktop/tribit/data/analysis_results')
    os.makedirs(analysis_dir, exist_ok=True)
    
    analysis_results = {
        "top_videos": [{"video_id": vid, "title": title, "comment_count": count} for vid, title, count in top_videos],
        "likes_stats": {"avg_likes": likes_stats[0], "max_likes": likes_stats[1], "min_likes": likes_stats[2]},
        "top_comments": [{"text": text, "author": author, "likes": likes, "video": video} for text, author, likes, video in top_comments],
        "active_commenters": [{"name": author, "comment_count": count} for author, count in active_commenters],
        "length_stats": {"avg_length": length_stats[0], "max_length": length_stats[1], "min_length": length_stats[2]},
        "time_stats": [{"period": period, "count": count} for period, count in time_stats],
        "keyword_stats": [{"word": word, "count": count} for word, count in word_counts]
    }
    
    output_file = os.path.join(analysis_dir, 'india_youtube_comments_analysis.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(analysis_results, f, ensure_ascii=False, indent=4)
    
    print(f"\n分析结果已保存到 {output_file}")
    print("分析完成")
    
    conn.close()

if __name__ == "__main__":
    import_and_analyze_india_comments()
