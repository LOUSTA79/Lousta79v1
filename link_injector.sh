#!/bin/bash
for file in manufacturing/books/*.txt; do
  if ! grep -q "lasaispecialists.com" "$file"; then
    echo -e "\n\n--- \nExplore more AI automation at www.lasaispecialists.com" >> "$file"
    echo "🔗 Links injected into $file"
  fi
done
