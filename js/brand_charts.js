// Tribit品牌市场分析图表初始化脚本

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化图表...');
    
    // 初始化品牌表现图表
    initBrandPerformanceChart();
    
    // 初始化市场份额图表
    initMarketShareChart();
    
    // 初始化价格性能图表
    initPricePerformanceChart();
    
    // 初始化竞争策略图表
    initCompetitorStrategyChart();
    
    // 初始化内容类型表现图表
    initContentTypePerformanceChart();
    
    // 初始化转化漏斗图表
    initConversionFunnelChart();
    
    // 初始化漏斗策略图表
    initFunnelStrategyChart();
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        // 获取所有图表实例并调整大小
        const charts = document.querySelectorAll('[id$="-chart"]');
        charts.forEach(function(chartElement) {
            const chart = echarts.getInstanceByDom(chartElement);
            if (chart) {
                chart.resize();
            }
        });
    });
});

// 初始化品牌表现图表
function initBrandPerformanceChart() {
    const chartElement = document.getElementById('brand-performance-chart');
    if (!chartElement) {
        console.error('找不到品牌表现图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Tribit Performance Metrics (2022-2024)',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Sales Growth', 'Market Share', 'Brand Awareness', 'Customer Satisfaction'],
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023', 'Q3 2023', 'Q4 2023', 'Q1 2024', 'Q2 2024']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Sales Growth',
                type: 'line',
                data: [12, 15, 18, 22, 24, 28, 32, 35, 40, 45],
                lineStyle: {
                    width: 3,
                    color: '#1a237e'
                },
                symbol: 'circle',
                symbolSize: 8
            },
            {
                name: 'Market Share',
                type: 'line',
                data: [5.2, 5.5, 6.0, 6.2, 6.5, 7.0, 7.2, 7.5, 8.0, 8.2],
                lineStyle: {
                    width: 3,
                    color: '#0d47a1'
                },
                symbol: 'circle',
                symbolSize: 8
            },
            {
                name: 'Brand Awareness',
                type: 'line',
                data: [15, 18, 22, 25, 30, 35, 40, 45, 50, 55],
                lineStyle: {
                    width: 3,
                    color: '#2962ff'
                },
                symbol: 'circle',
                symbolSize: 8
            },
            {
                name: 'Customer Satisfaction',
                type: 'line',
                data: [85, 86, 87, 88, 88, 89, 90, 91, 92, 93],
                lineStyle: {
                    width: 3,
                    color: '#82b1ff'
                },
                symbol: 'circle',
                symbolSize: 8
            }
        ]
    };
    chart.setOption(option);
    console.log('品牌表现图表初始化完成');
}

// 初始化市场份额图表
function initMarketShareChart() {
    const chartElement = document.getElementById('market-share-chart');
    if (!chartElement) {
        console.error('找不到市场份额图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Amazon Audio Market Share',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c}% ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 10,
            data: ['Soundcore', 'TOZO', 'JBL', 'Bose', 'Sony', 'Tribit', 'Others']
        },
        series: [
            {
                name: 'Market Share',
                type: 'pie',
                radius: ['50%', '70%'],
                avoidLabelOverlap: false,
                emphasis: {
                    label: {
                        show: true,
                        fontSize: '16',
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: true
                },
                data: [
                    {value: 15, name: 'Soundcore'},
                    {value: 12, name: 'TOZO'},
                    {value: 18, name: 'JBL'},
                    {value: 10, name: 'Bose'},
                    {value: 8, name: 'Sony'},
                    {value: 8, name: 'Tribit', itemStyle: {color: '#1a237e'}},
                    {value: 29, name: 'Others'}
                ]
            }
        ]
    };
    chart.setOption(option);
    console.log('市场份额图表初始化完成');
}

// 初始化价格性能图表
function initPricePerformanceChart() {
    const chartElement = document.getElementById('price-performance-chart');
    if (!chartElement) {
        console.error('找不到价格性能图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Price vs. Performance Positioning',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: function(params) {
                return params.data[3] + '<br/>Price: $' + params.data[0] + 
                       '<br/>Performance Rating: ' + params.data[1] + 
                       '<br/>Review Score: ' + params.data[2];
            }
        },
        xAxis: {
            type: 'value',
            name: 'Price ($)',
            min: 0,
            max: 200
        },
        yAxis: {
            type: 'value',
            name: 'Performance Rating',
            min: 6,
            max: 10
        },
        series: [
            {
                type: 'scatter',
                symbolSize: function(data) {
                    return data[2] * 5; // Size based on review score
                },
                data: [
                    [49, 7.8, 4.6, 'Tribit XSound Go'],
                    [30, 7.2, 4.5, 'TOZO T6'],
                    [55, 8.0, 4.7, 'Soundcore Motion'],
                    [69, 8.2, 4.6, 'Srhythm NC25'],
                    [120, 8.7, 4.8, 'JBL Flip 6'],
                    [179, 9.1, 4.7, 'Bose SoundLink'],
                    [149, 8.9, 4.5, 'Sony LinkBuds'],
                    [40, 7.5, 4.4, 'Average Competitor']
                ],
                itemStyle: {
                    color: function(params) {
                        // 为Tribit产品使用特殊颜色
                        if(params.data[3].includes('Tribit')) {
                            return '#1a237e';
                        }
                        // 其他品牌使用不同颜色
                        const colors = ['#ff7043', '#29b6f6', '#66bb6a', '#ffa726', '#8d6e63', '#5c6bc0'];
                        return colors[params.dataIndex % colors.length];
                    }
                }
            }
        ]
    };
    chart.setOption(option);
    console.log('价格性能图表初始化完成');
}

