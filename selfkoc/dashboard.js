// Global Variables
let platformOverviewData;
let instagramAccountsData;
let tiktokAccountsData;
let youtubeAccountsData;
let instagramTrendsData;
let tiktokTrendsData;
let youtubeTrendsData;
let instagramTopContentData;
let tiktokTopContentData;
let youtubeTopContentData;
let engagementRatesData;

// Format Numbers
function formatNumber(num) {
    if (num === null || num === undefined) return '0';
    
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    } else {
        return num.toString();
    }
}

// 加载所有数据
function loadAllData() {
    // Create dashboard_data directory
    $.ajax({
        url: 'dashboard_data/platform_overview.json',
        dataType: 'json',
        success: function(data) {
            platformOverviewData = data;
            updatePlatformStats();
            renderPlatformComparisonChart('views');
        },
        error: function() {
            console.error('Failed to load platform overview data');
            // If data loading fails, try to run Python script to generate data
            generateDashboardData();
        }
    });

    $.ajax({
        url: 'dashboard_data/instagram_accounts.json',
        dataType: 'json',
        success: function(data) {
            instagramAccountsData = data;
            renderInstagramAccountsTable();
        },
        error: function() {
            console.error('Failed to load Instagram accounts data');
        }
    });

    $.ajax({
        url: 'dashboard_data/tiktok_accounts.json',
        dataType: 'json',
        success: function(data) {
            tiktokAccountsData = data;
            renderTiktokAccountsTable();
        },
        error: function() {
            console.error('Failed to load TikTok accounts data');
        }
    });

    $.ajax({
        url: 'dashboard_data/youtube_accounts.json',
        dataType: 'json',
        success: function(data) {
            youtubeAccountsData = data;
            renderYoutubeAccountsTable();
        },
        error: function() {
            console.error('Failed to load YouTube accounts data');
        }
    });

    $.ajax({
        url: 'dashboard_data/instagram_trends.json',
        dataType: 'json',
        success: function(data) {
            instagramTrendsData = data;
            checkAndRenderMonthlyTrendChart();
        },
        error: function() {
            console.error('Failed to load Instagram trends data');
        }
    });

    $.ajax({
        url: 'dashboard_data/tiktok_trends.json',
        dataType: 'json',
        success: function(data) {
            tiktokTrendsData = data;
            checkAndRenderMonthlyTrendChart();
        },
        error: function() {
            console.error('Failed to load TikTok trends data');
        }
    });

    $.ajax({
        url: 'dashboard_data/youtube_trends.json',
        dataType: 'json',
        success: function(data) {
            youtubeTrendsData = data;
            checkAndRenderMonthlyTrendChart();
        },
        error: function() {
            console.error('Failed to load YouTube trends data');
        }
    });

    $.ajax({
        url: 'dashboard_data/instagram_top_content.json',
        dataType: 'json',
        success: function(data) {
            instagramTopContentData = data;
            renderInstagramTopContent();
        },
        error: function() {
            console.error('Failed to load Instagram top content data');
        }
    });

    $.ajax({
        url: 'dashboard_data/tiktok_top_content.json',
        dataType: 'json',
        success: function(data) {
            tiktokTopContentData = data;
            renderTiktokTopContent();
        },
        error: function() {
            console.error('Failed to load TikTok top content data');
        }
    });

    $.ajax({
        url: 'dashboard_data/youtube_top_content.json',
        dataType: 'json',
        success: function(data) {
            youtubeTopContentData = data;
            renderYoutubeTopContent();
        },
        error: function() {
            console.error('Failed to load YouTube top content data');
        }
    });

    $.ajax({
        url: 'dashboard_data/engagement_rates.json',
        dataType: 'json',
        success: function(data) {
            engagementRatesData = data;
            renderEngagementRateChart();
        },
        error: function() {
            console.error('Failed to load engagement rates data');
        }
    });
}

// Generate Dashboard Data
function generateDashboardData() {
    console.log('Generating dashboard data...');
    
    // Create an alert to inform user that data is being generated
    alert('Generating dashboard data, please wait...');
    
    // Check if data files exist
    $.ajax({
        url: 'dashboard_data/platform_overview.json',
        type: 'HEAD',
        success: function() {
            // If file exists, reload all data
            loadAllData();
        },
        error: function() {
            // If file doesn't exist, prompt user to manually run Python script
            alert('Please run the following command in terminal to generate data:\n\ncd /Users/cavin/Desktop/tribit/selfkoc && python3 generate_dashboard_data.py');
        }
    });
}

