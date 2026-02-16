export function formatRelativeTime(dateString: string | Date): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Negative difference handling (future dates)
    if (diffInSeconds < 0) {
        return 'Az önce';
    }

    const minutes = Math.floor(diffInSeconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 60) {
        return `${minutes} dk önce`;
    } else if (hours < 24) {
        return `${hours} saat önce`;
    } else {
        return `${days} gün önce`;
    }
}
