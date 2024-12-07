function auto() {
    node auto proxies.txt
    sleep 5
    node bot &
    PID=$!
    echo "running with PID: $PID"
}

function stop() {
    if [ ! -z "$PID" ]; then
        echo "Stopping with PID: $PID"
        kill -9 $PID
        clear
    else
        echo "No process found to stop."
    fi
}

while true; do
    echo "Starting auto process..."
    auto
    sleep $((RANDOM % 360 * 10 * 24))
    stop
done