// Update Platform Statistics
function updatePlatformStats() {
    if (!platformOverviewData) return;

    // Instagram Statistics
    let instagramHtml = `
        <div class="stats-number">${formatNumber(platformOverviewData.views[0])}</div>
        <div class="stats-label">Total Views</div>
        <div class="row mt-2">
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.accounts[0])}</div>
                <div class="stats-label">Account Count</div>
            </div>
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.posts[0])}</div>
                <div class="stats-label">Content Count</div>
            </div>
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.likes[0])}</div>
                <div class="stats-label">Total Likes</div>
            </div>
        </div>
    `;
    $('#instagramStats').html(instagramHtml);

    // TikTok Statistics
    let tiktokHtml = `
        <div class="stats-number">${formatNumber(platformOverviewData.views[1])}</div>
        <div class="stats-label">Total Views</div>
        <div class="row mt-2">
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.accounts[1])}</div>
                <div class="stats-label">Account Count</div>
            </div>
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.posts[1])}</div>
                <div class="stats-label">Content Count</div>
            </div>
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.likes[1])}</div>
                <div class="stats-label">Total Likes</div>
            </div>
        </div>
    `;
    $('#tiktokStats').html(tiktokHtml);

    // YouTube Statistics
    let youtubeHtml = `
        <div class="stats-number">${formatNumber(platformOverviewData.views[2])}</div>
        <div class="stats-label">Total Views</div>
        <div class="row mt-2">
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.accounts[2])}</div>
                <div class="stats-label">Account Count</div>
            </div>
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.posts[2])}</div>
                <div class="stats-label">Content Count</div>
            </div>
            <div class="col-4">
                <div class="stats-number">${formatNumber(platformOverviewData.likes[2])}</div>
                <div class="stats-label">Total Likes</div>
            </div>
        </div>
    `;
    $('#youtubeStats').html(youtubeHtml);
}

// Render Platform Comparison Chart
function renderPlatformComparisonChart(metric) {
    if (!platformOverviewData) return;

    let chartDom = document.getElementById('platformComparisonChart');
    let myChart = echarts.init(chartDom);
    let option;

    let data;
    let title;
    
    switch(metric) {
        case 'views':
            data = platformOverviewData.views;
            title = 'Platform Views Comparison';
            break;
        case 'likes':
            data = platformOverviewData.likes;
            title = 'Platform Likes Comparison';
            break;
        case 'comments':
            data = platformOverviewData.comments;
            title = 'Platform Comments Comparison';
            break;
        case 'posts':
            data = platformOverviewData.posts;
            title = 'Platform Content Count Comparison';
            break;
        default:
            data = platformOverviewData.views;
            title = 'Platform Views Comparison';
    }

    option = {
        title: {
            text: title,
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return params[0].name + ': ' + formatNumber(params[0].value);
            }
        },
        xAxis: {
            type: 'category',
            data: platformOverviewData.platforms
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    return formatNumber(value);
                }
            }
        },
        series: [
            {
                data: data,
                type: 'bar',
                itemStyle: {
                    color: function(params) {
                        let colorList = ['#FD1D1D', '#69C9D0', '#FF0000'];
                        return colorList[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        return formatNumber(params.value);
                    }
                }
            }
        ]
    };

    option && myChart.setOption(option);
    
    // Respond to window size changes
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Render Engagement Rate Chart
function renderEngagementRateChart() {
    if (!engagementRatesData) return;

    let chartDom = document.getElementById('engagementRateChart');
    let myChart = echarts.init(chartDom);
    let option;

    option = {
        title: {
            text: 'Platform Engagement Rate Comparison (Interactions per 1000 Views)',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                return params[0].name + ': ' + params[0].value.toFixed(2);
            }
        },
        xAxis: {
            type: 'category',
            data: engagementRatesData.platforms
        },
        yAxis: {
            type: 'value',
            name: 'Engagement Rate',
            axisLabel: {
                formatter: '{value}'
            }
        },
        series: [
            {
                data: engagementRatesData.engagement_rates,
                type: 'bar',
                itemStyle: {
                    color: function(params) {
                        let colorList = ['#FD1D1D', '#69C9D0', '#FF0000'];
                        return colorList[params.dataIndex];
                    }
                },
                label: {
                    show: true,
                    position: 'top',
                    formatter: function(params) {
                        return params.value.toFixed(2);
                    }
                }
            }
        ]
    };

    option && myChart.setOption(option);
    
    // Respond to window size changes
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Check and Render Monthly Trend Chart
function checkAndRenderMonthlyTrendChart() {
    if (instagramTrendsData && tiktokTrendsData && youtubeTrendsData) {
        renderMonthlyTrendChart('all');
    }
}

