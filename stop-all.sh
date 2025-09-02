#!/bin/bash

# 微前端项目停止脚本
echo "🛑 停止微前端项目..."
echo "================================"

# 从 PID 文件停止进程
stop_from_pidfile() {
    local pidfile=$1
    local app_name=$(basename "$pidfile" .pid)
    
    if [ -f "$pidfile" ]; then
        local pid=$(cat "$pidfile")
        if kill -0 "$pid" 2>/dev/null; then
            echo "🛑 停止 $app_name (PID: $pid)..."
            kill "$pid"
            sleep 2
            
            # 如果进程仍在运行，强制杀死
            if kill -0 "$pid" 2>/dev/null; then
                echo "⚠️  强制停止 $app_name (PID: $pid)..."
                kill -9 "$pid"
            fi
            
            echo "✅ $app_name 已停止"
        else
            echo "ℹ️  $app_name 进程不存在 (PID: $pid)"
        fi
        rm -f "$pidfile"
    fi
}

# 从端口停止进程
stop_from_port() {
    local port=$1
    local app_name=$2
    
    echo "🔍 查找端口 $port 上的进程..."
    local pid=$(lsof -ti:$port)
    
    if [ -n "$pid" ]; then
        echo "🛑 停止 $app_name (端口: $port, PID: $pid)..."
        kill "$pid" 2>/dev/null
        sleep 2
        
        # 检查进程是否还在运行
        if kill -0 "$pid" 2>/dev/null; then
            echo "⚠️  强制停止 $app_name (PID: $pid)..."
            kill -9 "$pid" 2>/dev/null
        fi
        echo "✅ $app_name 已停止"
    else
        echo "ℹ️  端口 $port 上没有运行的进程"
    fi
}

# 从 PID 文件停止
if [ -d "logs" ]; then
    for pidfile in logs/*.pid; do
        if [ -f "$pidfile" ]; then
            stop_from_pidfile "$pidfile"
        fi
    done
fi

echo ""
echo "🔍 检查并停止端口上的进程..."

# 从端口停止（备用方案）
stop_from_port 3000 "主应用"
stop_from_port 3001 "React微应用"
stop_from_port 3002 "Vue微应用"
stop_from_port 3003 "Angular微应用"

# 清理日志文件
if [ -d "logs" ]; then
    echo ""
    echo "🧹 清理日志文件..."
    rm -f logs/*.log logs/*.pid
    echo "✅ 日志文件已清理"
fi

echo ""
echo "🎉 所有微前端应用已停止！"
echo "================================"
