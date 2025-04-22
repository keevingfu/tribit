-- 搜索分析SQL脚本
-- 清除之前的视图
DROP VIEW IF EXISTS TopSearchTerms;
DROP VIEW IF EXISTS SearchByModifierType;
DROP VIEW IF EXISTS SearchByFirstLetter;
DROP VIEW IF EXISTS RegionalSearches;
DROP VIEW IF EXISTS SearchValueMetrics;
DROP VIEW IF EXISTS ProductCategories;
DROP VIEW IF EXISTS KeyQuestions;
DROP VIEW IF EXISTS CompetitorComparisons;

-- 1. 获取搜索量最大的前20个搜索词
CREATE VIEW TopSearchTerms AS
SELECT suggestion_text, keyword, search_volume, cost_per_click, language
FROM SearchSuggestions
WHERE search_volume > 0
ORDER BY search_volume DESC
LIMIT 20;

-- 2. 按修饰符类型统计搜索词数量
CREATE VIEW SearchByModifierType AS
SELECT modifier_type, COUNT(*) as count
FROM SearchSuggestions
GROUP BY modifier_type
ORDER BY count DESC;

-- 3. 按首字母统计搜索词数量
CREATE VIEW SearchByFirstLetter AS
SELECT 
    CASE 
        WHEN modifier_type = 'Alphabeticals' THEN modifier
        ELSE SUBSTR(suggestion_text, 1, 1)
    END as first_letter,
    COUNT(*) as count
FROM SearchSuggestions
GROUP BY first_letter
ORDER BY count DESC;

-- 4. 地区分析 (如果有区域数据)
CREATE VIEW RegionalSearches AS
SELECT region, COUNT(*) as suggestions_count, 
       SUM(search_volume) as total_search_volume
FROM SearchSuggestions
WHERE region IS NOT NULL AND region != ''
GROUP BY region
ORDER BY total_search_volume DESC;

-- 5. 搜索价值指标 (搜索量 * CPC)
CREATE VIEW SearchValueMetrics AS
SELECT 
    suggestion_text, keyword, search_volume, cost_per_click,
    search_volume * cost_per_click as value_score,
    language
FROM SearchSuggestions
WHERE search_volume > 0 AND cost_per_click > 0
ORDER BY value_score DESC
LIMIT 20;

-- 6. 分类产品类别分析
CREATE VIEW ProductCategories AS
SELECT 
    CASE
        WHEN suggestion_text LIKE '%earbuds%' OR suggestion_text LIKE '%ear buds%' OR suggestion_text LIKE '%wireless earbuds%' THEN 'Earbuds'
        WHEN suggestion_text LIKE '%headphones%' OR suggestion_text LIKE '%quietplus%' THEN 'Headphones'
        WHEN suggestion_text LIKE '%speaker%' OR suggestion_text LIKE '%stormbox%' OR suggestion_text LIKE '%xsound%' THEN 'Speakers'
        ELSE 'Other'
    END as product_category,
    COUNT(*) as count,
    SUM(search_volume) as total_search_volume,
    CASE WHEN COUNT(*) > 0 THEN SUM(search_volume) / COUNT(*) ELSE 0 END as avg_search_volume
FROM SearchSuggestions
GROUP BY product_category
ORDER BY total_search_volume DESC;

-- 7. 获取关键问题分析
CREATE VIEW KeyQuestions AS
SELECT suggestion_text, search_volume, cost_per_click
FROM SearchSuggestions
WHERE modifier_type = 'Questions'
AND search_volume > 0
ORDER BY search_volume DESC;

-- 8. 竞争对手比较分析
CREATE VIEW CompetitorComparisons AS
SELECT 
    suggestion_text, keyword, search_volume, cost_per_click,
    language, region
FROM SearchSuggestions
WHERE (modifier_type = 'Comparisons' AND modifier = 'vs') 
   OR suggestion_text LIKE '%vs %' 
   OR suggestion_text LIKE '% vs %'
ORDER BY search_volume DESC;

-- 执行一些分析查询

-- 1. 获取搜索量最大的前20个搜索词
SELECT * FROM TopSearchTerms;

-- 2. 按修饰符类型统计搜索词数量
SELECT * FROM SearchByModifierType;

-- 3. 按首字母统计搜索词数量
SELECT * FROM SearchByFirstLetter LIMIT 30;

-- 4. 美国区域热门搜索词 (如果有区域数据)
SELECT suggestion_text, region, search_volume, cost_per_click
FROM SearchSuggestions
WHERE region = 'us' AND search_volume > 0
ORDER BY search_volume DESC
LIMIT 20;

-- 5. 搜索价值指标 (搜索量 * CPC)
SELECT * FROM SearchValueMetrics;

-- 6. 热门问题分析
SELECT * FROM KeyQuestions;

-- 7. 竞争对手比较分析
SELECT * FROM CompetitorComparisons 
WHERE search_volume > 0
LIMIT 20;

-- 8. 产品类别分析
SELECT * FROM ProductCategories;

-- 9. 主要产品型号搜索量分析
SELECT suggestion_text, search_volume, cost_per_click 
FROM SearchSuggestions
WHERE suggestion_text LIKE '%stormbox%' 
   OR suggestion_text LIKE '%flybuds%'
   OR suggestion_text LIKE '%xsound%'
   AND search_volume > 0
ORDER BY search_volume DESC
LIMIT 30;