// Render Monthly Trend Chart
function renderMonthlyTrendChart(platform) {
    if (!instagramTrendsData || !tiktokTrendsData || !youtubeTrendsData) return;

    let chartDom = document.getElementById('monthlyTrendChart');
    let myChart = echarts.init(chartDom);
    let option;

    // Get all months
    let allMonths = new Set();
    instagramTrendsData.forEach(item => allMonths.add(item.month));
    tiktokTrendsData.forEach(item => allMonths.add(item.month));
    youtubeTrendsData.forEach(item => allMonths.add(item.month));
    
    let months = Array.from(allMonths).sort();

    // Prepare data
    let instagramViews = [];
    let tiktokViews = [];
    let youtubeViews = [];
    
    months.forEach(month => {
        let instagramData = instagramTrendsData.find(item => item.month === month);
        let tiktokData = tiktokTrendsData.find(item => item.month === month);
        let youtubeData = youtubeTrendsData.find(item => item.month === month);
        
        instagramViews.push(instagramData ? instagramData.total_views : 0);
        tiktokViews.push(tiktokData ? tiktokData.total_views : 0);
        youtubeViews.push(youtubeData ? youtubeData.total_views : 0);
    });

    // Configure chart
    let series = [];
    
    if (platform === 'all' || platform === 'instagram') {
        series.push({
            name: 'Instagram',
            data: instagramViews,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
                width: 3
            },
            itemStyle: {
                color: '#FD1D1D'
            }
        });
    }
    
    if (platform === 'all' || platform === 'tiktok') {
        series.push({
            name: 'TikTok',
            data: tiktokViews,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
                width: 3
            },
            itemStyle: {
                color: '#69C9D0'
            }
        });
    }
    
    if (platform === 'all' || platform === 'youtube') {
        series.push({
            name: 'YouTube',
            data: youtubeViews,
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
                width: 3
            },
            itemStyle: {
                color: '#FF0000'
            }
        });
    }

    option = {
        title: {
            text: 'Monthly Views Trend',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            formatter: function(params) {
                let result = params[0].name + '<br/>';
                params.forEach(param => {
                    result += param.marker + ' ' + param.seriesName + ': ' + formatNumber(param.value) + '<br/>';
                });
                return result;
            }
        },
        legend: {
            data: series.map(item => item.name),
            bottom: 0
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: months
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function(value) {
                    return formatNumber(value);
                }
            }
        },
        series: series
    };

    option && myChart.setOption(option);
    
    // Respond to window size changes
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Render Instagram Accounts Table
function renderInstagramAccountsTable() {
    if (!instagramAccountsData) return;

    let tableHtml = '';
    
    instagramAccountsData.forEach(account => {
        tableHtml += `
            <tr>
                <td>${account.influencer || '-'}</td>
                <td>${account.post_count || 0}</td>
                <td>${formatNumber(account.total_views || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_views || 0))}</td>
                <td>${formatNumber(account.total_likes || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_likes || 0))}</td>
                <td>${formatNumber(account.total_comments || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_comments || 0))}</td>
            </tr>
        `;
    });
    
    $('#instagramAccountsTable').html(tableHtml);
}

// Render TikTok Accounts Table
function renderTiktokAccountsTable() {
    if (!tiktokAccountsData) return;

    let tableHtml = '';
    
    tiktokAccountsData.forEach(account => {
        tableHtml += `
            <tr>
                <td>${account.influencer || '-'}</td>
                <td>${account.post_count || 0}</td>
                <td>${formatNumber(account.total_views || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_views || 0))}</td>
                <td>${formatNumber(account.total_likes || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_likes || 0))}</td>
                <td>${formatNumber(account.total_comments || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_comments || 0))}</td>
                <td>${formatNumber(account.total_shares || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_shares || 0))}</td>
            </tr>
        `;
    });
    
    $('#tiktokAccountsTable').html(tableHtml);
}

// Render YouTube Accounts Table
function renderYoutubeAccountsTable() {
    if (!youtubeAccountsData) return;

    let tableHtml = '';
    
    youtubeAccountsData.forEach(account => {
        tableHtml += `
            <tr>
                <td>${account.influencer || '-'}</td>
                <td>${account.post_count || 0}</td>
                <td>${formatNumber(account.total_views || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_views || 0))}</td>
                <td>${formatNumber(account.total_likes || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_likes || 0))}</td>
                <td>${formatNumber(account.total_comments || 0)}</td>
                <td>${formatNumber(Math.round(account.avg_comments || 0))}</td>
            </tr>
        `;
    });
    
    $('#youtubeAccountsTable').html(tableHtml);
}

