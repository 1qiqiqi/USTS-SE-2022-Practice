import http from '../utils/request'
export const LoginData = (form) => {
    console.log("登陆", form.name)
    return http.post('/Login', form);
}

export const SendCode = (form) => {
    return http.post('/SendCode', form)
}

export const VerifyEmailCode = (form) => {
    return http.post('/VerifyEmailCode', form)
}

export const Register = (form) => {
    return http.post('/Register', form)
}
// 获取练习列表
export const student_Practise = (params) => {
    console.log("get请求参数" + params.page)
    console.log("get请求参数" + params['page'])
    return http.get('/student/Practise', params)
}
// 老师获取知识点列表
export const teacher_Knowledge = () => {
    return http.get('/teacher/Knowledge')
}

// 错题列表
export const student_WrongProblem = (params) => {
    return http.get('/student/WrongProblem', params)
}

// 获取用户信息
export const User = () => {
    return http.get('/User')
}

// 获取班级列表
export const Class = (params) => {
    return http.get('/Class', params)
}

// 创建班级
export const teacher_Class = (form) => {
    return http.post('/teacher/Class', form)
}
// 获取学生列表
export const student_Exam = (params) => {
    return http.get('/student/Exam', params)
}
// 学生加入班级
export const student_Class = (form) => {
    return http.put('/student/Class', form)
}

// 获取班级详情
export const teacher_Class_identity = (params) => {
    return http.get('/teacher/Class/' + params.params.identity)
}
// 获取班级学生列表
export const teacher_ClassStudents = (params) => {
    return http.get('/teacher/ClassStudents', params)
}
// 修改班级代码
export const teacher_Class_put = (form) => {
    return http.put('/teacher/Class', form)
}
// 获取老师考试列表
export const teacher_Exam = (params) => {
    return http.get('/teacher/Exam', params)
}
// 发布考试
export const teacher_PublishExam = (form) => {
    return http.put('/teacher/PublishExam ', form)
}
// 添加考试
export const teacher_Exam_post = (form) => {
    return http.post('/teacher/Exam', form)
}
// 获取班级详情
export const teacher_Exam_identity = (params) => {
    return http.get('/teacher/Exam/' + params.params.identity)
}
// 修改考试信息
export const teacher_Exam_Put = (form) => {
    return http.put('/teacher/Exam ', form)
}
// 获取考试题目列表
export const teacher_ExamProblem = (params) => {
    return http.get('/teacher/ExamProblem', params)
}
// 删除考试题目
export const teacher_ExamProblem_Delete = (params) => {
    return http.delete('/teacher/ExamProblem', params)
}
// 添加考试题目
export const teacher_ExamProblem_post = (form) => {
    return http.post('/teacher/ExamProblem', form)
}
// 获取题目列表
export const teacher_Problem = (params) => {
    return http.get('/teacher/Problem', params)
}
// 获取题目详情
export const problem_identity = (params) => {
    return http.get('/Problem/' + params.params.identity)
}
// 获取图片
// export const image = (params) => {
//     return http.get('/image', params,{responseType: "blob"})
// }

// 获取随机练习题目
export const student_PractiseProblemDetail = (params) => {
    return http.get('/student/PractiseProblemDetail', params)
}
// 练习提交题目
export const student_UpProblemAnswer = (form) => {
    return http.put('/student/UpProblemAnswer', form)
}

// 获取错题详情
export const student_WrongProblem_identity = (params) => {
    return http.get('/student/WrongProblem/'+params.params.identity)
}
// 获取学生考试题目列表
export const student_ExamProblem = (params) => {
    return http.get('/student/ExamProblem', params)
}
// 提交试卷
export const student_ExamPaper_put = (form) => {
    return http.put('/student/ExamPaper', form)
}
// 查看试卷
export const student_ExamPaper_get = (params) => {
    return http.get('/student/ExamPaper', params)
}

