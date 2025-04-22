// Tribit 搜索关键词分析仪表板脚本
document.addEventListener('DOMContentLoaded', function() {
    // 使用内嵌的静态数据，避免CORS问题
    const data = {
        "top_search_terms": [],
        "product_categories": [
            {
                "category": "Other",
                "count": 3401,
                "total_search_volume": 0,
                "avg_search_volume": 0.0
            }
        ],
        "competitor_analysis": {
            "raw_comparisons": [],
            "competitors": []
        },
        "keyword_modifiers": [
            {
                "type": "Unknown",
                "count": 3401
            }
        ],
        "product_model_analysis": [
            {
                "model": "Stormbox系列",
                "description": "便携式蓝牙音箱",
                "total_search_volume": 0,
                "variants": [
                    {"term": "tribit stormbox blast", "search_volume": 2900, "cpc": 1.04},
                    {"term": "tribit stormbox micro 2", "search_volume": 1300, "cpc": 0.94},
                    {"term": "tribit stormbox 2", "search_volume": 390, "cpc": 0.44}
                ]
            },
            {
                "model": "耳机系列",
                "description": "无线蓝牙耳机",
                "total_search_volume": 0,
                "variants": [
                    {"term": "tribit flybuds 3", "search_volume": 720, "cpc": 0.68},
                    {"term": "tribit earbuds", "search_volume": 12100, "cpc": 0.63},
                    {"term": "tribit headphones", "search_volume": 8100, "cpc": 0.36}
                ]
            },
            {
                "model": "XSound系列",
                "description": "便携音响",
                "total_search_volume": 0,
                "variants": [
                    {"term": "tribit xsound go", "search_volume": 1000, "cpc": 0.47},
                    {"term": "tribit xsound plus 2", "search_volume": 210, "cpc": 0.5},
                    {"term": "tribit xsound mega", "search_volume": 90, "cpc": 0.83}
                ]
            }
        ],
        "key_questions": [
            {"question": "how to connect tribit earbuds", "search_volume": 50},
            {"question": "how to pair tribit speaker", "search_volume": 50},
            {"question": "are tribit speakers good", "search_volume": 10},
            {"question": "how to reset tribit speaker", "search_volume": 20}
        ],
        "search_alphabet_distribution": [
            {"letter": "R", "count": 2264},
            {"letter": "A", "count": 834},
            {"letter": "N", "count": 160},
            {"letter": "Q", "count": 58},
            {"letter": "C", "count": 43},
            {"letter": "P", "count": 38},
            {"letter": "M", "count": 4}
        ],
        "regional_analysis": []
    };

    // 初始化仪表板
    initDashboard(data);
});

function initDashboard(data) {
    // 初始化各个图表和内容区域
    renderCategoryDistribution(data.product_categories);
    renderModifierDistribution(data.keyword_modifiers);
    renderTopSearchTerms(data.top_search_terms);
    renderSearchValueAnalysis(data.top_search_terms);
    renderProductModelAnalysis(data.product_model_analysis);
    renderCategoryAvgSearch(data.product_categories);
    renderProductSeriesDetails(data.product_model_analysis);
    renderCompetitorAnalysis(data.competitor_analysis);
    renderKeyQuestions(data.key_questions);
    renderQuestionCategories(data.key_questions);
    renderDetailsTable(data.top_search_terms);
}

