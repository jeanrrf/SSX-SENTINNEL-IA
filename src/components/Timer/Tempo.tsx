class Timer {
    private startTime: number = 0;
    private elapsedTime: number = 0;
    private timerId: NodeJS.Timeout | null = null;

    start(callback: () => void) {
        this.startTime = Date.now() - this.elapsedTime;
        this.timerId = setInterval(() => {
            this.elapsedTime = Date.now() - this.startTime;
            callback();
        }, 1000);
    }

    stop() {
        if (this.timerId) {
            clearInterval(this.timerId);
            this.timerId = null;
        }
    }

    reset() {
        this.stop();
        this.elapsedTime = 0;
    }

    getTime() {
        const totalSeconds = Math.floor(this.elapsedTime / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

const timer = new Timer();
timer.start(() => {
    console.log(timer.getTime()); // Will log formatted time every second
});

// Later when needed:
timer.stop();  // Stops the timer
timer.reset(); // Resets to 00:00:00