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
        const response = await this.$booksApi.getBooks(params)
        commit('SET_BOOKS', response.data)
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
        const response = await this.$booksApi.getRecommendations()
        commit('SET_RECOMMENDATIONS', response.data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}