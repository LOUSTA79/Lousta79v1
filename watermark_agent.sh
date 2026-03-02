for book in manufacturing/books/*.txt; do
  sed -i "1i © 2026 Lousta Corporation | ABN 54 492 524 823 | All Rights Reserved\n" "$book"
done
