module.exports = {
    devServer: {
        https: true,
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