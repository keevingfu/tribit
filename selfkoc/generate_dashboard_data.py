#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sqlite3
import json
import os

# 连接到数据库
conn = sqlite3.connect('/Users/cavin/Desktop/tribit/data/tribit.db')
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

# 创建数据目录
os.makedirs('dashboard_data', exist_ok=True)

# 1. 平台概览数据
platform_overview = {
    'platforms': ['Instagram', 'TikTok', 'YouTube'],
    'accounts': [],
    'posts': [],
    'views': [],
    'likes': [],
    'comments': []
}

# Instagram 数据
cursor.execute('''
    SELECT 
        COUNT(DISTINCT influencer) as account_count,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments
    FROM 
        selfkoc_instagram
''')
instagram_data = cursor.fetchone()

# 处理 Instagram 的观看量 (需要处理逗号)
cursor.execute('''
    SELECT 
        SUM(CASE 
            WHEN views = '' OR views IS NULL THEN 0 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END) as total_views
    FROM 
        selfkoc_instagram
''')
instagram_views = cursor.fetchone()['total_views']

platform_overview['accounts'].append(instagram_data['account_count'])
platform_overview['posts'].append(instagram_data['post_count'])
platform_overview['views'].append(instagram_views)
platform_overview['likes'].append(instagram_data['total_likes'])
platform_overview['comments'].append(instagram_data['total_comments'])

# TikTok 数据
cursor.execute('''
    SELECT 
        COUNT(DISTINCT influencer) as account_count,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        SUM(views) as total_views
    FROM 
        selfkoc_tiktok
''')
tiktok_data = cursor.fetchone()

platform_overview['accounts'].append(tiktok_data['account_count'])
platform_overview['posts'].append(tiktok_data['post_count'])
platform_overview['views'].append(tiktok_data['total_views'])
platform_overview['likes'].append(tiktok_data['total_likes'])
platform_overview['comments'].append(tiktok_data['total_comments'])

# YouTube 数据
cursor.execute('''
    SELECT 
        COUNT(DISTINCT influencer) as account_count,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        SUM(views) as total_views
    FROM 
        selfkoc_youtube
''')
youtube_data = cursor.fetchone()

platform_overview['accounts'].append(youtube_data['account_count'])
platform_overview['posts'].append(youtube_data['post_count'])
platform_overview['views'].append(youtube_data['total_views'])
platform_overview['likes'].append(youtube_data['total_likes'])
platform_overview['comments'].append(youtube_data['total_comments'])

# 保存平台概览数据
with open('dashboard_data/platform_overview.json', 'w') as f:
    json.dump(platform_overview, f)

# 2. 账号表现数据
# Instagram 账号表现
cursor.execute('''
    SELECT 
        influencer,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        SUM(CASE 
            WHEN views = '' OR views IS NULL THEN 0 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END) as total_views,
        AVG(CASE 
            WHEN views = '' OR views IS NULL THEN 0 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END) as avg_views
    FROM 
        selfkoc_instagram
    GROUP BY 
        influencer
    ORDER BY 
        total_views DESC
''')
instagram_accounts = []
for row in cursor.fetchall():
    instagram_accounts.append(dict(row))

with open('dashboard_data/instagram_accounts.json', 'w') as f:
    json.dump(instagram_accounts, f)

# TikTok 账号表现
cursor.execute('''
    SELECT 
        influencer,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        SUM(shares) as total_shares,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        AVG(shares) as avg_shares,
        SUM(views) as total_views,
        AVG(views) as avg_views
    FROM 
        selfkoc_tiktok
    GROUP BY 
        influencer
    ORDER BY 
        total_views DESC
''')
tiktok_accounts = []
for row in cursor.fetchall():
    tiktok_accounts.append(dict(row))

with open('dashboard_data/tiktok_accounts.json', 'w') as f:
    json.dump(tiktok_accounts, f)

# YouTube 账号表现
cursor.execute('''
    SELECT 
        influencer,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        SUM(views) as total_views,
        AVG(views) as avg_views
    FROM 
        selfkoc_youtube
    GROUP BY 
        influencer
    ORDER BY 
        total_views DESC
''')
youtube_accounts = []
for row in cursor.fetchall():
    youtube_accounts.append(dict(row))

with open('dashboard_data/youtube_accounts.json', 'w') as f:
    json.dump(youtube_accounts, f)

# 3. 月度趋势数据
# Instagram 月度趋势
cursor.execute('''
    SELECT 
        substr(post_date, 1, 7) as month,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        SUM(CASE 
            WHEN views = '' OR views IS NULL THEN 0 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END) as total_views,
        AVG(CASE 
            WHEN views = '' OR views IS NULL THEN 0 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END) as avg_views
    FROM 
        selfkoc_instagram
    WHERE 
        post_date != ''
    GROUP BY 
        month
    ORDER BY 
        month
''')
instagram_trends = []
for row in cursor.fetchall():
    instagram_trends.append(dict(row))

