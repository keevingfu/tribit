// Tribit YouTube India VOC Insight Dashboard 脚本

document.addEventListener('DOMContentLoaded', function() {
    // 加载仪表板数据
    loadDashboardData();
});

// 加载仪表板数据
function loadDashboardData() {
    // 使用内嵌的静态数据，避免CORS问题
    const dashboardData = {
        "overview": {
            "total_comments": 4503,
            "avg_likes": 1.08,
            "max_likes": 374,
            "avg_comment_length": 52.94
        },
        "top_videos": [
            {"title": "Best BT Speaker Under 6000|Tribit Stormbox 2 Review Hindi", "count": 600},
            {"title": "अब पता चला असली सच 😱! Tribit XSound Plus 2", "count": 490},
            {"title": "TRIBIT StormBox Blast 2 - I tried 200W RGB Speaker", "count": 430},
            {"title": "ऐसा होगा पता नहीं था 😱! Tribit StormBox Flow", "count": 402},
            {"title": "Tribit XSound Plus 2 vs MaxSound Plus | UNBOXING + BASS TEST", "count": 372},
            {"title": "Tribit Xsound Plus 2 Speaker Review & Bass Test", "count": 356},
            {"title": "अब मिला टक्कर का खिलाड़ी🤫!! Tribit StormBox 2", "count": 338},
            {"title": "Tribit StormBox Blast 2 Review | Bass Dynamite & Parybox Killer?", "count": 316}
        ],
        "keywords": [
            {"word": "speaker", "count": 1108},
            {"word": "bhai", "count": 1048},
            {"word": "tribit", "count": 1046},
            {"word": "sound", "count": 992},
            {"word": "please", "count": 918},
            {"word": "plus", "count": 698},
            {"word": "this", "count": 572},
            {"word": "review", "count": 572},
            {"word": "video", "count": 546},
            {"word": "better", "count": 438},
            {"word": "stormbox", "count": 428},
            {"word": "bass", "count": 424},
            {"word": "flip", "count": 416},
            {"word": "best", "count": 414}
        ],
        "top_comments": [
            {
                "text": "Ye hoti hai real unboxing 😂😂",
                "author": "@RahulSharma-tq4bg",
                "likes": 374,
                "video": "ऐसा होगा पता नहीं था 😱! Tribit StormBox Flow"
            },
            {
                "text": "Bahi ne speaker ka ASLI MEIN UNBOXING KAR DALA😂😂",
                "author": "@alpspirit",
                "likes": 321,
                "video": "अब पता चला असली सच 😱! Tribit XSound Plus 2"
            },
            {
                "text": "JBL Ko Takkar Dene Vala❎ JBL Ke Rate Vala✅",
                "author": "@amiteshbaghel",
                "likes": 180,
                "video": "अब मिला टक्कर का खिलाड़ी🤫!! Tribit StormBox 2"
            },
            {
                "text": "দাদা tech burner এর  smart watch  টা review করো❤❤❤...",
                "author": "@AquaticFish521",
                "likes": 104,
                "video": "TRIBIT StormBox Blast 2 - I tried 200W RGB Speaker"
            },
            {
                "text": "\"Bluetooth is ready to pair\" 😂😂",
                "author": "@InoriMaster11",
                "likes": 103,
                "video": "अब मिला टक्कर का खिलाड़ी🤫!! Tribit StormBox 2"
            }
        ],
        "active_commenters": [
            {"name": "@metatechreviews", "count": 360},
            {"name": "@WhySoTechie", "count": 138},
            {"name": "@TechDreams", "count": 80},
            {"name": "@prash1246", "count": 78},
            {"name": "@TechReflex", "count": 78},
            {"name": "@SteReowow", "count": 76},
            {"name": "@techmesh", "count": 64},
            {"name": "@DesiMarsGamer", "count": 60}
        ],
        "product_interest": [
            {"product": "MaxSound Plus", "mentions": 312},
            {"product": "StormBox Micro 2", "mentions": 287},
            {"product": "StormBox Blast", "mentions": 265},
            {"product": "FlyBuds", "mentions": 198},
            {"product": "StormBox Flow", "mentions": 176},
            {"product": "XSound Go", "mentions": 143}
        ],
        "sentiment": {
            "positive": 2432,
            "neutral": 1526,
            "negative": 545
        },
        "comment_length": [
            {"range": "短 (≤30字符)", "count": 1856},
            {"range": "中 (31-100字符)", "count": 1934},
            {"range": "长 (101-200字符)", "count": 578},
            {"range": "超长 (>200字符)", "count": 135}
        ],
        "competitor_mentions": [
            {"competitor": "JBL", "mentions": 578},
            {"competitor": "Sony", "mentions": 312},
            {"competitor": "Bose", "mentions": 245},
            {"competitor": "Anker", "mentions": 198},
            {"competitor": "Boat", "mentions": 423},
            {"competitor": "Marshall", "mentions": 167},
            {"competitor": "Ultimate Ears", "mentions": 132}
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
    renderTopVideosChart(data.top_videos);
    renderKeywordsChart(data.keywords);
    renderTopComments(data.top_comments);
    renderActiveCommentersChart(data.active_commenters);
    renderProductInterestChart(data.product_interest);
    renderSentimentChart(data.sentiment);
    renderCommentLengthChart(data.comment_length);
    renderCompetitorMentionsChart(data.competitor_mentions);
}

// 更新概览数据
function updateOverview(overview) {
    document.getElementById('totalComments').textContent = overview.total_comments.toLocaleString();
    document.getElementById('avgLikes').textContent = overview.avg_likes.toFixed(2);
    document.getElementById('maxLikes').textContent = overview.max_likes.toLocaleString();
    document.getElementById('avgCommentLength').textContent = overview.avg_comment_length.toFixed(2);
}

// 渲染评论最多的视频
function renderTopVideosChart(data) {
    const chart = echarts.init(document.getElementById('topVideosChart'));
    
    // 准备数据
    const titles = data.map(item => truncateText(item.title, 20));
    const counts = data.map(item => item.count);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                return `${data[dataIndex].title}<br/>评论数量: ${data[dataIndex].count}`;
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
            name: '评论数量'
        },
        yAxis: {
            type: 'category',
            data: titles,
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        series: [
            {
                name: '评论数量',
                type: 'bar',
                data: counts,
                itemStyle: {
                    color: function(params) {
                        // 深浅蓝色渐变
                        return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#1890ff' },
                            { offset: 1, color: '#69c0ff' }
                        ]);
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
                }
            }
        ]
    };
    
    chart.setOption(option);
    
    // 点击事件
    chart.on('click', function(params) {
        const videoIndex = params.dataIndex;
        const videoData = data[videoIndex];
        showVideoDetails(videoData.title, videoIndex);
    });
    
    // 初始化视频详情按钮事件
    document.getElementById('showVideoDetailsBtn').addEventListener('click', function() {
        loadVideoDetailsList(data);
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
    
    // 存储视频数据供其他函数使用
    window.topVideosData = data;
}

// 渲染关键词分析
function renderKeywordsChart(data) {
    const chart = echarts.init(document.getElementById('keywordsChart'));
    
    // 只取前10个关键词
    const topKeywords = data.slice(0, 10);
    
    // 准备数据
    const words = topKeywords.map(item => item.word);
    const counts = topKeywords.map(item => item.count);
    
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
            data: words,
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        series: [
            {
                name: '出现次数',
                type: 'bar',
                data: counts,
                itemStyle: {
                    color: function(params) {
                        // 印度国旗色彩
                        const colors = ['#FF9933', '#138808', '#000080', '#FF5733', '#C70039', '#900C3F', '#581845'];
                        return colors[params.dataIndex % colors.length];
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}'
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
            <small class="comment-video"><i class="bi bi-youtube"></i> ${comment.video}</small>
        `;
        
        container.appendChild(item);
    });
}

// 渲染最活跃评论者
function renderActiveCommentersChart(data) {
    const chart = echarts.init(document.getElementById('activeCommentersChart'));
    
    // 准备数据
    const names = data.map(item => truncateText(item.name, 15));
    const counts = data.map(item => item.count);
    
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
            data: names,
            axisLabel: {
                interval: 0
            }
        },
        series: [
            {
                name: '评论数',
                type: 'bar',
                data: counts,
                itemStyle: {
                    color: '#138808'  // 印度国旗绿色
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

// 渲染产品关注度分析
function renderProductInterestChart(data) {
    const chart = echarts.init(document.getElementById('productInterestChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.map(item => item.product)
        },
        series: [
            {
                name: '产品关注度',
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
                    value: item.mentions,
                    name: item.product
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

// 渲染情感分析
function renderSentimentChart(data) {
    const chart = echarts.init(document.getElementById('sentimentChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
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

// 渲染评论长度分布
function renderCommentLengthChart(data) {
    const chart = echarts.init(document.getElementById('commentLengthChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.map(item => item.range)
        },
        series: [
            {
                name: '评论长度',
                type: 'pie',
                radius: '50%',
                data: data.map(item => ({
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

// 渲染竞品提及分析
function renderCompetitorMentionsChart(data) {
    const chart = echarts.init(document.getElementById('competitorMentionsChart'));
    
    // 准备数据
    const competitors = data.map(item => item.competitor);
    const mentions = data.map(item => item.mentions);
    
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
            type: 'category',
            data: competitors
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '提及次数',
                type: 'bar',
                data: mentions,
                itemStyle: {
                    color: function(params) {
                        // 颜色渐变
                        const colorList = ['#FF9933', '#EE802F', '#DD672B', '#CC4E27', '#BB3523', '#AA1C1F', '#990000'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                },
                label: {
                    show: true,
                    position: 'top'
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

// 辅助函数：截断文本
function truncateText(text, maxLength) {
    if (!text) return '未知';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

// 加载视频详情列表
function loadVideoDetailsList(videos) {
    const videoDetailsList = document.getElementById('videoDetailsList');
    videoDetailsList.innerHTML = '';
    
    // 为每个视频创建一个列表项
    videos.forEach((video, index) => {
        const videoId = extractVideoId(video.title);
        const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : 'https://via.placeholder.com/320x180?text=No+Preview';
        
        const listItem = document.createElement('a');
        listItem.href = '#';
        listItem.className = 'list-group-item list-group-item-action d-flex gap-3 py-3';
        listItem.setAttribute('data-index', index);
        listItem.addEventListener('click', function(e) {
            e.preventDefault();
            showVideoPreview(video.title, index);
        });
        
        listItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${video.title}" width="120" height="68" class="rounded flex-shrink-0">
            <div class="d-flex gap-2 w-100 justify-content-between">
                <div>
                    <h6 class="mb-0">${video.title}</h6>
                    <p class="mb-0 opacity-75">评论数量: ${video.count}</p>
                </div>
                <small class="opacity-50 text-nowrap">
                    <i class="bi bi-youtube text-danger"></i>
                </small>
            </div>
        `;
        
        videoDetailsList.appendChild(listItem);
    });
}

// 显示视频详情
function showVideoDetails(videoTitle, index) {
    // 加载视频详情列表
    loadVideoDetailsList(window.topVideosData);
    
    // 打开模态框
    const videoDetailsModal = new bootstrap.Modal(document.getElementById('videoDetailsModal'));
    videoDetailsModal.show();
}

// 显示视频预览
function showVideoPreview(videoTitle, index) {
    const videoId = extractVideoId(videoTitle);
    const videoPreviewFrame = document.getElementById('videoPreviewFrame');
    const videoPreviewModalLabel = document.getElementById('videoPreviewModalLabel');
    const openYouTubeLink = document.getElementById('openYouTubeLink');
    const videoCommentsSummary = document.getElementById('videoCommentsSummary');
    
    // 设置模态框标题
    videoPreviewModalLabel.textContent = videoTitle;
    
    // 设置视频预览
    if (videoId) {
        videoPreviewFrame.src = `https://www.youtube.com/embed/${videoId}`;
        openYouTubeLink.href = `https://www.youtube.com/watch?v=${videoId}`;
        openYouTubeLink.style.display = 'block';
    } else {
        videoPreviewFrame.src = '';
        openYouTubeLink.style.display = 'none';
    }
    
    // 加载视频评论摘要
    loadVideoCommentsSummary(videoTitle, index);
    
    // 打开模态框
    const videoPreviewModal = new bootstrap.Modal(document.getElementById('videoPreviewModal'));
    videoPreviewModal.show();
    
    // 当模态框关闭时停止视频
    document.getElementById('videoPreviewModal').addEventListener('hidden.bs.modal', function () {
        videoPreviewFrame.src = '';
    });
}

// 加载视频评论摘要
function loadVideoCommentsSummary(videoTitle, index) {
    const videoCommentsSummary = document.getElementById('videoCommentsSummary');
    videoCommentsSummary.innerHTML = '';
    
    // 模拟数据 - 在实际应用中应从后端获取
    const mockComments = [
        {
            text: "Ye hoti hai real unboxing 😂😂",
            author: "@RahulSharma-tq4bg",
            likes: 374
        },
        {
            text: "Bahi ne speaker ka ASLI MEIN UNBOXING KAR DALA😂😂",
            author: "@alpspirit",
            likes: 321
        },
        {
            text: "JBL Ko Takkar Dene Vala❎ JBL Ke Rate Vala✅",
            author: "@amiteshbaghel",
            likes: 180
        },
        {
            text: "Sound quality is amazing for this price range!",
            author: "@techreviewer",
            likes: 156
        },
        {
            text: "Bass is really powerful, I'm impressed",
            author: "@musiclover",
            likes: 129
        }
    ];
    
    // 添加评论到摘要区域
    mockComments.forEach(comment => {
        const commentItem = document.createElement('div');
        commentItem.className = 'list-group-item';
        commentItem.innerHTML = `
            <div class="d-flex w-100 justify-content-between">
                <h6 class="mb-1">${comment.author}</h6>
                <small><i class="bi bi-hand-thumbs-up"></i> ${comment.likes}</small>
            </div>
            <p class="mb-1">${comment.text}</p>
        `;
        videoCommentsSummary.appendChild(commentItem);
    });
}

// 从视频标题中提取YouTube视频ID
function extractVideoId(videoTitle) {
    // 模拟数据 - 在实际应用中应从后端获取
    // 根据视频标题匹配视频ID
    const videoIdMap = {
        'Best BT Speaker Under 6000|Tribit Stormbox 2 Review Hindi': 'dQw4w9WgXcQ',
        'अब पता चला असली सच 😱! Tribit XSound Plus 2': 'jNQXAC9IVRw',
        'TRIBIT StormBox Blast 2 - I tried 200W RGB Speaker': 'kJQP7kiw5Fk',
        'ऐसा होगा पता नहीं था 😱! Tribit StormBox Flow': 'fJ9rUzIMcZQ',
        'Tribit XSound Plus 2 vs MaxSound Plus | UNBOXING + BASS TEST': 'QH2-TGUlwu4',
        'Tribit Xsound Plus 2 Speaker Review & Bass Test': 'ZZ5LpwO-An4',
        'अब मिला टक्कर का खिलाड़ी🤫!! Tribit StormBox 2': '9bZkp7q19f0',
        'Tribit StormBox Blast 2 Review | Bass Dynamite & Parybox Killer?': 'dQw4w9WgXcQ'
    };
    
    return videoIdMap[videoTitle] || '';
}
