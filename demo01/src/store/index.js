import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
import examId from './examId'
import practice from './practice'
Vue.use(Vuex)

// 创建vuex的实例
export default new Vuex.Store({
    modules: {
        tab,
        examId,
        practice
    }
})