// 渲染产品类别分布图表
function renderCategoryDistribution(categories) {
    const ctx = document.getElementById('categoryDistributionChart').getContext('2d');
    
    // 准备数据
    const labels = categories.map(item => item.category);
    const values = categories.map(item => item.total_search_volume);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)'
    ];
    
    // 创建图表
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '搜索量',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    // 生成洞察
    const totalSearchVolume = values.reduce((a, b) => a + b, 0);
    const topCategory = categories[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li>总搜索量为 <b>${totalSearchVolume}</b>，分布在 ${categories.length} 个主要产品类别中。</li>
            <li><b>${topCategory.category}</b> 类别占据最大份额，总搜索量为 ${topCategory.total_search_volume} (${Math.round((topCategory.total_search_volume / totalSearchVolume) * 100)}%)。</li>
            <li>每个类别的平均搜索词数量为 ${Math.round(categories.reduce((a, b) => a + b.count, 0) / categories.length)}。</li>
        </ul>
        <p>建议: 针对搜索量最大的类别 <b>${topCategory.category}</b> 优化产品页面和广告投放。</p>
    `;
    
    document.getElementById('categoryInsights').innerHTML = insights;
}

// 渲染搜索词修饰符分布图表
function renderModifierDistribution(modifiers) {
    const ctx = document.getElementById('modifierDistributionChart').getContext('2d');
    
    // 排除空白或undefined的修饰符类型
    const filteredModifiers = modifiers.filter(item => item.type && item.type.trim() !== '');
    
    // 准备数据
    const labels = filteredModifiers.map(item => item.type);
    const values = filteredModifiers.map(item => item.count);
    const backgroundColors = [
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(199, 199, 199, 0.7)'
    ];
    
    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '关键词数量',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: backgroundColors.map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // 生成洞察
    const totalCount = values.reduce((a, b) => a + b, 0);
    const topModifier = filteredModifiers[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li>共有 <b>${totalCount}</b> 个搜索词，分布在 ${filteredModifiers.length} 种不同的修饰符类型中。</li>
            <li><b>${topModifier.type}</b> 是最常见的修饰符类型，占比 ${Math.round((topModifier.count / totalCount) * 100)}%。</li>
        </ul>
        <p>建议: 优化针对 <b>${topModifier.type}</b> 类型的搜索结果，提高用户找到产品的机会。</p>
    `;
    
    document.getElementById('modifierInsights').innerHTML = insights;
}

// 渲染热门搜索词图表
function renderTopSearchTerms(terms) {
    const ctx = document.getElementById('topSearchTermsChart').getContext('2d');
    
    // 检查terms是否为空或未定义
    if (!terms || terms.length === 0) {
        document.getElementById('searchTermsInsights').innerHTML = '<p>没有可用的搜索词数据</p>';
        return;
    }
    
    // 取前10个热门搜索词
    const topTerms = terms.slice(0, 10);
    
    // 准备数据
    const labels = topTerms.map(item => truncateLabel(item.term, 20));
    const values = topTerms.map(item => item.search_volume);
    const backgroundColors = Array(topTerms.length).fill('rgba(54, 162, 235, 0.7)');
    
    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '搜索量',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            // 显示完整的标签文本
                            return topTerms[tooltipItems[0].dataIndex].term;
                        }
                    }
                }
            }
        }
    });
    
    // 生成洞察
    const topTerm = topTerms[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li>最热门的搜索词是 <b>"${topTerm.term}"</b>，搜索量为 ${topTerm.search_volume}。</li>
            <li>前10名搜索词中，${topTerms.filter(t => t.term.includes('earbuds')).length} 个与耳机相关，${topTerms.filter(t => t.term.includes('speaker') || t.term.includes('stormbox')).length} 个与扬声器相关。</li>
        </ul>
        <p>建议: 优化 <b>"${topTerm.term}"</b> 相关产品的可见度和搜索引擎排名。</p>
    `;
    
    document.getElementById('searchTermsInsights').innerHTML = insights;
}

// 渲染搜索词价值分析图表
function renderSearchValueAnalysis(terms) {
    const ctx = document.getElementById('searchValueChart').getContext('2d');
    
    // 检查terms是否为空或未定义
    if (!terms || terms.length === 0) {
        document.getElementById('valueInsights').innerHTML = '<p>没有可用的搜索词价值数据</p>';
        return;
    }
    
    // 计算搜索词价值 (搜索量 × CPC)
    const termsWithValue = terms
        .filter(term => term.search_volume > 0 && term.cpc > 0)
        .map(term => ({
            ...term,
            value: term.search_volume * term.cpc
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10);
    
    // 检查是否有满足条件的项
    if (termsWithValue.length === 0) {
        document.getElementById('valueInsights').innerHTML = '<p>没有足够的数据进行搜索词价值分析</p>';
        return;
    }
    
    // 准备数据
    const labels = termsWithValue.map(item => truncateLabel(item.term, 20));
    const values = termsWithValue.map(item => item.value);
    const backgroundColors = Array(termsWithValue.length).fill('rgba(255, 159, 64, 0.7)');
    
    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '价值分数',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(255, 159, 64, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return termsWithValue[tooltipItems[0].dataIndex].term;
                        },
                        label: function(context) {
                            const term = termsWithValue[context.dataIndex];
                            return [
                                `价值分数: ${term.value.toFixed(2)}`,
                                `搜索量: ${term.search_volume}`,
                                `CPC: $${term.cpc}`
                            ];
                        }
                    }
                }
            }
        }
    });
    
    // 生成洞察
    const topValueTerm = termsWithValue[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li>价值最高的搜索词是 <b>"${topValueTerm.term}"</b>，价值分数为 ${topValueTerm.value.toFixed(2)}。</li>
            <li>这是由于其高搜索量 (${topValueTerm.search_volume}) 和相对较高的每次点击成本 ($${topValueTerm.cpc})。</li>
        </ul>
        <p>建议: 优先考虑在价值分数最高的关键词上优化广告和SEO，以获得最佳投资回报率。</p>
    `;
    
    document.getElementById('valueInsights').innerHTML = insights;
}

