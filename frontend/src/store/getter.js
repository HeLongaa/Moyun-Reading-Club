export default {
    recommendedBooks: (state) => {
        // 基于协同过滤的简单实现
        const userPreferences = state.auth.user.preferences || {};
        const history = state.books.readingHistory || [];

        return state.books.books.filter(book => {
            // 过滤已读过的书籍
            if (history.includes(book.id)) return false;

            // 根据用户偏好评分
            const categoryScore = userPreferences[book.category] || 1;
            const ratingScore = book.rating / 5 * 3;

            // 计算综合评分
            book.recommendScore = categoryScore + ratingScore;
            return true;
        })
            // 按综合评分排序
            .sort((a, b) => b.recommendScore - a.recommendScore)
            // 限制推荐数量
            .slice(0, 20);
    },
    popularBooks: (state) => {
        // 获取热门书籍（按阅读人数排序）
        return [...state.books.books]
            .sort((a, b) => (b.readers || 0) - (a.readers || 0))
            .slice(0, 10);
    }
};