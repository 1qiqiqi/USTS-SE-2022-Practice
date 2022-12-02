export default {
    state: {
        problems : JSON.parse(sessionStorage.getItem("problems")) || [],
        problem_identity : JSON.parse(sessionStorage.getItem("problem_identity")) || '',
    },
    mutations: {
        // 方法
        getProblems(state,problems) {
            state.problems = problems;
            sessionStorage.setItem("problems", JSON.stringify(problems))
        },
        //拿到单个题目的dentity
        getProblem_identity(state,problem_identity) {
            state.problem_identity = problem_identity;
            sessionStorage.setItem("problem_identity", JSON.stringify(problem_identity))
        }
    }
}