// 渲染产品型号分析图表
function renderProductModelAnalysis(models) {
    const ctx = document.getElementById('productModelsChart').getContext('2d');
    
    // 准备数据
    const labels = models.map(item => item.model);
    const values = models.map(item => item.total_search_volume);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
    ];
    
    // 创建图表
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: '搜索量',
                data: values,
                backgroundColor: backgroundColors.slice(0, models.length),
                borderColor: backgroundColors.slice(0, models.length).map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
    
    // 生成洞察
    const totalSearchVolume = values.reduce((a, b) => a + b, 0);
    const topModel = models[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li><b>${topModel.model}</b> 系列是最受关注的产品型号，总搜索量为 ${topModel.total_search_volume}。</li>
            <li>这个系列占总产品搜索量的 ${Math.round((topModel.total_search_volume / totalSearchVolume) * 100)}%。</li>
        </ul>
        <p>建议: 进一步扩展和推广 <b>${topModel.model}</b> 系列产品，同时加强其他系列的曝光度。</p>
    `;
    
    document.getElementById('productModelInsights').innerHTML = insights;
}

// 渲染产品类别平均搜索量图表
function renderCategoryAvgSearch(categories) {
    const ctx = document.getElementById('categoryAvgSearchChart').getContext('2d');
    
    // 准备数据
    const labels = categories.map(item => item.category);
    const values = categories.map(item => item.avg_search_volume);
    const backgroundColors = [
        'rgba(75, 192, 192, 0.7)',
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)'
    ];
    
    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '平均搜索量',
                data: values,
                backgroundColor: backgroundColors.slice(0, categories.length),
                borderColor: backgroundColors.slice(0, categories.length).map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // 生成洞察
    // 按平均搜索量排序
    const sortedCategories = [...categories].sort((a, b) => b.avg_search_volume - a.avg_search_volume);
    const topAvgCategory = sortedCategories[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li><b>${topAvgCategory.category}</b> 类别的搜索词平均搜索量最高，达到 ${topAvgCategory.avg_search_volume.toFixed(2)}。</li>
            <li>这表明虽然某些类别的搜索词总数可能较少，但每个搜索词的平均搜索量可能更高。</li>
        </ul>
        <p>建议: 对 <b>${topAvgCategory.category}</b> 类别的产品进行重点优化，因为每个搜索词的平均流量较高。</p>
    `;
    
    document.getElementById('categoryAvgInsights').innerHTML = insights;
}

