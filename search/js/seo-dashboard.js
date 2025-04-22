// Tribit SEO 排名分析仪表板脚本

document.addEventListener('DOMContentLoaded', function() {
    // 加载仪表板数据
    loadDashboardData();
});

// 加载仪表板数据
function loadDashboardData() {
    // 使用内嵌的静态数据，避免CORS问题
    const dashboardData = {
        "overview": {
            "total_keywords": 892,
            "top10_keywords": 249,
            "total_search_volume": 1138450,
            "total_traffic": 24521
        },
        "rank_distribution": [
            {"rank_group": "1-3名", "keyword_count": 115},
            {"rank_group": "4-10名", "keyword_count": 134},
            {"rank_group": "11-20名", "keyword_count": 100},
            {"rank_group": "20名以后", "keyword_count": 543}
        ],
        "volume_distribution": [
            {"volume_group": "大搜索量 (>10000)", "keyword_count": 5, "total_volume": 878500},
            {"volume_group": "中搜索量 (1001-10000)", "keyword_count": 54, "total_volume": 114100},
            {"volume_group": "小搜索量 (101-1000)", "keyword_count": 322, "total_volume": 118960},
            {"volume_group": "极小搜索量 (≤100)", "keyword_count": 511, "total_volume": 26890}
        ],
        "top_traffic_keywords": [
            {"keyword": "xfree", "position": 5, "search_volume": 301000, "traffic": 13244, "percentage": 54.01},
            {"keyword": "tribit stormbox blast", "position": 1, "search_volume": 1900, "traffic": 1520, "percentage": 6.19},
            {"keyword": "tribit", "position": 1, "search_volume": 1900, "traffic": 1520, "percentage": 6.19},
            {"keyword": "tribit speaker", "position": 1, "search_volume": 1300, "traffic": 1040, "percentage": 4.24},
            {"keyword": "tribit headphones", "position": 1, "search_volume": 1000, "traffic": 800, "percentage": 3.26},
            {"keyword": "tribit stormbox", "position": 1, "search_volume": 1000, "traffic": 800, "percentage": 3.26},
            {"keyword": "tribit stormbox micro 2", "position": 1, "search_volume": 880, "traffic": 704, "percentage": 2.87},
            {"keyword": "tribit earbuds", "position": 1, "search_volume": 590, "traffic": 472, "percentage": 1.92},
            {"keyword": "tribit flybuds 3", "position": 1, "search_volume": 390, "traffic": 312, "percentage": 1.27},
            {"keyword": "tribit stormbox blast 2", "position": 1, "search_volume": 320, "traffic": 256, "percentage": 1.04}
        ],
        "intent_distribution": [
            {"intent": "informational, transactional", "count": 382},
            {"intent": "informational", "count": 218},
            {"intent": "commercial", "count": 173},
            {"intent": "transactional", "count": 51},
            {"intent": "navigational, transactional", "count": 28},
            {"intent": "navigational", "count": 18},
            {"intent": "commercial, informational", "count": 17},
            {"intent": "commercial, navigational", "count": 4},
            {"intent": "informational, navigational", "count": 1}
        ],
        "product_performance": [
            {"series": "XFree系列", "keyword_count": 19, "avg_position": 23.4, "total_volume": 317640, "total_traffic": 13571},
            {"series": "其他/通用", "keyword_count": 532, "avg_position": 42.8, "total_volume": 725030, "total_traffic": 4758},
            {"series": "StormBox系列", "keyword_count": 178, "avg_position": 35.2, "total_volume": 64020, "total_traffic": 4514},
            {"series": "XSound系列", "keyword_count": 99, "avg_position": 27.7, "total_volume": 19120, "total_traffic": 766},
            {"series": "FlyBuds系列", "keyword_count": 46, "avg_position": 21.4, "total_volume": 5400, "total_traffic": 568},
            {"series": "QuietPlus系列", "keyword_count": 8, "avg_position": 19.4, "total_volume": 6140, "total_traffic": 252},
            {"series": "MoveBuds系列", "keyword_count": 10, "avg_position": 47.3, "total_volume": 1100, "total_traffic": 92}
        ],
        "serp_features": [
            {"feature": "Related searches", "count": 877},
            {"feature": "Video", "count": 852},
            {"feature": "People also ask", "count": 814},
            {"feature": "Image pack", "count": 696},
            {"feature": "People also search", "count": 675},
            {"feature": "Reviews", "count": 664},
            {"feature": "Image", "count": 589},
            {"feature": "Sitelinks", "count": 573},
            {"feature": "Discussions and forums", "count": 516},
            {"feature": "Popular products", "count": 385}
        ],
        "rank_changes": [
            {"change": "排名上升", "keyword_count": 7},
            {"change": "排名下降", "keyword_count": 12},
            {"change": "排名不变", "keyword_count": 836}
        ],
        "competition_analysis": [
            {"level": "高竞争 (>0.66)", "keyword_count": 668, "avg_cpc": 0.42},
            {"level": "中竞争 (0.33-0.66)", "keyword_count": 37, "avg_cpc": 0.25},
            {"level": "低竞争 (<0.33)", "keyword_count": 76, "avg_cpc": 0.07},
            {"level": "无竞争 (0)", "keyword_count": 111, "avg_cpc": 0.00}
        ],
        "keywords_table": [
            {"keyword": "xfree", "position": 5, "search_volume": 301000, "traffic": 13244, "percentage": 54.01, "cpc": 0.00, "competition": 0},
            {"keyword": "tribit stormbox blast", "position": 1, "search_volume": 1900, "traffic": 1520, "percentage": 6.19, "cpc": 0.50, "competition": 1},
            {"keyword": "tribit", "position": 1, "search_volume": 1900, "traffic": 1520, "percentage": 6.19, "cpc": 0.23, "competition": 1},
            {"keyword": "tribit speaker", "position": 1, "search_volume": 1300, "traffic": 1040, "percentage": 4.24, "cpc": 0.32, "competition": 1},
            {"keyword": "tribit headphones", "position": 1, "search_volume": 1000, "traffic": 800, "percentage": 3.26, "cpc": 0.24, "competition": 0.07},
            {"keyword": "tribit stormbox", "position": 1, "search_volume": 1000, "traffic": 800, "percentage": 3.26, "cpc": 0.38, "competition": 1},
            {"keyword": "tribit stormbox micro 2", "position": 1, "search_volume": 880, "traffic": 704, "percentage": 2.87, "cpc": 0.50, "competition": 1},
            {"keyword": "tribit earbuds", "position": 1, "search_volume": 590, "traffic": 472, "percentage": 1.92, "cpc": 0.27, "competition": 1},
            {"keyword": "tribit flybuds 3", "position": 1, "search_volume": 390, "traffic": 312, "percentage": 1.27, "cpc": 0.26, "competition": 1},
            {"keyword": "tribit stormbox blast 2", "position": 1, "search_volume": 320, "traffic": 256, "percentage": 1.04, "cpc": 0.50, "competition": 1},
            {"keyword": "tribit speakers", "position": 1, "search_volume": 320, "traffic": 256, "percentage": 1.04, "cpc": 0.32, "competition": 1},
            {"keyword": "tribit stormbox blast.", "position": 1, "search_volume": 260, "traffic": 208, "percentage": 0.84, "cpc": 0.50, "competition": 1},
            {"keyword": "tribit stormbox 2", "position": 1, "search_volume": 260, "traffic": 208, "percentage": 0.84, "cpc": 0.47, "competition": 1},
            {"keyword": "tribit maxsound plus", "position": 1, "search_volume": 260, "traffic": 208, "percentage": 0.84, "cpc": 0.26, "competition": 1},
            {"keyword": "tribit xsound plus 2", "position": 1, "search_volume": 210, "traffic": 168, "percentage": 0.68, "cpc": 0.38, "competition": 1},
            {"keyword": "tribit stormbox pro", "position": 1, "search_volume": 210, "traffic": 168, "percentage": 0.68, "cpc": 0.35, "competition": 1},
            {"keyword": "tribit micro 2", "position": 1, "search_volume": 170, "traffic": 136, "percentage": 0.55, "cpc": 0.40, "competition": 1},
            {"keyword": "tribit quietplus 72", "position": 2, "search_volume": 1000, "traffic": 132, "percentage": 0.53, "cpc": 0.00, "competition": 0.93},
            {"keyword": "stormbox blast", "position": 1, "search_volume": 480, "traffic": 119, "percentage": 0.48, "cpc": 0.49, "competition": 1},
            {"keyword": "tribit xfree go", "position": 2, "search_volume": 880, "traffic": 116, "percentage": 0.47, "cpc": 0.00, "competition": 0.01}
        ]
    };

    // 初始化仪表板
    initDashboard(dashboardData);
}