with open('dashboard_data/instagram_trends.json', 'w') as f:
    json.dump(instagram_trends, f)

# TikTok 月度趋势
cursor.execute('''
    SELECT 
        substr(post_date, 1, 7) as month,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        SUM(shares) as total_shares,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        AVG(shares) as avg_shares,
        SUM(views) as total_views,
        AVG(views) as avg_views
    FROM 
        selfkoc_tiktok
    WHERE 
        post_date != ''
    GROUP BY 
        month
    ORDER BY 
        month
''')
tiktok_trends = []
for row in cursor.fetchall():
    tiktok_trends.append(dict(row))

with open('dashboard_data/tiktok_trends.json', 'w') as f:
    json.dump(tiktok_trends, f)

# YouTube 月度趋势
cursor.execute('''
    SELECT 
        substr(post_date, 1, 7) as month,
        COUNT(*) as post_count,
        SUM(likes) as total_likes,
        SUM(comments) as total_comments,
        AVG(likes) as avg_likes,
        AVG(comments) as avg_comments,
        SUM(views) as total_views,
        AVG(views) as avg_views
    FROM 
        selfkoc_youtube
    WHERE 
        post_date != ''
    GROUP BY 
        month
    ORDER BY 
        month
''')
youtube_trends = []
for row in cursor.fetchall():
    youtube_trends.append(dict(row))

with open('dashboard_data/youtube_trends.json', 'w') as f:
    json.dump(youtube_trends, f)

# 4. 爆款内容数据
# Instagram 爆款内容
cursor.execute('''
    SELECT 
        post_url,
        influencer,
        likes,
        comments,
        views,
        post_date
    FROM 
        selfkoc_instagram
    ORDER BY 
        CASE 
            WHEN views = '' OR views IS NULL THEN 0 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END DESC
    LIMIT 10
''')
instagram_top_content = []
for row in cursor.fetchall():
    instagram_top_content.append(dict(row))

with open('dashboard_data/instagram_top_content.json', 'w') as f:
    json.dump(instagram_top_content, f)

# TikTok 爆款内容
cursor.execute('''
    SELECT 
        post_url,
        influencer,
        likes,
        comments,
        shares,
        views,
        post_date
    FROM 
        selfkoc_tiktok
    ORDER BY 
        views DESC
    LIMIT 10
''')
tiktok_top_content = []
for row in cursor.fetchall():
    tiktok_top_content.append(dict(row))

with open('dashboard_data/tiktok_top_content.json', 'w') as f:
    json.dump(tiktok_top_content, f)

# YouTube 爆款内容
cursor.execute('''
    SELECT 
        post_url,
        influencer,
        likes,
        comments,
        views,
        post_date
    FROM 
        selfkoc_youtube
    ORDER BY 
        views DESC
    LIMIT 10
''')
youtube_top_content = []
for row in cursor.fetchall():
    youtube_top_content.append(dict(row))

with open('dashboard_data/youtube_top_content.json', 'w') as f:
    json.dump(youtube_top_content, f)

# 5. 互动率数据
# 计算所有平台的互动率数据
engagement_data = {
    'platforms': ['Instagram', 'TikTok', 'YouTube'],
    'engagement_rates': []
}

# Instagram 互动率
cursor.execute('''
    SELECT 
        AVG((likes + comments * 5.0) / 
        CASE 
            WHEN views = '' OR views IS NULL OR CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) = 0 THEN 1 
            ELSE CAST(REPLACE(REPLACE(views, ',', ''), '"', '') AS INTEGER) 
        END * 1000) as engagement_rate
    FROM 
        selfkoc_instagram
    WHERE 
        views != '' AND views IS NOT NULL
''')
instagram_engagement = cursor.fetchone()['engagement_rate']
engagement_data['engagement_rates'].append(instagram_engagement)

# TikTok 互动率
cursor.execute('''
    SELECT 
        AVG((likes + comments * 5.0 + shares * 10.0) / 
        CASE WHEN views = 0 THEN 1 ELSE views END * 1000) as engagement_rate
    FROM 
        selfkoc_tiktok
    WHERE 
        views > 0
''')
tiktok_engagement = cursor.fetchone()['engagement_rate']
engagement_data['engagement_rates'].append(tiktok_engagement)

# YouTube 互动率
cursor.execute('''
    SELECT 
        AVG((likes + comments * 5.0) / 
        CASE WHEN views = 0 THEN 1 ELSE views END * 1000) as engagement_rate
    FROM 
        selfkoc_youtube
    WHERE 
        views > 0
''')
youtube_engagement = cursor.fetchone()['engagement_rate']
engagement_data['engagement_rates'].append(youtube_engagement)

with open('dashboard_data/engagement_rates.json', 'w') as f:
    json.dump(engagement_data, f)

# 关闭数据库连接
conn.close()

print("Dashboard data generated successfully!")
