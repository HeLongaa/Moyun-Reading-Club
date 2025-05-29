module.exports = {
    devServer: {
        https: false,
        port: 8080,
        host: '0.0.0.0',
        allowedHosts: 'all',
        client: {
            webSocketURL: 'auto://0.0.0.0:0/ws'
        },
        proxy: {
            '/api': {
                target: process.env.VUE_APP_API_BASE_URL,
                changeOrigin: true,
                pathRewrite: { '^/api': '' },
                secure: false
            }
        }
    }
}