// 初始化竞争策略图表
function initCompetitorStrategyChart() {
    const chartElement = document.getElementById('competitor-strategy-chart');
    if (!chartElement) {
        console.error('找不到竞争策略图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Competitor Strategy Analysis',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        radar: {
            indicator: [
                { name: 'Price Competitiveness', max: 100 },
                { name: 'Product Innovation', max: 100 },
                { name: 'Brand Recognition', max: 100 },
                { name: 'Marketing Spend', max: 100 },
                { name: 'Customer Service', max: 100 },
                { name: 'Distribution Channels', max: 100 }
            ]
        },
        series: [
            {
                type: 'radar',
                data: [
                    {
                        value: [90, 75, 60, 50, 85, 70],
                        name: 'Tribit',
                        areaStyle: {
                            color: 'rgba(26, 35, 126, 0.6)'
                        },
                        lineStyle: {
                            color: '#1a237e'
                        }
                    },
                    {
                        value: [70, 90, 95, 90, 80, 95],
                        name: 'Market Leaders',
                        areaStyle: {
                            color: 'rgba(244, 67, 54, 0.6)'
                        },
                        lineStyle: {
                            color: '#f44336'
                        }
                    }
                ]
            }
        ]
    };
    chart.setOption(option);
    console.log('竞争策略图表初始化完成');
}

// 初始化内容类型表现图表
function initContentTypePerformanceChart() {
    const chartElement = document.getElementById('content-type-performance-chart');
    if (!chartElement) {
        console.error('找不到内容类型表现图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Content Type Performance',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Engagement Rate', 'Conversion Rate'],
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Product Reviews', 'Unboxing', 'Tutorials', 'Comparisons', 'Lifestyle', 'Tech Tips']
        },
        yAxis: [
            {
                type: 'value',
                name: 'Engagement Rate',
                min: 0,
                max: 20,
                position: 'left',
                axisLabel: {
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                name: 'Conversion Rate',
                min: 0,
                max: 5,
                position: 'right',
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: 'Engagement Rate',
                type: 'bar',
                data: [12.5, 15.2, 8.7, 14.3, 10.8, 7.5],
                itemStyle: {
                    color: '#1a237e'
                }
            },
            {
                name: 'Conversion Rate',
                type: 'line',
                yAxisIndex: 1,
                data: [2.1, 3.4, 1.8, 2.7, 1.5, 1.2],
                lineStyle: {
                    color: '#f44336',
                    width: 3
                },
                symbol: 'circle',
                symbolSize: 8
            }
        ]
    };
    chart.setOption(option);
    console.log('内容类型表现图表初始化完成');
}

// 初始化转化漏斗图表
function initConversionFunnelChart() {
    const chartElement = document.getElementById('conversion-funnel-chart');
    if (!chartElement) {
        console.error('找不到转化漏斗图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Marketing Conversion Funnel',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b} : {c}%'
        },
        legend: {
            data: ['Show', 'Click', 'Visit', 'Inquiry', 'Order'],
            bottom: 10
        },
        series: [
            {
                name: 'Funnel',
                type: 'funnel',
                left: '10%',
                top: 60,
                bottom: 60,
                width: '80%',
                min: 0,
                max: 100,
                minSize: '0%',
                maxSize: '100%',
                sort: 'descending',
                gap: 2,
                label: {
                    show: true,
                    position: 'inside'
                },
                labelLine: {
                    length: 10,
                    lineStyle: {
                        width: 1,
                        type: 'solid'
                    }
                },
                itemStyle: {
                    borderColor: '#fff',
                    borderWidth: 1
                },
                emphasis: {
                    label: {
                        fontSize: 20
                    }
                },
                data: [
                    { value: 100, name: 'Show' },
                    { value: 40, name: 'Click' },
                    { value: 20, name: 'Visit' },
                    { value: 8, name: 'Inquiry' },
                    { value: 3, name: 'Order' }
                ]
            }
        ]
    };
    chart.setOption(option);
    console.log('转化漏斗图表初始化完成');
}

// 初始化漏斗策略图表
function initFunnelStrategyChart() {
    const chartElement = document.getElementById('funnel-strategy-chart');
    if (!chartElement) {
        console.error('找不到漏斗策略图表容器');
        return;
    }
    
    const chart = echarts.init(chartElement);
    const option = {
        title: {
            text: 'Conversion Improvement Strategy',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Current', 'Target'],
            bottom: 10
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Show→Click', 'Click→Visit', 'Visit→Inquiry', 'Inquiry→Order']
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: 'Current',
                type: 'bar',
                data: [40, 50, 40, 37.5],
                itemStyle: {
                    color: '#1a237e'
                }
            },
            {
                name: 'Target',
                type: 'bar',
                data: [45, 60, 50, 45],
                itemStyle: {
                    color: '#f44336'
                }
            }
        ]
    };
    chart.setOption(option);
    console.log('漏斗策略图表初始化完成');
}
