// Tribit品牌市场分析图表初始化脚本

// 等待DOM加载完成
window.onload = function() {
    console.log('页面完全加载完成，开始初始化图表...');
    
    // 初始化品牌表现图表
    initBrandPerformanceChart();
    
    // 初始化市场份额图表
    initMarketShareChart();
    
    // 初始化价格性能图表
    initPricePerformanceChart();
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
        // 重新调整所有图表大小
        resizeAllCharts();
    });
};

// 调整所有图表大小
function resizeAllCharts() {
    const chartIds = [
        'brand-performance-chart',
        'market-share-chart',
        'price-performance-chart',
        'competitor-strategy-chart',
        'content-type-performance-chart',
        'conversion-funnel-chart',
        'funnel-strategy-chart'
    ];
    
    chartIds.forEach(function(id) {
        const chartDom = document.getElementById(id);
        if (chartDom) {
            const chart = echarts.getInstanceByDom(chartDom);
            if (chart) {
                chart.resize();
                console.log(`调整图表大小: ${id}`);
            }
        }
    });
}

// 初始化品牌表现图表
function initBrandPerformanceChart() {
    const chartDom = document.getElementById('brand-performance-chart');
    if (!chartDom) {
        console.error('找不到品牌表现图表容器');
        return;
    }
    
    console.log('初始化品牌表现图表...');
    const myChart = echarts.init(chartDom);
    
    const option = {
        title: {
            text: 'Tribit Performance Metrics (2022-2024)',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['Amazon Ranking', 'Annual Growth Rate (%)', 'Product Reviews (thousands)'],
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
            data: ['2022', '2023', '2024']
        },
        yAxis: [
            {
                type: 'value',
                name: 'Ranking',
                min: 0,
                max: 20,
                inverse: true,
                axisLabel: {
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                name: 'Others',
                min: 0,
                max: 50,
                axisLabel: {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: 'Amazon Ranking',
                type: 'line',
                yAxisIndex: 0,
                data: [15, 12, 10],
                lineStyle: {
                    width: 3,
                    color: '#1a237e'
                },
                symbol: 'circle',
                symbolSize: 8
            },
            {
                name: 'Annual Growth Rate (%)',
                type: 'line',
                yAxisIndex: 1,
                data: [15, 17, 20],
                lineStyle: {
                    width: 3,
                    color: '#388e3c'
                },
                symbol: 'circle',
                symbolSize: 8
            },
            {
                name: 'Product Reviews (thousands)',
                type: 'line',
                yAxisIndex: 1,
                data: [20, 26, 34],
                lineStyle: {
                    width: 3,
                    color: '#f9a825'
                },
                symbol: 'circle',
                symbolSize: 8
            }
        ]
    };
    
    myChart.setOption(option);
    console.log('品牌表现图表初始化完成');
}

// 初始化市场份额图表
function initMarketShareChart() {
    const chartDom = document.getElementById('market-share-chart');
    if (!chartDom) {
        console.error('找不到市场份额图表容器');
        return;
    }
    
    console.log('初始化市场份额图表...');
    const myChart = echarts.init(chartDom);
    
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
    
    myChart.setOption(option);
    console.log('市场份额图表初始化完成');
}

// 初始化价格性能图表
function initPricePerformanceChart() {
    const chartDom = document.getElementById('price-performance-chart');
    if (!chartDom) {
        console.error('找不到价格性能图表容器');
        return;
    }
    
    console.log('初始化价格性能图表...');
    const myChart = echarts.init(chartDom);
    
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
    
    myChart.setOption(option);
    console.log('价格性能图表初始化完成');
}
