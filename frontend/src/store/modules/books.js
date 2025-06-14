import booksApi from '@/api/books.api'

const state = {
    bookList: [],
    currentBook: null,
    recommendations: [],
    searchResults: [],
    sharedStatus: {}
}

const mutations = {
    SET_BOOKS(state, books) {
        state.bookList = books
    },

    SET_CURRENT_BOOK(state, book) {
        state.currentBook = book
    },

    SET_RECOMMENDATIONS(state, books) {
        state.recommendations = books
    },

    SET_SEARCH_RESULTS(state, results) {
        state.searchResults = results
    },

    UPDATE_SHARED_STATUS(state, { bookId, circles }) {
        state.sharedStatus[bookId] = circles
    }
}

const actions = {
    async fetchBooks({ commit }, params) {
        // 确保 booksApi.getBooks 存在
        if (!booksApi || typeof booksApi.getBooks !== 'function') {
            throw new Error('booksApi.getBooks 未定义，请检查 api/books.api.js 的导出')
        }
        const res = await booksApi.getBooks(params)
        // 兼容后端返回结构
        let books = []
        let total = 0
        if (res.data && res.data.data) {
            books = res.data.data.books || []
            total = res.data.data.total || 0
        } else if (res.data) {
            books = res.data.books || []
            total = res.data.total || 0
        }
        // 保证每本书都包含 author、publisher 字段
        books = books.map(b => ({
            ...b,
            author: b.author || '',
            publisher: b.publisher || '',
            type: b.type || ''
        }))
        commit('SET_BOOKS', books)
        // 如有 total 相关 mutation，可一并提交
        // commit('SET_TOTAL', total)
    },

    async fetchBookDetail({ commit }, bookId) {
        const response = await this.$booksApi.getBookDetail(bookId)
        commit('SET_CURRENT_BOOK', response.data)
    },

    async searchBooks({ commit }, query) {
        const response = await this.$booksApi.searchBooks(query)
        commit('SET_SEARCH_RESULTS', response.data)
    },

    async shareBook({ commit }, { bookId, circleId }) {
        await this.$booksApi.shareToCircle(bookId, circleId)
        commit('UPDATE_SHARED_STATUS', {
            bookId,
            circles: [...(state.sharedStatus[bookId] || []), circleId]
        })
    },

    async loadRecommendations({ commit }) {
        // 检查 booksApi.getRecommendations 是否存在
        if (!booksApi || typeof booksApi.getRecommendations !== 'function') {
            // 若没有该方法，直接返回空数组，避免报错
            commit('SET_RECOMMENDATIONS', [])
            return
        }
        const response = await booksApi.getRecommendations()
        commit('SET_RECOMMENDATIONS', response.data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}