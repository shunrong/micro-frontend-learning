#!/bin/bash

# 简化版微前端项目启动脚本
echo "🚀 启动微前端项目 (简化版)..."
echo "================================"

# 检查端口是否被占用
check_port() {
    local port=$1
    if lsof -ti:$port > /dev/null 2>&1; then
        echo "⚠️  端口 $port 已被占用，尝试释放..."
        kill -9 $(lsof -ti:$port) 2>/dev/null || true
        sleep 2
    fi
}

# 检查并释放端口
check_port 3000
check_port 3001
check_port 3002
check_port 3003

echo ""
echo "📦 启动微前端应用..."
echo ""

# 启动 Angular 微应用 (端口 3003)
echo "🅰️  启动 Angular 微应用 (端口 3003)..."
cd angular-micro-app
npm start &
ANGULAR_PID=$!
cd ..
sleep 3

# 启动 Vue 微应用 (端口 3002)
echo "🅥  启动 Vue 微应用 (端口 3002)..."
cd vue-micro-app
npm run dev &
VUE_PID=$!
cd ..
sleep 3

# 启动 React 微应用 (端口 3001)
echo "⚛️  启动 React 微应用 (端口 3001)..."
cd react-micro-app
npm start &
REACT_PID=$!
cd ..
sleep 3

# 启动主应用 (端口 3000)
echo "🏠 启动主应用 (端口 3000)..."
cd main-app
npm start &
MAIN_PID=$!
cd ..

echo ""
echo "⏳ 等待所有应用启动完成..."
sleep 15

echo ""
echo "🎉 微前端项目启动完成！"
echo "================================"
echo "📊 应用访问地址："
echo "   🏠 主应用:        http://localhost:3000"
echo "   ⚛️  React微应用:   http://localhost:3001"
echo "   🅥  Vue微应用:     http://localhost:3002"
echo "   🅰️  Angular微应用: http://localhost:3003"
echo ""

# 检查服务状态
echo "🔍 检查服务状态："
for port in 3000 3001 3002 3003; do
    if curl -s -o /dev/null -w "" http://localhost:$port --connect-timeout 2; then
        echo "✅ 端口 $port 服务正常"
    else
        echo "⚠️  端口 $port 服务可能还在启动中"
    fi
done

echo ""
echo "💡 提示："
echo "   - 如果服务还在启动中，请等待 1-2 分钟后再访问"
echo "   - 按 Ctrl+C 结束此脚本（不会停止应用）"
echo "   - 使用 ./stop-all.sh 停止所有应用"
echo ""

echo "🔄 保持监控状态，按 Ctrl+C 退出监控..."

# 简单的状态监控
trap 'echo ""; echo "👋 退出监控，应用继续运行..."; exit 0' INT

while true; do
    sleep 30
    echo "$(date '+%H:%M:%S') - 应用正在运行，访问 http://localhost:3000"
done
