const state = {
    comments: new Map(),       // 使用Map存储不同目标的评论
    interactions: {}           // 用户互动状态
}

const mutations = {
    ADD_COMMENT(state, { targetType, targetId, comment }) {
        const key = `${targetType}_${targetId}`
        if (!state.comments.has(key)) {
            state.comments.set(key, {
                rootComments: [],
                entities: new Map()
            })
        }
        const target = state.comments.get(key)

        if (comment.parent_id) {
            const parent = target.entities.get(comment.parent_id)
            parent.replies = [...(parent.replies || []), comment.id]
        } else {
            target.rootComments.push(comment.id)
        }

        target.entities.set(comment.id, comment)
    },

    UPDATE_INTERACTION(state, { commentId, action, value }) {
        if (!state.interactions[commentId]) {
            state.interactions[commentId] = {}
        }
        state.interactions[commentId][action] = value
    }
}

const actions = {
    async fetchComments({ commit }, { targetType, targetId }) {
        const response = await this.$commentsApi.getComments(targetId, {
            target_type: targetType
        })
        response.data.forEach(comment => {
            commit('ADD_COMMENT', { targetType, targetId, comment })
        })
    },

    async postComment({ commit }, { content, targetType, targetId, parentId }) {
        const response = await this.$commentsApi.postComment({
            content,
            target_type: targetType,
            target_id: targetId,
            parent_id: parentId
        })
        commit('ADD_COMMENT', { targetType, targetId, comment: response.data })
        return response.data
    },

    async toggleInteraction({ commit, state }, { commentId, action }) {
        const current = state.interactions[commentId]?.[action] || false
        commit('UPDATE_INTERACTION', { commentId, action, value: !current })
        await this.$commentsApi.interact(commentId, current ? 'un' + action : action)
    }
}