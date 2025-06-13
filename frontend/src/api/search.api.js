import http from '@/utils/api'

// 检查接口路径是否正确：应为 '/search'，且方法与后端一致（通常为 POST）
const searchApi = {
  // 综合搜索（GET，参数通过 params 传递）
  search: (params) => http.get('/search', { params }),
}

export default searchApi

