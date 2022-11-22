export default {
    state: {
        exam_identity : '',
    },
    mutations: {
        // 方法
        addProblems(state,exam_identity) {
            state.exam_identity = exam_identity;
        }
    }
}