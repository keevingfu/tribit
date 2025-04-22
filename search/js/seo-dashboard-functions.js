// 初始化仪表板
function initDashboard(data) {
    // 更新概览数据
    updateOverview(data.overview);
    
    // 渲染各个图表
    renderRankDistributionChart(data.rank_distribution);
    renderVolumeDistributionChart(data.volume_distribution);
    renderTopTrafficKeywordsChart(data.top_traffic_keywords);
    renderKeywordIntentChart(data.intent_distribution);
    renderProductPerformanceChart(data.product_performance);
    renderSerpFeaturesChart(data.serp_features);
    renderRankChangesChart(data.rank_changes);
    renderCompetitionAnalysisChart(data.competition_analysis);
    
    // 初始化关键词表格
    initKeywordsTable(data.keywords_table);
}

// 更新概览数据
function updateOverview(overview) {
    document.getElementById('totalKeywords').textContent = overview.total_keywords.toLocaleString();
    document.getElementById('top10Keywords').textContent = overview.top10_keywords.toLocaleString();
    document.getElementById('totalSearchVolume').textContent = overview.total_search_volume.toLocaleString();
    document.getElementById('totalTraffic').textContent = overview.total_traffic.toLocaleString();
}

// 渲染关键词排名分布图
function renderRankDistributionChart(data) {
    const chart = echarts.init(document.getElementById('rankDistributionChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.map(item => item.rank_group)
        },
        series: [
            {
                name: '排名分布',
                type: 'pie',
                radius: ['50%', '70%'],
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
                    value: item.keyword_count,
                    name: item.rank_group
                }))
            }
        ],
        color: ['#52c41a', '#1890ff', '#faad14', '#f5222d']
    };
    
    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染搜索量分布图
