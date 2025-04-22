-- 综合搜索分析SQL

-- 1. 产品类别分布
SELECT 
    CASE
        WHEN suggestion_text LIKE '%earbuds%' OR suggestion_text LIKE '%ear buds%' OR suggestion_text LIKE '%wireless earbuds%' 
             OR suggestion_text LIKE '%flybuds%' THEN 'Earbuds'
        WHEN suggestion_text LIKE '%headphones%' OR suggestion_text LIKE '%quietplus%' THEN 'Headphones'
        WHEN suggestion_text LIKE '%speaker%' OR suggestion_text LIKE '%stormbox%' OR suggestion_text LIKE '%xsound%' 
             OR suggestion_text LIKE '%maxsound%' THEN 'Speakers'
        ELSE 'Other'
    END as product_category,
    COUNT(*) as count,
    SUM(search_volume) as total_search_volume,
    CASE WHEN COUNT(*) > 0 THEN CAST(SUM(search_volume) AS REAL) / COUNT(*) ELSE 0 END as avg_search_volume
FROM SearchSuggestions
GROUP BY product_category
ORDER BY total_search_volume DESC;

-- 2. 产品型号搜索量分析
SELECT 
    CASE
        WHEN suggestion_text LIKE '%stormbox blast%' THEN 'Stormbox Blast'
        WHEN suggestion_text LIKE '%stormbox micro 2%' THEN 'Stormbox Micro 2'
        WHEN suggestion_text LIKE '%stormbox 2%' THEN 'Stormbox 2'
        WHEN suggestion_text LIKE '%stormbox micro%' THEN 'Stormbox Micro'
        WHEN suggestion_text LIKE '%stormbox pro%' THEN 'Stormbox Pro'
        WHEN suggestion_text LIKE '%stormbox flow%' THEN 'Stormbox Flow'
        WHEN suggestion_text LIKE '%stormbox mini%' THEN 'Stormbox Mini'
        WHEN suggestion_text LIKE '%stormbox%' THEN 'Stormbox (其他)'
        WHEN suggestion_text LIKE '%xsound go%' THEN 'XSound Go'
        WHEN suggestion_text LIKE '%xsound plus 2%' THEN 'XSound Plus 2'
        WHEN suggestion_text LIKE '%xsound surf%' THEN 'XSound Surf'
        WHEN suggestion_text LIKE '%xsound mega%' THEN 'XSound Mega'
        WHEN suggestion_text LIKE '%xsound%' THEN 'XSound (其他)'
        WHEN suggestion_text LIKE '%flybuds 3%' THEN 'Flybuds 3'
        WHEN suggestion_text LIKE '%flybuds c1%' THEN 'Flybuds C1'
        WHEN suggestion_text LIKE '%flybuds c2%' THEN 'Flybuds C2'
        WHEN suggestion_text LIKE '%flybuds 1%' THEN 'Flybuds 1'
        WHEN suggestion_text LIKE '%flybuds%' THEN 'Flybuds (其他)'
        WHEN suggestion_text LIKE '%quietplus 72%' THEN 'QuietPlus 72'
        WHEN suggestion_text LIKE '%quietplus 50%' THEN 'QuietPlus 50'
        WHEN suggestion_text LIKE '%quietplus 71%' THEN 'QuietPlus 71'
        WHEN suggestion_text LIKE '%quietplus%' THEN 'QuietPlus (其他)'
        WHEN suggestion_text LIKE '%movebuds h1%' THEN 'MoveBuds H1'
        WHEN suggestion_text LIKE '%movebuds%' THEN 'MoveBuds (其他)'
        ELSE 'Other'
    END as product_model,
    COUNT(*) as count,
    SUM(search_volume) as total_search_volume,
    CASE WHEN COUNT(*) > 0 THEN CAST(SUM(search_volume) AS REAL) / COUNT(*) ELSE 0 END as avg_search_volume
FROM SearchSuggestions
GROUP BY product_model
HAVING product_model != 'Other'
ORDER BY total_search_volume DESC;

-- 3. 搜索词修饰符分析
SELECT 
    COALESCE(modifier_type, 'Unknown') as modifier_type,
    COUNT(*) as count,
    SUM(search_volume) as total_search_volume
FROM SearchSuggestions
GROUP BY modifier_type
ORDER BY count DESC;

-- 4. 竞争对手分析
-- 4.1 VS比较分析
SELECT 
    suggestion_text,
    search_volume,
    cost_per_click
FROM SearchSuggestions
WHERE (suggestion_text LIKE '%vs%' OR suggestion_text LIKE '%versus%' OR suggestion_text LIKE '% or %')
  AND search_volume > 0
ORDER BY search_volume DESC
LIMIT 50;

