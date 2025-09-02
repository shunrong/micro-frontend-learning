#!/bin/bash

# 微前端项目启动脚本
echo "🚀 启动微前端项目..."
echo "================================"

# 检查 Node.js 和 npm
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 函数：启动应用
start_app() {
    local app_name=$1
    local app_dir=$2
    local port=$3
    local command=$4
    
    echo "📦 启动 $app_name (端口: $port)..."
    
    if [ ! -d "$app_dir" ]; then
        echo "❌ 目录 $app_dir 不存在"
        return 1
    fi
    
    # 检查 node_modules 是否存在
    if [ ! -d "$app_dir/node_modules" ]; then
        echo "⏳ 安装依赖: $app_name"
        cd "$app_dir"
        npm install
        cd ..
    fi
    
    # 在后台启动应用
    cd "$app_dir"
    $command > "../logs/${app_name}.log" 2>&1 &
    local pid=$!
    cd ..
    
    echo "✅ $app_name 已启动 (PID: $pid, 端口: $port)"
    echo $pid > "logs/${app_name}.pid"
    
    # 等待一下确保进程正常启动
    sleep 2
}

# 创建日志目录
mkdir -p logs

# 清理之前的日志和 PID 文件
rm -f logs/*.log logs/*.pid

echo "🔄 启动所有微前端应用..."
echo ""

# 启动 Angular 微应用
start_app "Angular微应用" "angular-micro-app" "3003" "npm start"

# 等待 Angular 应用启动
sleep 3

# 启动 Vue 微应用
start_app "Vue微应用" "vue-micro-app" "3002" "npm run dev"

# 等待 Vue 应用启动
sleep 3

# 启动 React 微应用
start_app "React微应用" "react-micro-app" "3001" "npm start"

# 等待 React 应用启动
sleep 3

# 启动主应用
start_app "主应用" "main-app" "3000" "npm start"

echo ""
echo "🎉 所有应用启动完成！"
echo "================================"
echo "📊 应用访问地址："
echo "   主应用:        http://localhost:3000"
echo "   React微应用:   http://localhost:3001"
echo "   Vue微应用:     http://localhost:3002"
echo "   Angular微应用: http://localhost:3003"
echo ""
echo "📝 日志文件位置: ./logs/"
echo "🛑 停止所有应用: ./stop-all.sh"
echo ""
echo "⏳ 等待应用完全启动 (约 30-60 秒)..."
echo "💡 如果遇到问题，请查看对应的日志文件"

# 等待用户按键
echo ""
echo "按 Ctrl+C 退出监控..."

# 监控进程
while true; do
    sleep 10
    
    # 检查进程是否还在运行
    for pidfile in logs/*.pid; do
        if [ -f "$pidfile" ]; then
            pid=$(cat "$pidfile")
            if ! kill -0 "$pid" 2>/dev/null; then
                app_name=$(basename "$pidfile" .pid)
                echo "⚠️  $app_name 进程已停止 (PID: $pid)"
                # 不删除 PID 文件，只是报告状态
                # rm -f "$pidfile"
            fi
        fi
    done
    
    # 检查端口是否有服务在运行（更可靠的检查方式）
    echo "🔍 检查服务状态："
    for port in 3000 3001 3002 3003; do
        if lsof -ti:$port > /dev/null 2>&1; then
            echo "✅ 端口 $port 正在运行"
        else
            echo "❌ 端口 $port 没有服务"
        fi
    done
    echo "---"
done

