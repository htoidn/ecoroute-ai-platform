#!/bin/bash
# performance-test.sh

echo "=== ECOROUTE AI PLATFORM - PERFORMANCE METRICS ==="
echo ""

echo "1. API Response Latency Test (10 requests)"
echo "-------------------------------------------"
for i in {1..10}; do 
  curl -s -w "%{time_total}s\n" http://localhost:8080/api/destinations -o /dev/null
done | awk '{sum+=$1} END {print "Average: " sum/NR "s (45ms expected)"}'

echo ""
echo "2. Database Query Performance"
echo "-------------------------------------------"
docker exec ecoroute-backend bash -c 'time curl -s http://localhost:8080/api/destinations | wc -l'

echo ""
echo "3. Container Memory Usage"
echo "-------------------------------------------"
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemPerc}}"

echo ""
echo "4. API Response Sample"
echo "-------------------------------------------"
curl -s http://localhost:8080/api/destinations | jq '.[] | {id, name, country, sustainabilityScore}' | head -20

echo ""
echo "5. Destination Count"
echo "-------------------------------------------"
curl -s http://localhost:8080/api/destinations | jq 'length' | xargs echo "Total destinations:"

echo ""
echo "✅ Performance testing complete!"
