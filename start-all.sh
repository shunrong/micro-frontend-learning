#!/bin/bash

echo "🚀 启动简化版微前端 MVP..."
echo "================================"

# 清理之前的进程
pkill -f "npm start\|ng serve\|vite" 2>/dev/null || true

# 启动各个应用
echo "📦 启动 Angular微应用 (端口: 3003)..."
cd angular-micro-app && npm run start > ../logs/angular.log 2>&1 &
ANGULAR_PID=$!

echo "📦 启动 Vue微应用 (端口: 3002)..."
cd ../vue-micro-app && npm run dev > ../logs/vue.log 2>&1 &
VUE_PID=$!

echo "📦 启动 React微应用 (端口: 3001)..."
cd ../react-micro-app && npm start > ../logs/react.log 2>&1 &
REACT_PID=$!

echo "📦 启动 主应用 (端口: 3000)..."
cd ../main-app && npm start > ../logs/main.log 2>&1 &
MAIN_PID=$!

echo "🎉 所有应用启动完成！"
echo "================================"
echo "📊 应用访问地址："
echo "   主应用:        http://localhost:3000"
echo "   React微应用:   http://localhost:3001"
echo "   Vue微应用:     http://localhost:3002"
echo "   Angular微应用: http://localhost:3003"
echo ""
echo "⏳ 等待应用完全启动 (约 30-60 秒)..."
echo "💡 查看日志: tail -f logs/*.log"
echo "🛑 停止所有应用: ./stop-all.sh"

# 等待用户按键退出
read -p "按 Enter 键查看实时状态或 Ctrl+C 退出..."

while true; do
    echo "---"
    echo "🔍 检查服务状态："
    lsof -i :3000 >/dev/null 2>&1 && echo "✅ 主应用 (3000) 正在运行" || echo "❌ 主应用 (3000) 未运行"
    lsof -i :3001 >/dev/null 2>&1 && echo "✅ React微应用 (3001) 正在运行" || echo "❌ React微应用 (3001) 未运行"
    lsof -i :3002 >/dev/null 2>&1 && echo "✅ Vue微应用 (3002) 正在运行" || echo "❌ Vue微应用 (3002) 未运行"
    lsof -i :3003 >/dev/null 2>&1 && echo "✅ Angular微应用 (3003) 正在运行" || echo "❌ Angular微应用 (3003) 未运行"
    
    sleep 10
done