function renderVolumeDistributionChart(data) {
    const chart = echarts.init(document.getElementById('volumeDistributionChart'));
    
    // 准备数据
    const volumeGroups = data.map(item => item.volume_group);
    const keywordCounts = data.map(item => item.keyword_count);
    const totalVolumes = data.map(item => item.total_volume);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                return `${volumeGroups[dataIndex]}<br/>
                        关键词数量: ${keywordCounts[dataIndex]}<br/>
                        总搜索量: ${totalVolumes[dataIndex].toLocaleString()}`;
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
            data: volumeGroups
        },
        yAxis: [
            {
                type: 'value',
                name: '关键词数量',
                position: 'left'
            },
            {
                type: 'value',
                name: '总搜索量',
                position: 'right',
                axisLabel: {
                    formatter: function(value) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        } else if (value >= 1000) {
                            return (value / 1000).toFixed(1) + 'K';
                        }
                        return value;
                    }
                }
            }
        ],
        series: [
            {
                name: '关键词数量',
                type: 'bar',
                data: keywordCounts,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '总搜索量',
                type: 'line',
                yAxisIndex: 1,
                data: totalVolumes,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#52c41a'
                },
                itemStyle: {
                    color: '#52c41a'
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

// 渲染流量贡献最大的关键词
function renderTopTrafficKeywordsChart(data) {
    const chart = echarts.init(document.getElementById('topTrafficKeywordsChart'));
    
    // 准备数据
    const keywords = data.map(item => item.keyword);
    const traffic = data.map(item => item.traffic);
    const percentages = data.map(item => item.percentage);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                return `${keywords[dataIndex]}<br/>
                        流量: ${traffic[dataIndex].toLocaleString()}<br/>
                        占比: ${percentages[dataIndex]}%<br/>
                        搜索量: ${data[dataIndex].search_volume.toLocaleString()}<br/>
                        排名: ${data[dataIndex].position}`;
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
            name: '流量'
        },
        yAxis: {
            type: 'category',
            data: keywords,
            axisLabel: {
                interval: 0,
                formatter: function(value) {
                    if (value.length > 15) {
                        return value.substring(0, 12) + '...';
                    }
                    return value;
                }
            }
        },
        series: [
            {
                name: '流量',
                type: 'bar',
                data: traffic,
                itemStyle: {
                    color: function(params) {
                        // 为排名第一的关键词使用特殊颜色
                        if (params.dataIndex === 0) {
                            return '#f5222d';
                        }
                        // 为其他关键词使用渐变色
                        return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                            { offset: 0, color: '#1890ff' },
                            { offset: 1, color: '#52c41a' }
                        ]);
                    }
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: function(params) {
                        return percentages[params.dataIndex] + '%';
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

// 渲染关键词意图分布图
function renderKeywordIntentChart(data) {
    const chart = echarts.init(document.getElementById('keywordIntentChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.map(item => item.intent)
        },
        series: [
            {
                name: '关键词意图',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: data.map(item => ({
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
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        chart.resize();
    });
}

// 渲染产品系列SEO表现图
function renderProductPerformanceChart(data) {
    const chart = echarts.init(document.getElementById('productPerformanceChart'));
    
    // 准备数据
    const series = data.map(item => item.series);
    const keywordCounts = data.map(item => item.keyword_count);
    const avgPositions = data.map(item => item.avg_position);
    const totalTraffic = data.map(item => item.total_traffic);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                return `${series[dataIndex]}<br/>
                        关键词数量: ${keywordCounts[dataIndex]}<br/>
                        平均排名: ${avgPositions[dataIndex].toFixed(1)}<br/>
                        总流量: ${totalTraffic[dataIndex].toFixed(1)}<br/>
                        总搜索量: ${data[dataIndex].total_volume.toLocaleString()}`;
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
            data: series,
            axisLabel: {
                interval: 0,
                rotate: 30
            }
        },
        yAxis: [
            {
                type: 'value',
                name: '流量',
                position: 'left'
            },
            {
                type: 'value',
                name: '平均排名',
                position: 'right',
                inverse: true,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: '流量',
                type: 'bar',
                data: totalTraffic,
                itemStyle: {
                    color: '#1890ff'
                }
            },
            {
                name: '平均排名',
                type: 'line',
                yAxisIndex: 1,
                data: avgPositions,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#faad14'
                },
                itemStyle: {
                    color: '#faad14'
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

// 渲染SERP特性分布图
function renderSerpFeaturesChart(data) {
    const chart = echarts.init(document.getElementById('serpFeaturesChart'));
    
    // 准备数据
    const features = data.map(item => item.feature);
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
            data: features,
            axisLabel: {
                interval: 0
            }
        },
        series: [
            {
                name: '出现次数',
                type: 'bar',
                data: counts,
                itemStyle: {
                    color: function(params) {
                        // 颜色渐变
                        const colorList = ['#1890ff', '#36cfc9', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#eb2f96', '#fa8c16', '#a0d911', '#13c2c2'];
                        return colorList[params.dataIndex % colorList.length];
                    }
                },
                label: {
                    show: true,
                    position: 'right'
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

// 渲染排名变化分析图
function renderRankChangesChart(data) {
    const chart = echarts.init(document.getElementById('rankChangesChart'));
    
    const option = {
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center',
            data: data.map(item => item.change)
        },
        series: [
            {
                name: '排名变化',
                type: 'pie',
                radius: '55%',
                center: ['40%', '50%'],
                data: data.map(item => ({
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
                        const colors = {
                            '排名上升': '#52c41a',
                            '排名下降': '#f5222d',
                            '排名不变': '#faad14'
                        };
                        return colors[params.name] || '#1890ff';
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

// 渲染竞争度分析图
function renderCompetitionAnalysisChart(data) {
    const chart = echarts.init(document.getElementById('competitionAnalysisChart'));
    
    // 准备数据
    const levels = data.map(item => item.level);
    const counts = data.map(item => item.keyword_count);
    const avgCpcs = data.map(item => item.avg_cpc);
    
    const option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function(params) {
                const dataIndex = params[0].dataIndex;
                return `${levels[dataIndex]}<br/>
                        关键词数量: ${counts[dataIndex]}<br/>
                        平均CPC: $${avgCpcs[dataIndex].toFixed(2)}`;
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
            data: levels
        },
        yAxis: [
            {
                type: 'value',
                name: '关键词数量',
                position: 'left'
            },
            {
                type: 'value',
                name: '平均CPC',
                position: 'right',
                axisLabel: {
                    formatter: '${value}'
                }
            }
        ],
        series: [
            {
                name: '关键词数量',
                type: 'bar',
                data: counts,
                itemStyle: {
                    color: function(params) {
                        const colors = ['#f5222d', '#faad14', '#52c41a', '#1890ff'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            },
            {
                name: '平均CPC',
                type: 'line',
                yAxisIndex: 1,
                data: avgCpcs,
                symbol: 'circle',
                symbolSize: 8,
                lineStyle: {
                    width: 3,
                    color: '#722ed1'
                },
                itemStyle: {
                    color: '#722ed1'
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

// 初始化关键词表格
function initKeywordsTable(data) {
    const tableBody = document.getElementById('keywordsTableBody');
    const pagination = document.getElementById('keywordsPagination');
    const searchInput = document.getElementById('keywordSearch');
    const searchButton = document.getElementById('searchButton');
    
    // 每页显示的行数
    const rowsPerPage = 10;
    // 当前页码
    let currentPage = 1;
    // 过滤后的数据
    let filteredData = [...data];
    
    // 渲染表格
    function renderTable() {
        tableBody.innerHTML = '';
        
        // 计算当前页的数据
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        const pageData = filteredData.slice(startIndex, endIndex);
        
        // 渲染表格行
        pageData.forEach(item => {
            const row = document.createElement('tr');
            
            // 关键词
            const keywordCell = document.createElement('td');
            keywordCell.textContent = item.keyword;
            row.appendChild(keywordCell);
            
            // 排名
            const positionCell = document.createElement('td');
            positionCell.textContent = item.position;
            row.appendChild(positionCell);
            
            // 搜索量
            const volumeCell = document.createElement('td');
            volumeCell.textContent = item.search_volume.toLocaleString();
            row.appendChild(volumeCell);
            
            // 流量
            const trafficCell = document.createElement('td');
            trafficCell.textContent = item.traffic.toLocaleString();
            row.appendChild(trafficCell);
            
            // 流量占比
            const percentageCell = document.createElement('td');
            percentageCell.textContent = item.percentage + '%';
            row.appendChild(percentageCell);
            
            // CPC
            const cpcCell = document.createElement('td');
            cpcCell.textContent = '$' + item.cpc.toFixed(2);
            row.appendChild(cpcCell);
            
            // 竞争度
            const competitionCell = document.createElement('td');
            competitionCell.textContent = item.competition.toFixed(2);
            
            // 添加竞争度颜色
            if (item.competition > 0.66) {
                competitionCell.classList.add('competition-high');
            } else if (item.competition >= 0.33) {
                competitionCell.classList.add('competition-medium');
            } else if (item.competition > 0) {
                competitionCell.classList.add('competition-low');
            } else {
                competitionCell.classList.add('competition-none');
            }
            
            row.appendChild(competitionCell);
            
            tableBody.appendChild(row);
        });
        
        // 更新分页
        updatePagination();
    }
    
    // 更新分页控件
    function updatePagination() {
        pagination.innerHTML = '';
        
        // 计算总页数
        const totalPages = Math.ceil(filteredData.length / rowsPerPage);
        
        // 上一页按钮
        const prevItem = document.createElement('li');
        prevItem.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
        const prevLink = document.createElement('a');
        prevLink.className = 'page-link';
        prevLink.href = '#';
        prevLink.textContent = '上一页';
        prevLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage > 1) {
                currentPage--;
                renderTable();
            }
        });
        prevItem.appendChild(prevLink);
        pagination.appendChild(prevItem);
        
        // 页码按钮
        const maxPageButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
        
        if (endPage - startPage + 1 < maxPageButtons) {
            startPage = Math.max(1, endPage - maxPageButtons + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = 'page-item' + (i === currentPage ? ' active' : '');
            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.addEventListener('click', function(e) {
                e.preventDefault();
                currentPage = i;
                renderTable();
            });
            pageItem.appendChild(pageLink);
            pagination.appendChild(pageItem);
        }
        
        // 下一页按钮
        const nextItem = document.createElement('li');
        nextItem.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
        const nextLink = document.createElement('a');
        nextLink.className = 'page-link';
        nextLink.href = '#';
        nextLink.textContent = '下一页';
        nextLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (currentPage < totalPages) {
                currentPage++;
                renderTable();
            }
        });
        nextItem.appendChild(nextLink);
        pagination.appendChild(nextItem);
    }
    
    // 搜索功能
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            filteredData = [...data];
        } else {
            filteredData = data.filter(item => 
                item.keyword.toLowerCase().includes(searchTerm)
            );
        }
        
        currentPage = 1;
        renderTable();
    });
    
    // 回车搜索
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            searchButton.click();
        }
    });
    
    // 初始渲染
    renderTable();
}