-- 4.2 提取最常被比较的竞争对手
WITH comparison_terms AS (
    SELECT 
        suggestion_text
    FROM SearchSuggestions
    WHERE (suggestion_text LIKE '%vs%' OR suggestion_text LIKE '%versus%' OR suggestion_text LIKE '% or %')
)
SELECT 
    CASE
        WHEN suggestion_text LIKE '%vs jbl%' OR suggestion_text LIKE '%jbl vs%' THEN 'JBL'
        WHEN suggestion_text LIKE '%vs bose%' OR suggestion_text LIKE '%bose vs%' THEN 'Bose'
        WHEN suggestion_text LIKE '%vs soundcore%' OR suggestion_text LIKE '%soundcore vs%' OR 
             suggestion_text LIKE '%vs anker%' OR suggestion_text LIKE '%anker vs%' THEN 'Anker/Soundcore'
        WHEN suggestion_text LIKE '%vs sony%' OR suggestion_text LIKE '%sony vs%' THEN 'Sony'
        WHEN suggestion_text LIKE '%vs marshall%' OR suggestion_text LIKE '%marshall vs%' THEN 'Marshall'
        WHEN suggestion_text LIKE '%vs beats%' OR suggestion_text LIKE '%beats vs%' THEN 'Beats'
        WHEN suggestion_text LIKE '%vs boat%' OR suggestion_text LIKE '%boat vs%' THEN 'Boat'
        WHEN suggestion_text LIKE '%vs jlab%' OR suggestion_text LIKE '%jlab vs%' THEN 'JLab'
        WHEN suggestion_text LIKE '%vs ultimate ears%' OR suggestion_text LIKE '%ultimate ears vs%' OR
             suggestion_text LIKE '%vs ue%' OR suggestion_text LIKE '%ue vs%' THEN 'Ultimate Ears'
        ELSE 'Other'
    END as competitor,
    COUNT(*) as comparison_count
FROM comparison_terms
GROUP BY competitor
HAVING competitor != 'Other'
ORDER BY comparison_count DESC;

-- 5. 热门问题分析
SELECT 
    suggestion_text,
    search_volume
FROM SearchSuggestions
WHERE (modifier_type = 'Questions' OR suggestion_text LIKE 'how %' OR suggestion_text LIKE 'what %' OR
       suggestion_text LIKE 'which %' OR suggestion_text LIKE 'where %' OR suggestion_text LIKE 'when %' OR
       suggestion_text LIKE 'why %' OR suggestion_text LIKE 'are %' OR suggestion_text LIKE 'is %' OR
       suggestion_text LIKE 'can %' OR suggestion_text LIKE 'does %' OR suggestion_text LIKE 'do %')
  AND search_volume > 0
ORDER BY search_volume DESC
LIMIT 30;

-- 6. 区域分析（如果有区域数据）
SELECT 
    region,
    COUNT(*) as suggestion_count,
    SUM(search_volume) as total_search_volume
FROM SearchSuggestions
WHERE region IS NOT NULL AND region != ''
GROUP BY region
ORDER BY total_search_volume DESC;

-- 7. 搜索价值分析（搜索量×CPC）
SELECT 
    suggestion_text,
    search_volume,
    cost_per_click,
    (search_volume * cost_per_click) as search_value
FROM SearchSuggestions
WHERE search_volume > 0 AND cost_per_click > 0
ORDER BY search_value DESC
LIMIT 30;

-- 8. 产品特性关注点分析
SELECT 
    CASE
        WHEN suggestion_text LIKE '%waterproof%' OR suggestion_text LIKE '%water proof%' OR
             suggestion_text LIKE '%ipx7%' OR suggestion_text LIKE '%ipx8%' THEN 'Waterproof'
        WHEN suggestion_text LIKE '%battery%' OR suggestion_text LIKE '%charging%' OR 
             suggestion_text LIKE '%charge%' OR suggestion_text LIKE '%playtime%' OR 
             suggestion_text LIKE '%play time%' THEN 'Battery/Charging'
        WHEN suggestion_text LIKE '%sound quality%' OR suggestion_text LIKE '%bass%' OR
             suggestion_text LIKE '%audio%' OR suggestion_text LIKE '%sound%' THEN 'Sound Quality'
        WHEN suggestion_text LIKE '%pairing%' OR suggestion_text LIKE '%pair%' OR
             suggestion_text LIKE '%connect%' OR suggestion_text LIKE '%bluetooth%' THEN 'Connectivity'
        WHEN suggestion_text LIKE '%noise cancel%' OR suggestion_text LIKE '%anc%' OR
             suggestion_text LIKE '%noise reduction%' THEN 'Noise Cancellation'
        WHEN suggestion_text LIKE '%warranty%' OR suggestion_text LIKE '%support%' OR
             suggestion_text LIKE '%service%' OR suggestion_text LIKE '%repair%' THEN 'Support/Service'
        WHEN suggestion_text LIKE '%price%' OR suggestion_text LIKE '%cost%' OR
             suggestion_text LIKE '%cheap%' OR suggestion_text LIKE '%discount%' OR
             suggestion_text LIKE '%deal%' THEN 'Price/Value'
        ELSE 'Other'
    END as feature,
    COUNT(*) as count,
    SUM(search_volume) as total_search_volume
FROM SearchSuggestions
GROUP BY feature
HAVING feature != 'Other'
ORDER BY total_search_volume DESC;

-- 9. 字母分布分析
SELECT 
    SUBSTR(LOWER(suggestion_text), 1, 1) as first_letter,
    COUNT(*) as count
FROM SearchSuggestions
GROUP BY first_letter
ORDER BY count DESC;

-- 10. 总体统计
SELECT 
    COUNT(*) as total_suggestions,
    SUM(search_volume) as total_search_volume,
    AVG(search_volume) as avg_search_volume,
    AVG(cost_per_click) as avg_cpc,
    MAX(search_volume) as max_search_volume,
    MIN(search_volume) as min_search_volume
FROM SearchSuggestions;
