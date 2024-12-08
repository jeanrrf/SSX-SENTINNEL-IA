export const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '0min';

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    const parts = [];
    
    if (hours > 0) {
        parts.push(`${hours}h`);
    }
    
    if (minutes > 0 || (hours > 0 && remainingSeconds > 0)) {
        parts.push(`${minutes}min`);
    }
    
    if (remainingSeconds > 0 && hours === 0) {
        parts.push(`${remainingSeconds}s`);
    }
    
    return parts.join(' ');
};