// 渲染产品系列详细分析
function renderProductSeriesDetails(models) {
    const container = document.getElementById('productSeriesDetails');
    
    // 按总搜索量排序
    const sortedModels = [...models].sort((a, b) => b.total_search_volume - a.total_search_volume);
    
    let html = '<div class="row">';
    
    for (const model of sortedModels) {
        html += `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        ${model.model} 系列 (${model.description})
                    </div>
                    <div class="card-body">
                        <p><strong>总搜索量:</strong> ${model.total_search_volume}</p>
                        <h6>热门变体:</h6>
                        <table class="table table-sm">
                            <thead>
                                <tr>
                                    <th>搜索词</th>
                                    <th>搜索量</th>
                                    <th>CPC</th>
                                </tr>
                            </thead>
                            <tbody>
        `;
        
        for (const variant of model.variants) {
            html += `
                <tr>
                    <td>${variant.term}</td>
                    <td>${variant.search_volume}</td>
                    <td>${variant.cpc}</td>
                </tr>
            `;
        }
        
        html += `
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }
    
    html += '</div>';
    container.innerHTML = html;
}

// 渲染竞争对手分析图表
function renderCompetitorAnalysis(data) {
    const ctx = document.getElementById('competitorsChart').getContext('2d');
    
    // 获取竞争对手数据
    const competitors = data.competitors || [];
    
    // 准备数据
    const labels = competitors.map(item => item.competitor);
    const values = competitors.map(item => item.search_volume);
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)',
        'rgba(255, 159, 64, 0.7)',
        'rgba(201, 203, 207, 0.7)'
    ];
    
    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '比较搜索量',
                data: values,
                backgroundColor: backgroundColors.slice(0, competitors.length),
                borderColor: backgroundColors.slice(0, competitors.length).map(color => color.replace('0.7', '1')),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
    
    // 生成洞察
    let insights = '';
    
    if (competitors.length > 0) {
        const topCompetitor = competitors[0];
        
        insights = `
            <h5>洞察分析:</h5>
            <ul>
                <li>在与Tribit的比较搜索中，<b>${topCompetitor.competitor}</b> 是最常被比较的竞争对手，搜索量为 ${topCompetitor.search_volume}。</li>
                <li>前 ${Math.min(3, competitors.length)} 名竞争对手占据了大部分比较搜索量。</li>
            </ul>
            <p>建议: 重点关注与主要竞争对手 <b>${topCompetitor.competitor}</b> 的差异化营销，突出Tribit的独特优势。</p>
        `;
    } else {
        insights = `<p>没有足够的竞争对手比较数据进行分析。</p>`;
    }
    
    document.getElementById('competitorInsights').innerHTML = insights;
    
    // 渲染比较搜索词列表
    const comparisonTerms = data.raw_comparisons || [];
    const termsContainer = document.getElementById('competitorComparisonTerms');
    
    if (comparisonTerms.length > 0) {
        let html = `
            <table class="table table-sm">
                <thead>
                    <tr>
                        <th>比较搜索词</th>
                        <th>搜索量</th>
                        <th>CPC</th>
                    </tr>
                </thead>
                <tbody>
        `;
        
        for (const term of comparisonTerms) {
            html += `
                <tr>
                    <td>${term.term}</td>
                    <td>${term.search_volume}</td>
                    <td>${term.cpc}</td>
                </tr>
            `;
        }
        
        html += `
                </tbody>
            </table>
        `;
        
        termsContainer.innerHTML = html;
    } else {
        termsContainer.innerHTML = `<p>没有可用的比较搜索词数据。</p>`;
    }
}

// 渲染热门用户问题图表
function renderKeyQuestions(questions) {
    const ctx = document.getElementById('questionsChart').getContext('2d');
    
    // 取前8个热门问题
    const topQuestions = questions.slice(0, 8);
    
    // 准备数据
    const labels = topQuestions.map(item => truncateLabel(item.question, 25));
    const values = topQuestions.map(item => item.search_volume);
    const backgroundColors = Array(topQuestions.length).fill('rgba(153, 102, 255, 0.7)');
    
    // 创建图表
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '搜索量',
                data: values,
                backgroundColor: backgroundColors,
                borderColor: 'rgba(153, 102, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return topQuestions[tooltipItems[0].dataIndex].question;
                        }
                    }
                }
            }
        }
    });
    
    // 对问题进行分类分析
    const questionCategories = {
        'how-to': {
            pattern: /how to|如何/i,
            count: 0,
            examples: []
        },
        'comparison': {
            pattern: /vs|versus|compared to|比较/i,
            count: 0,
            examples: []
        },
        'troubleshooting': {
            pattern: /not working|problem|issue|故障|问题/i,
            count: 0,
            examples: []
        },
        'features': {
            pattern: /can|support|feature|功能|支持/i,
            count: 0,
            examples: []
        }
    };
    
    // 分类问题
    for (const question of questions) {
        for (const [category, info] of Object.entries(questionCategories)) {
            if (info.pattern.test(question.question)) {
                info.count++;
                if (info.examples.length < 3) {
                    info.examples.push(question.question);
                }
            }
        }
    }
    
    // 生成洞察
    const topQuestion = topQuestions[0];
    const totalQuestions = questions.length;
    const mostCommonCategory = Object.entries(questionCategories)
        .sort((a, b) => b[1].count - a[1].count)[0];
    
    let insights = `
        <h5>洞察分析:</h5>
        <ul>
            <li>用户最常搜索的问题是 <b>"${topQuestion.question}"</b>，搜索量为 ${topQuestion.search_volume}。</li>
            <li><b>${mostCommonCategory[0]}</b> 类型的问题最常见，占比约 ${Math.round((mostCommonCategory[1].count / totalQuestions) * 100)}%。</li>
        </ul>
        <p>建议: 创建针对最常见问题的FAQ页面和指南，特别是关于 <b>"${topQuestion.question}"</b> 的详细解答。</p>
    `;
    
    document.getElementById('questionInsights').innerHTML = insights;
    
    // 渲染问题类型分析
    renderQuestionCategories(questions);
}

// 渲染问题类型分析
function renderQuestionCategories(questions) {
    const container = document.getElementById('questionCategories');
    
    // 对问题进行分类分析
    const questionCategories = {
        '如何使用': {
            pattern: /how to|connect|pair|使用|连接|配对/i,
            count: 0,
            examples: []
        },
        '产品比较': {
            pattern: /vs|versus|compared to|better than|比较|哪个好/i,
            count: 0,
            examples: []
        },
        '故障排除': {
            pattern: /not working|problem|issue|reset|charging|故障|问题|重置|充电/i,
            count: 0,
            examples: []
        },
        '产品特性': {
            pattern: /can|support|feature|waterproof|battery|功能|支持|防水|电池/i,
            count: 0,
            examples: []
        }
    };
    
    // 分类问题
    for (const question of questions) {
        for (const [category, info] of Object.entries(questionCategories)) {
            if (info.pattern.test(question.question)) {
                info.count++;
                if (info.examples.length < 3) {
                    info.examples.push(question.question);
                }
            }
        }
    }
    
    // 生成HTML
    let html = '';
    
    for (const [category, info] of Object.entries(questionCategories)) {
        html += `
            <div class="col-md-6 mb-4">
                <div class="card">
                    <div class="card-header">
                        ${category} (${info.count})
                    </div>
                    <div class="card-body">
                        <h6>示例问题:</h6>
                        <ul>
        `;
        
        for (const example of info.examples) {
            html += `<li>${example}</li>`;
        }
        
        if (info.examples.length === 0) {
            html += `<li>没有找到此类问题</li>`;
        }
        
        html += `
                        </ul>
                        <p><strong>建议:</strong> ${getCategoryRecommendation(category)}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    container.innerHTML = html;
}

// 获取问题类别的建议
function getCategoryRecommendation(category) {
    switch (category) {
        case '如何使用':
            return '创建详细的使用教程视频和图文指南，重点关注连接和配对步骤。';
        case '产品比较':
            return '制作与主要竞争对手的对比表，突出Tribit产品的优势。';
        case '故障排除':
            return '建立故障排除专区，提供常见问题的解决方案和视频演示。';
        case '产品特性':
            return '在产品页面突出展示用户关注的功能特性，如防水性能、电池续航等。';
        default:
            return '针对用户问题创建详细的帮助文档和FAQ。';
    }
}

// 渲染详细数据表格
function renderDetailsTable(terms) {
    const container = document.getElementById('detailsTable').getElementsByTagName('tbody')[0];
    
    // 清空现有内容
    container.innerHTML = '';
    
    // 如果没有数据，显示提示信息
    if (!terms || terms.length === 0) {
        container.innerHTML = '<tr><td colspan="5" class="text-center">没有可用的数据</td></tr>';
        return;
    }
    
    // 为每个搜索词创建一行
    for (const term of terms) {
        // 确定搜索词分类
        let category = '其他';
        if (term.term.includes('earbuds') || term.term.includes('headphones') || term.term.includes('quietplus')) {
            category = '耳机';
        } else if (term.term.includes('speaker') || term.term.includes('stormbox') || term.term.includes('xsound')) {
            category = '扬声器';
        }
        
        const row = `
            <tr>
                <td>${term.term}</td>
                <td>${term.search_volume}</td>
                <td>${term.cpc}</td>
                <td>${term.modifier_type || '未知'}</td>
                <td>${category}</td>
            </tr>
        `;
        
        container.innerHTML += row;
    }
}

// 辅助函数：截断标签文本
function truncateLabel(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}
