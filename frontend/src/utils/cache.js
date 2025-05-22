const CACHE_TTL = 5 * 60 * 1000; // 5分钟

export default {
    get(key) {
        const cached = localStorage.getItem(key);
        if (!cached) return null;

        const { timestamp, data } = JSON.parse(cached);
        if (Date.now() - timestamp > CACHE_TTL) {
            this.clear(key);
            return null;
        }

        return data;
    },

    set(key, data) {
        const cacheData = {
            timestamp: Date.now(),
            data
        };
        localStorage.setItem(key, JSON.stringify(cacheData));
    },

    clear(key) {
        localStorage.removeItem(key);
    },

    clearAll() {
        localStorage.clear();
    }
};