#!/usr/bin/env python3
"""
批量注册用户、登录获取 JWT、写入就诊人，输出 tokens.csv
用法: python3 gen_tokens.py [用户数量] [网关地址]
示例: python3 gen_tokens.py 50 http://localhost:9001
"""
import sys
import csv
import json
import urllib.request
import urllib.error

# ── 配置 ──────────────────────────────────────────────────────────────────────
COUNT       = int(sys.argv[1]) if len(sys.argv) > 1 else 50
BASE_URL    = sys.argv[2].rstrip("/") if len(sys.argv) > 2 else "http://localhost:9001"
PHONE_START = 13_800_100_000   # 手机号起始，避免与真实用户冲突
PASSWORD    = "test123456"
OUTPUT      = "tokens.csv"
# ─────────────────────────────────────────────────────────────────────────────


def post(path, body, token=None):
    data = json.dumps(body).encode()
    req = urllib.request.Request(
        BASE_URL + path,
        data=data,
        headers={"Content-Type": "application/json"},
    )
    if token:
        req.add_header("Authorization", f"Bearer {token}")
    try:
        with urllib.request.urlopen(req, timeout=5) as resp:
            return resp.read().decode()
    except urllib.error.HTTPError as e:
        return e.read().decode()


def get_json(path, token):
    req = urllib.request.Request(BASE_URL + path)
    req.add_header("Authorization", f"Bearer {token}")
    with urllib.request.urlopen(req, timeout=5) as resp:
        return json.loads(resp.read().decode())


def make_id_card(i):
    # 6位地区码 + 12位序号，共18位，保证唯一
    return f"110100{i:012d}"


def main():
    results = []

    for i in range(COUNT):
        phone = str(PHONE_START + i)

        # 1. 注册
        reg = post("/user/register", {"phone": phone, "password": PASSWORD})
        if "成功" not in reg and "已注册" not in reg:
            print(f"[WARN] 注册失败 {phone}: {reg}")
            continue

        # 2. 登录，返回值直接是 JWT 字符串
        jwt = post("/user/login", {"phone": phone, "password": PASSWORD}).strip()
        if len(jwt) < 20:
            print(f"[WARN] 登录失败 {phone}: {jwt}")
            continue

        # 3. 查询是否已有就诊人，没有才插入
        patients = get_json("/user/patient/list", jwt)
        if not patients:
            insert_resp = post("/user/patient/insert", {
                "name":      f"测试用户{i:06d}",
                "idCard":    make_id_card(i),
                "gender":    1,
                "birthDate": "1990-01-01",
                "phone":     phone,
                "isDefault": 1,
            }, token=jwt)
            if "成功" not in insert_resp:
                print(f"[WARN] 插入就诊人失败 {phone}: {insert_resp}")
                continue
            patients = get_json("/user/patient/list", jwt)

        if not patients:
            print(f"[WARN] 无法获取 patientId {phone}")
            continue

        results.append({"jwt": jwt, "patientId": patients[0]["id"]})

        if (len(results)) % 10 == 0:
            print(f"  进度: {len(results)}/{COUNT}")

    # 4. 写 CSV
    with open(OUTPUT, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["jwt", "patientId"])
        writer.writeheader()
        writer.writerows(results)

    print(f"\n完成: 共生成 {len(results)} 条")
    print(f"已输出 → {OUTPUT}")


if __name__ == "__main__":
    main()
