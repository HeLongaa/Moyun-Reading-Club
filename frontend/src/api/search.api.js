import http from '@/utils/api'

const searchApi = {
  // 综合搜索
  search: (params) => http.get('/search', { params }),
}

export default searchApi
