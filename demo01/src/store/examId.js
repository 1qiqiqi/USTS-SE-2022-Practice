export default {
    state: {
        exam_identity : '',
        problem_index : JSON.parse(sessionStorage.getItem("problem_index")) || '',
        isStart: JSON.parse(sessionStorage.getItem("isStart")) || true,
    },
    mutations: {
        // 方法
        addProblems(state,exam_identity) {
            state.exam_identity = exam_identity;
        },
        getExamProblem(state,problem_index) {
            state.problem_index = problem_index;
            sessionStorage.setItem("problem_index", JSON.stringify(problem_index))
        },
        getIsStart(state,isStart) {
            state.isStart = isStart;
            sessionStorage.setItem("isStart", JSON.stringify(isStart))
        }
    }
}