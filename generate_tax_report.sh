#!/bin/bash
REPORT="Tax_Report_$(date +%Y-%m).csv"
echo "Date,Transaction,Amount,Currency,ABN" > $REPORT
cat ~/lousta/logs/manufacturing_expenses.csv >> $REPORT
echo "✅ Tax Report Generated: $REPORT"
