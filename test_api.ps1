# SiliconFlow API 测试脚本

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SiliconFlow API Key 可用性测试" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$apiKey = "sk-xqfeedlachvcovfxcztkgxnzdottviyqatnsuwthluqpuxwe"
$baseUrl = "https://api.siliconflow.cn/v1"

# 测试模型列表
Write-Host "1️⃣  获取可用模型列表..." -ForegroundColor Yellow
try {
    $models = Invoke-RestMethod -Uri "$baseUrl/models" -Method Get -Headers @{"Authorization"="Bearer $apiKey"}
    Write-Host "✅ 成功获取模型列表，共 $($models.data.Count) 个模型`n" -ForegroundColor Green
} catch {
    Write-Host "❌ 失败：$($_.Exception.Response.StatusCode)" -ForegroundColor Red
    Write-Host "`n可能的问题：" -ForegroundColor Yellow
    Write-Host "  1. API Key 已失效" -ForegroundColor Yellow
    Write-Host "  2. IP 被限制（尝试切换网络）" -ForegroundColor Yellow
    Write-Host "  3. 网络连接问题" -ForegroundColor Yellow
    exit
}

# 测试几个常用模型
$testModels = @(
    "Qwen/Qwen2.5-7B-Instruct",
    "internlm/internlm2_5-7b-chat",
    "deepseek-ai/DeepSeek-R1-Distill-Qwen-7B"
)

Write-Host "2️⃣  测试免费/便宜模型..." -ForegroundColor Yellow
Write-Host ""

foreach ($model in $testModels) {
    Write-Host "  测试：$model" -NoNewline
    $body = @{model=$model;messages=@(@{role="user";content="hi"})} | ConvertTo-Json -Compress
    
    try {
        $result = Invoke-RestMethod -Uri "$baseUrl/chat/completions" -Method Post `
            -Headers @{"Authorization"="Bearer $apiKey";"Content-Type"="application/json"} `
            -Body $body -TimeoutSec 10
        
        Write-Host " ✅ 可用 (Token: $($result.usage.total_tokens))" -ForegroundColor Green
    } catch {
        $code = if ($_.Exception.Response) { $_.Exception.Response.StatusCode } else { "未知" }
        Write-Host " ❌ $code" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "测试完成" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($models.data.balance -lt 1) {
    Write-Host "⚠️  警告：余额不足，请充值或更换便宜的模型" -ForegroundColor Yellow
} else {
    Write-Host "✅ 当前余额：$($models.data.balance) 元" -ForegroundColor Green
}