// 初始化仪表板函数
function initDashboard(data) {
    // 更新概览数据
    updateOverviewStats(data.overview);
    
    // 初始化各个图表
    initRankDistributionChart(data.rank_distribution);
    initVolumeDistributionChart(data.volume_distribution);
    initTopTrafficKeywordsChart(data.top_traffic_keywords);
    initIntentDistributionChart(data.intent_distribution);
    initProductPerformanceChart(data.product_performance);
    initSerpFeaturesChart(data.serp_features);
    initRankChangesChart(data.rank_changes);
    initCompetitionAnalysisChart(data.competition_analysis);
    
    // 初始化关键词表格
    initKeywordsTable(data.keywords_table);
}

// 更新概览统计数据
function updateOverviewStats(overview) {
    document.getElementById('totalKeywords').textContent = overview.total_keywords.toLocaleString();
    document.getElementById('top10Keywords').textContent = overview.top10_keywords.toLocaleString();
    document.getElementById('totalSearchVolume').textContent = overview.total_search_volume.toLocaleString();
    document.getElementById('totalTraffic').textContent = overview.total_traffic.toLocaleString();
}

// 初始化排名分布图表
function initRankDistributionChart(rankData) {
    const chartDom = document.getElementById('rankDistributionChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: rankData.map(item => item.rank_group)
        },
        series: [
            {
                name: '排名分布',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: rankData.map(item => ({
                    value: item.keyword_count,
                    name: item.rank_group
                }))
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化搜索量分布图表
function initVolumeDistributionChart(volumeData) {
    const chartDom = document.getElementById('volumeDistributionChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = volumeData[params[0].dataIndex];
                return `${data.volume_group}<br/>关键词数: ${data.keyword_count}<br/>总搜索量: ${data.total_volume.toLocaleString()}`;
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
            data: volumeData.map(item => item.volume_group),
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '关键词数量'
        },
        series: [
            {
                name: '关键词数量',
                type: 'bar',
                data: volumeData.map(item => item.keyword_count),
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#5470C6', '#91CC75', '#FAC858', '#EE6666'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化流量贡献关键词图表
function initTopTrafficKeywordsChart(keywordsData) {
    const chartDom = document.getElementById('topTrafficKeywordsChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    // 只取前8个关键词，避免图表过于拥挤
    const displayData = keywordsData.slice(0, 8);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = displayData[params[0].dataIndex];
                return `${data.keyword}<br/>排名: ${data.position}<br/>流量: ${data.traffic.toLocaleString()}<br/>搜索量: ${data.search_volume.toLocaleString()}<br/>贡献占比: ${data.percentage}%`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: displayData.map(item => item.keyword),
            axisLabel: {
                interval: 0,
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '流量'
        },
        series: [
            {
                name: '流量贡献',
                type: 'bar',
                data: displayData.map(item => item.traffic),
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化关键词意图分布图表
function initIntentDistributionChart(intentData) {
    const chartDom = document.getElementById('keywordIntentChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            type: 'scroll'
        },
        series: [
            {
                name: '意图分布',
                type: 'pie',
                radius: '60%',
                data: intentData.map(item => ({
                    value: item.count,
                    name: item.intent
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
    window.addEventListener('resize', () => chart.resize());
}

// 初始化产品系列表现图表
function initProductPerformanceChart(productData) {
    const chartDom = document.getElementById('productPerformanceChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    // 按流量排序
    const sortedData = [...productData].sort((a, b) => b.total_traffic - a.total_traffic);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = sortedData[params[0].dataIndex];
                return `${data.series}<br/>关键词数: ${data.keyword_count}<br/>平均排名: ${data.avg_position}<br/>流量: ${data.total_traffic.toLocaleString()}<br/>搜索量: ${data.total_volume.toLocaleString()}`;
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: sortedData.map(item => item.series),
            axisLabel: {
                interval: 0,
                rotate: 45
            }
        },
        yAxis: {
            type: 'value',
            name: '流量'
        },
        series: [
            {
                name: '产品系列表现',
                type: 'bar',
                data: sortedData.map(item => item.total_traffic),
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化SERP特性分布图表
function initSerpFeaturesChart(featuresData) {
    const chartDom = document.getElementById('serpFeaturesChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    // 按数量排序，只取前10个
    const sortedData = [...featuresData].sort((a, b) => b.count - a.count).slice(0, 10);
    
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
            name: '出现次数'
        },
        yAxis: {
            type: 'category',
            data: sortedData.map(item => item.feature),
            axisLabel: {
                interval: 0
            }
        },
        series: [
            {
                name: 'SERP特性',
                type: 'bar',
                data: sortedData.map(item => item.count),
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE', '#3BA272', '#FC8452', '#9A60B4', '#60C0DD', '#D8BFD8'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化排名变化分析图表
function initRankChangesChart(rankChangesData) {
    const chartDom = document.getElementById('rankChangesChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'horizontal',
            top: 'bottom',
            data: rankChangesData.map(item => item.change)
        },
        series: [
            {
                name: '排名变化',
                type: 'pie',
                radius: '50%',
                data: rankChangesData.map(item => ({
                    value: item.keyword_count,
                    name: item.change
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                },
                itemStyle: {
                    color: function(params) {
                        // 上升-绿色，下降-红色，不变-蓝色
                        const colors = {
                            '排名上升': '#91CC75',
                            '排名下降': '#EE6666',
                            '排名不变': '#5470C6'
                        };
                        return colors[params.name] || '#73C0DE';
                    }
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化竞争度分析图表
function initCompetitionAnalysisChart(competitionData) {
    const chartDom = document.getElementById('competitionAnalysisChart');
    if (!chartDom) return;
    
    const chart = echarts.init(chartDom);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const data = competitionData[params[0].dataIndex];
                return `${data.level}<br/>关键词数: ${data.keyword_count}<br/>平均CPC: $${data.avg_cpc.toFixed(2)}`;
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
            data: competitionData.map(item => item.level),
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: {
            type: 'value',
            name: '关键词数量'
        },
        series: [
            {
                name: '关键词数量',
                type: 'bar',
                data: competitionData.map(item => item.keyword_count),
                itemStyle: {
                    color: function(params) {
                        const colorList = ['#EE6666', '#FAC858', '#91CC75', '#5470C6'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}'
                }
            }
        ]
    };
    
    chart.setOption(option);
    window.addEventListener('resize', () => chart.resize());
}

// 初始化关键词表格
function initKeywordsTable(keywordsData) {
    const tableBody = document.getElementById('keywordsTableBody');
    if (!tableBody) return;
    
    // 清空表格
    tableBody.innerHTML = '';
    
    // 添加关键词数据
    keywordsData.forEach(keyword => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${keyword.keyword}</td>
            <td>${keyword.position}</td>
            <td>${keyword.search_volume.toLocaleString()}</td>
            <td>${keyword.traffic.toLocaleString()}</td>
            <td>${keyword.percentage.toFixed(2)}%</td>
            <td>$${keyword.cpc.toFixed(2)}</td>
            <td>${keyword.competition.toFixed(2)}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // 初始化分页
    initPagination(keywordsData.length, 10);
    
    // 初始化搜索功能
    initSearch(keywordsData);
}

// 初始化分页
function initPagination(totalItems, itemsPerPage) {
    const pagination = document.getElementById('keywordsPagination');
    if (!pagination) return;
    
    // 清空分页
    pagination.innerHTML = '';
    
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    // 添加分页按钮
    if (totalPages <= 1) return;
    
    // 上一页按钮
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item disabled';
    prevLi.innerHTML = '<a class="page-link" href="#" tabindex="-1">上一页</a>';
    pagination.appendChild(prevLi);
    
    // 页码按钮
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = i === 1 ? 'page-item active' : 'page-item';
        li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // 下一页按钮
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item';
    nextLi.innerHTML = '<a class="page-link" href="#">下一页</a>';
    pagination.appendChild(nextLi);
}

// 初始化搜索功能
function initSearch(keywordsData) {
    const searchInput = document.getElementById('keywordSearch');
    const searchButton = document.getElementById('searchButton');
    if (!searchInput || !searchButton) return;
    
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        if (!searchTerm) {
            // 如果搜索词为空，显示所有关键词
            initKeywordsTable(keywordsData);
            return;
        }
        
        // 过滤匹配的关键词
        const filteredKeywords = keywordsData.filter(keyword => 
            keyword.keyword.toLowerCase().includes(searchTerm)
        );
        
        // 更新表格
        initKeywordsTable(filteredKeywords);
    });
    
    // 回车搜索
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
}
