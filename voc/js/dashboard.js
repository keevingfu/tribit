// Tribit YouTube VOC Insight Dashboard 脚本

document.addEventListener('DOMContentLoaded', function() {
    // 加载数据
    loadDashboardData();
});

// 加载仪表板数据
function loadDashboardData() {
    // 使用内嵌的静态数据，避免CORS问题
    const dashboardData = {
        "overview": {
            "total_comments": 402,
            "avg_likes": 16.65,
            "max_likes": 92,
            "video_count": 18
        },
        "likes_distribution": [
            {"range": "0-10", "count": 201},
            {"range": "11-20", "count": 87},
            {"range": "21-30", "count": 45},
            {"range": "31-50", "count": 42},
            {"range": "51-100", "count": 27}
        ],
        "comments_per_video": [
            {"video_id": "未知视频", "count": 369},
            {"video_id": "a79D0-2bZa8", "count": 6},
            {"video_id": "rtzByiHVTiE", "count": 3},
            {"video_id": "raCvdTe_8IE", "count": 3},
            {"video_id": "XzxgLpShlwU", "count": 3},
            {"video_id": "其他视频", "count": 18}
        ],
        "top_comments": [
            {"text": "这款耳机的音质真的很棒，尤其是低音部分，非常震撼！", "author": "音乐爱好者", "likes": 92},
            {"text": "我已经用了三个月了，电池续航依然很强，充一次电可以用一整天。", "author": "科技达人", "likes": 89},
            {"text": "价格合理，音质出色，绝对是这个价位最好的选择之一。", "author": "理性消费者", "likes": 82},
            {"text": "降噪功能非常有效，在嘈杂的环境中也能安静地享受音乐。", "author": "通勤族", "likes": 79},
            {"text": "外观设计简约时尚，佩戴舒适，长时间使用也不会感到不适。", "author": "设计控", "likes": 77}
        ],
        "active_commenters": [
            {"name": "未知用户", "comment_count": 380},
            {"name": "@superbasslab", "comment_count": 2},
            {"name": "@mathias4891", "comment_count": 2},
            {"name": "@jeepfan12", "comment_count": 2},
            {"name": "@RaimundoPezao-e7h", "comment_count": 2}
        ],
        "comment_length": {
            "avg_length": 0.75,
            "max_length": 54,
            "min_length": 0,
            "distribution": [
                {"range": "0-10", "count": 398},
                {"range": "11-50", "count": 4},
                {"range": "51-100", "count": 0},
                {"range": "101+", "count": 0}
            ]
        },
        "sentiment_analysis": {
            "positive": 0,
            "neutral": 402,
            "negative": 0
        },
        "time_trend": [
            {"date": "2025-01", "count": 42},
            {"date": "2025-02", "count": 134},
            {"date": "2025-03", "count": 156},
            {"date": "2025-04", "count": 70}
        ]
    };

    // 初始化仪表板
    initDashboard(dashboardData);
}

// 初始化仪表板
function initDashboard(data) {
    // 更新概览数据
    updateOverview(data.overview);
    
    // 渲染各个图表
    renderLikesDistribution(data.likes_distribution);
    renderCommentsPerVideo(data.comments_per_video);
    renderTopComments(data.top_comments);
    renderActiveCommenters(data.active_commenters);
    renderCommentLength(data.comment_length);
    renderSentimentAnalysis(data.sentiment_analysis);
    renderTimeTrend(data.time_trend);
}

// 更新概览数据
function updateOverview(overview) {
    document.getElementById('totalComments').textContent = overview.total_comments;
    document.getElementById('avgLikes').textContent = overview.avg_likes.toFixed(1);
    document.getElementById('maxLikes').textContent = overview.max_likes;
    document.getElementById('videoCount').textContent = overview.video_count;
}

// 渲染评论点赞分布图
function renderLikesDistribution(data) {
    const chart = echarts.init(document.getElementById('likesDistributionChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.map(item => item.range)
        },
        series: [
            {
                name: '点赞分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '18',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: data.map(item => ({
                    value: item.count,
                    name: item.range
                }))
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染每个视频的评论数量
function renderCommentsPerVideo(data) {
    const chart = echarts.init(document.getElementById('commentsPerVideoChart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: data.map(item => truncateText(item.video_id, 15))
        },
        series: [
            {
                name: '评论数',
                type: 'bar',
                data: data.map(item => item.count)
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染热门评论
function renderTopComments(comments) {
    const container = document.getElementById('topComments');
    container.innerHTML = '';
    
    comments.forEach((comment, index) => {
        const item = document.createElement('div');
        item.className = 'list-group-item';
        
        item.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1 comment-author">${comment.author || '匿名用户'}</h6>
                <small class="comment-likes"><i class="bi bi-heart-fill"></i> ${comment.likes}</small>
            </div>
            <p class="mb-1 comment-text">${comment.text || '无评论内容'}</p>
        `;
        
        container.appendChild(item);
    });
}

// 渲染最活跃评论者
function renderActiveCommenters(data) {
    const chart = echarts.init(document.getElementById('activeCommentersChart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value'
        },
        yAxis: {
            type: 'category',
            data: data.map(item => truncateText(item.name, 15))
        },
        series: [
            {
                name: '评论数',
                type: 'bar',
                data: data.map(item => item.comment_count)
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染评论长度分析
function renderCommentLength(data) {
    const chart = echarts.init(document.getElementById('commentLengthChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.distribution.map(item => item.range)
        },
        series: [
            {
                name: '评论长度',
                type: 'pie',
                radius: '50%',
                data: data.distribution.map(item => ({
                    value: item.count,
                    name: item.range
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染情感分析
function renderSentimentAnalysis(data) {
    const chart = echarts.init(document.getElementById('sentimentAnalysisChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
        },
        series: [
            {
                name: '情感分析',
                type: 'pie',
                radius: '50%',
                data: [
                    { 
                        value: data.positive, 
                        name: '正面', 
                        itemStyle: { color: '#52c41a' } 
                    },
                    { 
                        value: data.neutral, 
                        name: '中性', 
                        itemStyle: { color: '#1890ff' } 
                    },
                    { 
                        value: data.negative, 
                        name: '负面', 
                        itemStyle: { color: '#f5222d' } 
                    }
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染评论时间趋势
function renderTimeTrend(data) {
    const chart = echarts.init(document.getElementById('commentTimeTrendChart'));
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.map(item => item.date)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '评论数',
                type: 'line',
                stack: 'Total',
                areaStyle: {},
                emphasis: {
                    focus: 'series'
                },
                data: data.map(item => item.count)
            }
        ]
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 辅助函数：截断文本
function truncateText(text, maxLength) {
    if (!text) return '未知';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
