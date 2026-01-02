#!/bin/bash
# ========================================
# MyBlog - API 测试脚本
# ========================================

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 默认配置
API_BASE="${API_BASE:-http://localhost:8000}"

echo ""
echo "========================================"
echo "  MyBlog - API 测试"
echo "========================================"
echo ""
echo "  API 地址: $API_BASE"
echo ""

# 计数器
PASS=0
FAIL=0

test_endpoint() {
    local name=$1
    local endpoint=$2
    local expected_code=${3:-200}
    
    printf "  %-30s" "$name"
    
    response=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE$endpoint" 2>/dev/null || echo "000")
    
    if [ "$response" = "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} ($response)"
        ((PASS++))
    else
        echo -e "${RED}✗ FAIL${NC} (expected $expected_code, got $response)"
        ((FAIL++))
    fi
}

echo "----------------------------------------"
echo "  健康检查"
echo "----------------------------------------"
test_endpoint "Health Check" "/api/health/"

echo ""
echo "----------------------------------------"
echo "  博客 API"
echo "----------------------------------------"
test_endpoint "Posts List" "/api/posts/"
test_endpoint "Categories List" "/api/categories/"
test_endpoint "Tags List" "/api/tags/"

echo ""
echo "----------------------------------------"
echo "  项目 API"
echo "----------------------------------------"
test_endpoint "Projects List" "/api/projects/"
test_endpoint "Tech Stacks List" "/api/techstacks/"

echo ""
echo "----------------------------------------"
echo "  搜索 API"
echo "----------------------------------------"
test_endpoint "Search (empty)" "/api/search/?q=test"

echo ""
echo "----------------------------------------"
echo "  管理后台"
echo "----------------------------------------"
test_endpoint "Admin Login Page" "/admin/login/" "200"

echo ""
echo "========================================"
echo "  测试结果"
echo "========================================"
echo ""
echo -e "  通过: ${GREEN}$PASS${NC}"
echo -e "  失败: ${RED}$FAIL${NC}"
echo ""

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}✓ 所有测试通过！${NC}"
    exit 0
else
    echo -e "${RED}✗ 有 $FAIL 个测试失败${NC}"
    exit 1
fi
