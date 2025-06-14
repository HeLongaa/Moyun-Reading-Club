import http from '@/utils/api'

const homeApi = {
  // 首页推荐、热门、活跃、诗词
  getHomeData: () => http.get('/public/data'),
}

export default homeApi
