import { createStore } from 'vuex'
import auth from './modules/auth'
import books from './modules/books'
import circle from './modules/circle'
import comments from './modules/comments'
import chat from './modules/chat'

export default createStore({
  modules: {
    auth,
    books,
    circle,
    comments,
    chat
  },
  strict: process.env.NODE_ENV !== 'production'
})