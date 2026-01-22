#!/bin/bash

BASE_URL="http://localhost:3000/api"
FIREBASE_TOKEN="your-token-here"

echo "Testing Product Compliance API..."
echo "=================================="
echo ""

echo "1. Health Check..."
curl -s "$BASE_URL/health" | jq
echo ""

echo "2. Compliance by Brand and Area..."
curl -s "$BASE_URL/compliance/brand-area" \
  -H "Authorization: Bearer $FIREBASE_TOKEN" | jq
echo ""

echo "3. Overall Statistics..."
curl -s "$BASE_URL/compliance/stats" \
  -H "Authorization: Bearer $FIREBASE_TOKEN" | jq
echo ""

echo "4. All Brands..."
curl -s "$BASE_URL/compliance/brands" \
  -H "Authorization: Bearer $FIREBASE_TOKEN" | jq
echo ""

echo "5. All Areas..."
curl -s "$BASE_URL/compliance/areas" \
  -H "Authorization: Bearer $FIREBASE_TOKEN" | jq
echo ""

echo "All tests completed!"