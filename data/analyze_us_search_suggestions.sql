-- Tribit搜索建议数据分析SQL脚本
-- 专门分析tribit-en-us-suggestions-24-02-2025 (1).csv中的数据

-- 1. 查看表格基本信息
SELECT COUNT(*) AS total_records FROM RegionalSearchSuggestions WHERE region = 'us';

-- 2. 搜索量最高的前20个搜索建议
SELECT suggestion, SUM(search_volume) AS total_search_volume, AVG(cost_per_click) AS avg_cpc
FROM RegionalSearchSuggestions
WHERE region = 'us' AND search_volume > 0
GROUP BY suggestion
ORDER BY total_search_volume DESC
LIMIT 20;

-- 3. 商业价值最高的前20个关键词（按CPC排序）
SELECT suggestion, search_volume, cost_per_click
FROM RegionalSearchSuggestions
WHERE region = 'us' AND cost_per_click > 0
ORDER BY cost_per_click DESC
LIMIT 20;

-- 4. 按修饰符类型分组统计
SELECT modifier_type, COUNT(*) as suggestion_count, 
       SUM(search_volume) as total_search_volume,
       AVG(cost_per_click) as avg_cpc
FROM RegionalSearchSuggestions
WHERE region = 'us'
GROUP BY modifier_type
ORDER BY total_search_volume DESC;

-- 5. 分析问题类型搜索（Questions修饰符类型）
SELECT modifier, suggestion, search_volume, cost_per_click
FROM RegionalSearchSuggestions
WHERE region = 'us' AND modifier_type = 'Questions'
ORDER BY search_volume DESC;

-- 6. 分析比较类型搜索（Comparisons修饰符类型）
SELECT modifier, suggestion, search_volume, cost_per_click
FROM RegionalSearchSuggestions
WHERE region = 'us' AND modifier_type = 'Comparisons'
ORDER BY search_volume DESC;

-- 7. 按产品系列分析搜索量
-- 找出包含特定产品系列名称的搜索建议
SELECT 
    CASE 
        WHEN suggestion LIKE '%stormbox%' THEN 'Stormbox系列'
        WHEN suggestion LIKE '%flybuds%' THEN 'Flybuds系列'
        WHEN suggestion LIKE '%earbuds%' THEN '耳塞类产品'
        WHEN suggestion LIKE '%xsound%' THEN 'XSound系列'
        WHEN suggestion LIKE '%quietplus%' THEN 'QuietPlus系列'
        WHEN suggestion LIKE '%xfree%' THEN 'XFree系列'
        ELSE '其他产品'
    END AS product_category,
    COUNT(*) AS suggestion_count,
    SUM(search_volume) AS total_search_volume,
    AVG(cost_per_click) AS avg_cpc
FROM RegionalSearchSuggestions
WHERE region = 'us'
GROUP BY product_category
ORDER BY total_search_volume DESC;

-- 8. 分析与竞争对手相关的搜索
SELECT suggestion, search_volume, cost_per_click
FROM RegionalSearchSuggestions
WHERE region = 'us' AND (
    suggestion LIKE '%vs jbl%' OR 
    suggestion LIKE '%vs bose%' OR 
    suggestion LIKE '%vs sony%' OR 
    suggestion LIKE '%vs anker%' OR
    suggestion LIKE '%vs soundcore%'
)
ORDER BY search_volume DESC;

-- 9. 分析用户关注的功能特性
SELECT 
    CASE 
        WHEN suggestion LIKE '%connect%' OR suggestion LIKE '%pair%' THEN '连接/配对问题'
        WHEN suggestion LIKE '%charge%' OR suggestion LIKE '%battery%' THEN '充电/电池问题'
        WHEN suggestion LIKE '%waterproof%' OR suggestion LIKE '%water%' THEN '防水功能'
        WHEN suggestion LIKE '%sound%' OR suggestion LIKE '%audio%' THEN '音质相关'
        WHEN suggestion LIKE '%mic%' OR suggestion LIKE '%voice%' THEN '麦克风相关'
        WHEN suggestion LIKE '%reset%' THEN '重置相关'
        ELSE '其他功能'
    END AS feature_category,
    COUNT(*) AS suggestion_count,
    SUM(search_volume) AS total_search_volume
FROM RegionalSearchSuggestions
WHERE region = 'us'
GROUP BY feature_category
ORDER BY total_search_volume DESC;

-- 10. 按字母分类的热门搜索
SELECT modifier, COUNT(*) as suggestion_count, SUM(search_volume) as total_search_volume
FROM RegionalSearchSuggestions
WHERE region = 'us' AND modifier_type = 'Alphabeticals'
GROUP BY modifier
ORDER BY total_search_volume DESC
LIMIT 10;
