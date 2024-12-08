class PerformanceMonitor {
    private static instance: PerformanceMonitor;
    private metrics: Record<string, number[]> = {};
    private readonly MAX_SAMPLES = 100;

    private constructor() {}

    static getInstance(): PerformanceMonitor {
        if (!PerformanceMonitor.instance) {
            PerformanceMonitor.instance = new PerformanceMonitor();
        }
        return PerformanceMonitor.instance;
    }

    startOperation(): number {
        return performance.now();
    }

    endOperation(operation: string, startTime: number): void {
        const duration = performance.now() - startTime;
        if (!this.metrics[operation]) {
            this.metrics[operation] = [];
        }

        this.metrics[operation].push(duration);

        if (this.metrics[operation].length > this.MAX_SAMPLES) {
            this.metrics[operation].shift();
        }
    }

    getMetrics(operation: string): { average: number; min: number; max: number } | null {
        const samples = this.metrics[operation];
        if (!samples || samples.length === 0) return null;

        const sum = samples.reduce((acc, val) => acc + val, 0);
        return {
            average: sum / samples.length,
            min: Math.min(...samples),
            max: Math.max(...samples)
        };
    }

    clearMetrics(operation?: string): void {
        if (operation) {
            delete this.metrics[operation];
        } else {
            this.metrics = {};
        }
    }
}

export const performanceMonitor = PerformanceMonitor.getInstance();

export const measurePerformance = async (operation: () => Promise<void>) => {
    const startTime = performanceMonitor.startOperation();
    
    try {
        await operation();
    } catch (error) {
        console.error('Erro durante a operação:', error);
        throw error;
    } finally {
        performanceMonitor.endOperation('default', startTime);
        const endTime = performance.now();
        const duration = endTime - startTime;
        console.log(`Operação completada em ${duration.toFixed(2)}ms`);
    }
};
