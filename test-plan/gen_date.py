#!/usr/bin/env python3
"""
生成随机日期 CSV 文件，用于压测排班查询接口
用法: python3 gen_dates.py [行数] [起始日期(YYYY-MM-DD)] [往后天数范围]
示例: python3 gen_dates.py 10000 2026-03-24 30
"""
import sys
import csv
import random
from datetime import datetime, timedelta

# ── 配置 ──────────────────────────────────────────────────────────────────────
COUNT      = int(sys.argv[1]) if len(sys.argv) > 1 else 10000
START_STR  = sys.argv[2] if len(sys.argv) > 2 else datetime.now().strftime("%Y-%m-%d")
DAYS_RANGE = int(sys.argv[3]) if len(sys.argv) > 3 else 30
OUTPUT     = "work_dates.csv"
# ─────────────────────────────────────────────────────────────────────────────

def main():
    try:
        start_date = datetime.strptime(START_STR, "%Y-%m-%d")
    except ValueError:
        print(f"日期格式错误: {START_STR}，请使用 YYYY-MM-DD")
        return

    print(f"正在生成 {COUNT} 条随机日期数据...")
    print(f"起始日期: {START_STR}, 随机范围: {DAYS_RANGE} 天内")

    results = []
    for _ in range(COUNT):
        # 在范围内随机增加天数
        random_days = random.randint(0, DAYS_RANGE)
        current_date = start_date + timedelta(days=random_days)
        # 格式化为 Java LocalDate 默认识别的字符串
        results.append({"workDate": current_date.strftime("%Y-%m-%d")})

    # 写入 CSV
    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["workDate"])
        writer.writeheader()
        writer.writerows(results)

    print(f"\n成功: 共生成 {len(results)} 条日期数据")
    print(f"文件已保存至 → {OUTPUT}")

if __name__ == "__main__":
    main()