// Render Instagram Top Content
function renderInstagramTopContent() {
    if (!instagramTopContentData) return;

    let contentHtml = '';
    
    instagramTopContentData.forEach((content, index) => {
        // 从post_url中提取视频ID
        const videoId = content.post_url.split('/reel/')[1]?.split('/')[0] || '';
        
        contentHtml += `
            <div class="top-content-item">
                <div class="d-flex align-items-center mb-2">
                    <span class="platform-badge instagram">Instagram</span>
                    <span class="ms-2">${content.influencer || '-'}</span>
                    <span class="ms-auto">${content.post_date || '-'}</span>
                </div>
                <div class="content-url">
                    <a href="${content.post_url}" target="_blank">${content.post_url}</a>
                </div>
                <div class="content-metrics">
                    <span><i class="bi bi-eye"></i> ${formatNumber(content.views ? content.views.replace(/,/g, '') : 0)} Views</span>
                    <span><i class="bi bi-heart"></i> ${formatNumber(content.likes || 0)} Likes</span>
                    <span><i class="bi bi-chat"></i> ${formatNumber(content.comments || 0)} Comments</span>
                </div>
                <div class="video-preview mt-3">
                    <iframe class="instagram-embed" src="https://www.instagram.com/p/${videoId}/embed/" frameborder="0" scrolling="no" allowtransparency="true"></iframe>
                </div>
            </div>
        `;
    });
    
    $('#instagramTopContent').html(contentHtml);
}

// Render TikTok Top Content
function renderTiktokTopContent() {
    if (!tiktokTopContentData) return;

    let contentHtml = '';
    
    tiktokTopContentData.forEach((content, index) => {
        contentHtml += `
            <div class="top-content-item">
                <div class="d-flex align-items-center mb-2">
                    <span class="platform-badge tiktok">TikTok</span>
                    <span class="ms-2">${content.influencer || '-'}</span>
                    <span class="ms-auto">${content.post_date || '-'}</span>
                </div>
                <div class="content-url">
                    <a href="${content.post_url}" target="_blank">${content.post_url}</a>
                </div>
                <div class="content-metrics">
                    <span><i class="bi bi-eye"></i> ${formatNumber(content.views || 0)} Views</span>
                    <span><i class="bi bi-heart"></i> ${formatNumber(content.likes || 0)} Likes</span>
                    <span><i class="bi bi-chat"></i> ${formatNumber(content.comments || 0)} Comments</span>
                    <span><i class="bi bi-share"></i> ${formatNumber(content.shares || 0)} Shares</span>
                </div>
                <div class="video-preview mt-3">
                    <iframe src="https://www.tiktok.com/embed/v2/${content.post_url.split('/video/')[1]?.split('?')[0]}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
    });
    
    $('#tiktokTopContent').html(contentHtml);

    // 动态加载TikTok嵌入脚本
    if (!window.tiktokScriptLoaded) {
        window.tiktokScriptLoaded = true;
        const script = document.createElement('script');
        script.src = 'https://www.tiktok.com/embed.js';
        script.async = true;
        document.body.appendChild(script);
    }
}

// Render YouTube Top Content
function renderYoutubeTopContent() {
    if (!youtubeTopContentData) return;

    let contentHtml = '';
    
    youtubeTopContentData.forEach((content, index) => {
        // 从post_url中提取视频ID
        const videoId = content.post_url.includes('/shorts/') 
            ? content.post_url.split('/shorts/')[1]?.split('?')[0] 
            : content.post_url.split('v=')[1]?.split('&')[0] || '';
        
        contentHtml += `
            <div class="top-content-item">
                <div class="d-flex align-items-center mb-2">
                    <span class="platform-badge youtube">YouTube</span>
                    <span class="ms-2">${content.influencer || '-'}</span>
                    <span class="ms-auto">${content.post_date || '-'}</span>
                </div>
                <div class="content-url">
                    <a href="${content.post_url}" target="_blank">${content.post_url}</a>
                </div>
                <div class="content-metrics">
                    <span><i class="bi bi-eye"></i> ${formatNumber(content.views || 0)} Views</span>
                    <span><i class="bi bi-heart"></i> ${formatNumber(content.likes || 0)} Likes</span>
                    <span><i class="bi bi-chat"></i> ${formatNumber(content.comments || 0)} Comments</span>
                </div>
                <div class="video-preview mt-3">
                    <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            </div>
        `;
    });
    
    $('#youtubeTopContent').html(contentHtml);
}

// Execute after page loads
$(document).ready(function() {
    // 加载所有数据
    loadAllData();
    
    // Platform comparison chart switching
    $('.card-header .btn-group button[data-metric]').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        renderPlatformComparisonChart($(this).data('metric'));
    });
    
    // Monthly trend chart switching
    $('.card-header .btn-group button[data-platform]').click(function() {
        $(this).siblings().removeClass('active');
        $(this).addClass('active');
        renderMonthlyTrendChart($(this).data('platform'));
    });
    
    // Refresh data button
    $('#refreshData').click(function() {
        generateDashboardData();
    });
});
