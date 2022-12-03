import VueRouter from "vue-router";
import Vue from 'vue';
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Main from '../views/Main.vue'
import Home from '../views/Home.vue'
import Practice from '../views/practice/Practice.vue'
import Exam from '../views/exam/Exam.vue'
import Wrong from '../views/wrong/Wrong.vue'
import Knowledge from '../views/knowledge/Knowledge.vue'
import KnowledgeList from '../views/knowledge/KnowledgeList.vue'
import Class from '../views/class/Class.vue'
import ClassInfo from '../views/class/ClassInfo.vue'
import ExamList from '../views/control_exam/ExamList.vue'
import ExamInfo from '../views/control_exam/ExamInfo.vue'
import DoProblem from '../views/practice/DoProblem.vue'
import Answer from '../views/practice/Answer.vue'
import WrongAnswer from '../views/wrong/WrongAnswer.vue'
import DoExamPaper from '../views/exam/DoExamPaper.vue'
// import PageTwo from '../views/PageTwo.vue'
Vue.use(VueRouter)
const routes = [
    {
        path: "/", 
        component: Main, 
        redirect: '/home', // 重定向
        children: [
            { path: 'home', name: 'home', component: Home }, // 首页
            { path: 'practice', name: 'practice', component: Practice }, // 练习管理
            { path: 'exam', name: 'exam', component: Exam }, // 考试管理
            { path: 'wrong', name: 'wrong', component: Wrong }, // 考试管理
            { path: 'knowledge', name: 'knowledge', component: Knowledge }, // 页面2
            { path: 'knowledgelist', name: 'knowledgelist', component: KnowledgeList }, // 知识点列表
            { path: 'class', name: 'class', component: Class }, // 页面2
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
    },
    {
        path: '/classinfo',
        name: 'classinfo',
        component: ClassInfo,
    },
    {
        path: '/examlist',
        name: 'examlist',
        component: ExamList,
    },
    {
        path: '/examinfo',
        name: 'examinfo',
        component: ExamInfo,
    },
    {
        path: '/doproblem',
        name: 'doproblem',
        component: DoProblem,
    },
    {
        path: '/answer',
        name: 'answer',
        component: Answer,
    },
    {
        path: '/wronganswer',
        name: 'wronganswer',
        component: WrongAnswer,
    },
    {
        path: '/doexampaper',
        name: 'doexampaper',
        component: DoExamPaper,
    },


]
const router = new VueRouter({
    routes
})

export default router