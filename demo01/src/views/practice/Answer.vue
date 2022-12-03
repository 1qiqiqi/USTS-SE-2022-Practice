<template>
    <div class="ProblemInfo">
        <el-container>
            <el-header style="height: 80px;">
                <div>
                    <i class="el-icon-close" style="margin-left: 63px;font-size: 32px;" @click="goback"></i>
                </div>
                <span v-if="status === '1'" class="class">{{ IsRight ? "你的答案正确！" : "你的答案错误！" }}</span>
            </el-header>
            <el-container>
                <el-main>
                    <div class="main">
                        <label>正确答案：</label>
                        <input v-model="answer" type="text">
                        <div class="image">
                            <el-image :src="imageSrc"></el-image>
                        </div>
                    </div>
                    <div class="btns">
                        <el-button v-if="status === '2'" type="danger" style="margin-right: 12px;" @click="goback">返回
                        </el-button>
                        <el-button type="primary" @click="nextProblem(getNextIndex)">下一题</el-button>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { image } from '../../api'
import Cookie from 'js-cookie'
export default {
    data() {
        return {
            status: '',
            Key: '',
            answer: '',
            identity: '',
            radio: '',
            radio1: '', // 判断题答案
            radio2: '', // 判断题答案
            radio3: '', // 判断题答案
            radio4: '', // 判断题答案
            problems: [],
            problem_type: '',
            imageSrc: '',
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            // console.log("接收到", this.$route.query.identity, "Key:", this.$route.query.Key)
            this.identity = this.$route.query.identity; // 这个identity是答题页面这个题目本身的标识
            this.answer = this.$route.query.answer;
            this.Key = this.$route.query.Key;
            this.problem_type = this.$route.query.problem_type;
            this.status = Cookie.get('status');
            // 要接收的东西
            if (this.$route.query.problem_type === '选择题') {
                this.radio = this.$route.query.radio;
            } else if (this.$route.query.problem_type === '判断题') {
                this.radio1 = this.$route.query.radio1;
                this.radio2 = this.$route.query.radio2;
                this.radio3 = this.$route.query.radio3;
                this.radio4 = this.$route.query.radio4;
            } else if (this.$route.query.problem_type === '填空题') {
                this.input = this.$route.query.input
            } else {
                console.log("什么题型都不属于");
            }
            // console.log("this.identity", this.identity, "this.answer", this.answer);
            if (this.$store.state.practice.problems) {
                this.problems = this.$store.state.practice.problems
                // console.log(this.$store.state.practice.problems)
            } else {
                console.log("不是的把 怎么会没有题目的哇")
            }
            this.Image()
        },
        Image() {
            this.imageSrc = 'http://127.0.0.1:8087/image?url=' + this.Key
            // image({ params: { url: content } }).then(({ data }) => {
            //     console.log(data.code)
            //     console.log("看看对象类型长啥样" + data)
            //     if (data.code === 200) {
            //         this.imageSrc = window.URL.createObjectURL(data.data);
            //         console.log("你来过是吧",)
            //         this.$message.success("图片获取成功")
            //     } else {
            //         this.$message.error("更新失败")
            //     }
            // })
        },
        nextProblem(index) {
            // 这里要区分一下老师和学生练习的下一题
            if (Cookie.get("status") === '2') {
                this.identity = this.problems[index];
                this.$store.commit('getProblem_identity', this.problems[index])
                this.$router.push({ name: "doproblem" })
            } else if (Cookie.get("status") === '1') {
                // 学生的下一题
                this.$router.push({ name: "doproblem" })
            } else {
                console.log("啥也没有咋回事");
            }
        },
        goback() {
            this.$router.push({ name: "doproblem", query: { identity: this.identity } })
        },
        CatExam() {
            this.$router.push({ name: "examlist", query: { classIdentity: this.identity } })
        }
    },
    computed: {
        getNextIndex() {
            return this.problems.findIndex(item => item === this.identity) + 1;
        },
        IsRight() {
            if (this.$route.query.problem_type === '选择题') {
                if (this.radio === this.answer) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.$route.query.problem_type === '判断题') {
                if (this.radio1 === this.answer[0] && this.radio2 === this.answer[1] && this.radio3 === this.answer[2] && this.radio4 === this.answer[3]) {
                    return true;
                } else {
                    return false;
                }
            } else if (this.$route.query.problem_type === '填空题') {
                var answer = this.answer;
                var input = this.input;

                for (let i = 0; i < answer.length; i++) {
                    if (answer[i] !== input[i]) {
                        return false;
                    }
                }
                return true;
            } else {
                console.log("查看题解页面什么题型都不属于");
                return false
            }
        }
    }
}
</script>
<style lang="less" scoped>
.ProblemInfo {

    .el-container {
        .el-header {
            background-color: #B3C0D1;
            color: #333;

            .class {
                font-size: 30px;
                margin-left: 517px;
                ;
            }
        }

        .el-container {
            background-color: #E9EEF3;
            color: #333;
            text-align: center;

            .btns {
                margin-left: 804px;
                margin-top: 148px;
            }
        }
    }
}
</style>