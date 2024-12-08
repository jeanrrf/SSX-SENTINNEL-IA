interface AnalyticsEvent {
    category: string;
    action: string;
    label?: string;
    value?: number;
    metadata?: Record<string, any>;
    timestamp: number;
}

class Analytics {
    private events: AnalyticsEvent[] = [];
    private readonly MAX_EVENTS = 1000;
    private isInitialized = false;

    init() {
        if (this.isInitialized) return;
        
        // Inicializar Google Analytics se disponível
        if (import.meta.env.VITE_APP_ANALYTICS_ID) {
            const script = document.createElement('script');
            script.async = true;
            script.src = `https://www.googletagmanager.com/gtag/js?id=${import.meta.env.VITE_APP_ANALYTICS_ID}`;
            document.head.appendChild(script);

            window.dataLayer = window.dataLayer || [];
            function gtag(...args: any[]) {
                window.dataLayer.push(args);
            }
            gtag('js', new Date());
            gtag('config', import.meta.env.VITE_APP_ANALYTICS_ID);
        }

        this.isInitialized = true;
    }

    trackEvent(category: string, action: string, label?: string, value?: number, metadata?: Record<string, any>) {
        const event: AnalyticsEvent = {
            category,
            action,
            label,
            value,
            metadata,
            timestamp: Date.now()
        };

        // Armazenar localmente
        this.events.push(event);
        if (this.events.length > this.MAX_EVENTS) {
            this.events = this.events.slice(-this.MAX_EVENTS);
        }

        // Enviar para Google Analytics em produção
        if (import.meta.env.PROD && window.gtag) {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value,
                ...metadata
            });
        }

        // Log em desenvolvimento
        if (import.meta.env.DEV) {
            console.log('Analytics Event:', event);
        }
    }

    // Eventos predefinidos
    trackPageView(page: string) {
        this.trackEvent('Navigation', 'PageView', page);
    }

    trackError(error: Error, context?: string) {
        this.trackEvent('Error', error.name, error.message, undefined, {
            context,
            stack: error.stack
        });
    }

    trackUserAction(action: string, details?: Record<string, any>) {
        this.trackEvent('UserAction', action, undefined, undefined, details);
    }

    trackPerformance(metric: string, duration: number) {
        this.trackEvent('Performance', metric, undefined, duration);
    }

    // Análise de eventos
    getEventsByCategory(category: string): AnalyticsEvent[] {
        return this.events.filter(event => event.category === category);
    }

    getEventsByAction(action: string): AnalyticsEvent[] {
        return this.events.filter(event => event.action === action);
    }

    getEventsByTimeRange(startTime: number, endTime: number): AnalyticsEvent[] {
        return this.events.filter(event => 
            event.timestamp >= startTime && event.timestamp <= endTime
        );
    }

    clearEvents() {
        this.events = [];
    }
}

export const analytics = new Analytics();
