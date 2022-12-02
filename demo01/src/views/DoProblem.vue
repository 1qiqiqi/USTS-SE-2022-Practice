<template>
    <div class="ProblemInfo">
        <el-container>
            <el-header style="height: 80px;">
                <div>
                    <i class="el-icon-close" style="margin-left: 63px;font-size: 32px;" @click="goback"></i>
                </div>
                <span class="class">题目名称</span>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <div class="tags">
                        <el-tag type="info" style="margin-top: 12px;margin-right: 12px;">{{ label }}</el-tag>
                        <el-tag type="danger">{{ name }}</el-tag>
                    </div>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                </el-aside>
                <el-main>
                    <div class="main">
                        <div class="Problem">
                            <div class="image">
                                <el-image :src="imageSrc"></el-image>
                            </div>
                        </div>
                        <div class="radios">
                            <el-radio-group v-if="problem_type === '选择题'" v-model="radio">
                                <div>
                                    <el-radio label="A" border style="padding: 12px 60px 0 10px;margin-top:50px">A
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio label="B" border style="padding: 12px 60px 0 10px;margin-top:50px">B
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio label="C" border style="padding: 12px 60px 0 10px;margin-top:50px">C
                                    </el-radio>
                                </div>
                                <div>
                                    <el-radio label="D" border style="padding: 12px 60px 0 10px;margin-top:50px">D
                                    </el-radio>
                                </div>
                            </el-radio-group>
                            <el-radio-group class="chose" v-if="problem_type === '判断题'" v-model="radio">
                                <div>
                                    <el-radio-group v-model="radio1">
                                        <el-radio label="Y" border style="padding: 12px 60px 0 10px;margin-top:50px">Y
                                        </el-radio>
                                        <el-radio label="N" border style="padding: 12px 60px 0 10px;margin-top:50px">N
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                                <div>
                                    <el-radio-group v-model="radio2">
                                        <el-radio label="Y" border style="padding: 12px 60px 0 10px;margin-top:50px">Y
                                        </el-radio>
                                        <el-radio label="N" border style="padding: 12px 60px 0 10px;margin-top:50px">N
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                                <div>
                                    <el-radio-group v-model="radio3">
                                        <el-radio label="Y" border style="padding: 12px 60px 0 10px;margin-top:50px">Y
                                        </el-radio>
                                        <el-radio label="N" border style="padding: 12px 60px 0 10px;margin-top:50px">N
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                                <div>
                                    <el-radio-group v-model="radio4">
                                        <el-radio label="Y" border style="padding: 12px 60px 0 10px;margin-top:50px">Y
                                        </el-radio>
                                        <el-radio label="N" border style="padding: 12px 60px 0 10px;margin-top:50px">N
                                        </el-radio>
                                    </el-radio-group>
                                </div>
                            </el-radio-group>
                            <div v-for="(item, index) in getList" v-if="problem_type === '填空题'">
                                <el-input style="margin-top:12px" v-model.trim="input[index]" placeholder="请输入答案">
                                </el-input>
                            </div>
                            <div v-if="status === '2'" class="btns">
                                <el-button type="danger" style="margin-right: 22px;" @click="CatAnswer">查看题解</el-button>
                                <el-button type="primary" style="margin-left: 0px;" @click="nextProblem(getNextIndex)">
                                    {{ isLast ? "退出" : "下一题" }}</el-button>
                            </div>
                            <div v-if="status === '1'" class="btns">
                                <el-button type="danger" style="margin-right: 22px;" @click="CatAnswer">提交答案</el-button>
                            </div>
                        </div>
                    </div>

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { problem_identity, student_PractiseProblemDetail, student_UpProblemAnswer, image } from '../api'
import Cookie from 'js-cookie'
export default {
    data() {
        return {
            input: [],
            action: '',
            identity: '',
            prac_identity: '',// 练习的时候 上下两个变量反着来
            content: '',
            Key: '',
            answer: '',
            label: '',
            name: '',
            problem_type: '',
            knowledgeIdentity: '',
            radio: '', // 单选题填的答案
            radio1: '', // 判断题答案
            radio2: '', // 判断题答案
            radio3: '', // 判断题答案
            radio4: '', // 判断题答案
            imageSrc: '',
            status: '',
            isLast: false,
            getLists: [],
            problems: [], // 获取所有题目的列表
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.status = Cookie.get('status')
            console.log("接收到", this.$store.state.practice.problem_identity)
            console.log("接收到", Cookie.get('status'))
            this.identity = this.$store.state.practice.problem_identity; // 这个identity是答题页面这个题目本身的东西
            this.problems = this.$store.state.practice.problems;
            this.Problem_identity();

        },
        Problem_identity() {
            // 这个地方是获取本次答题信息的地方
            if (Cookie.get('status') === '2') {
                problem_identity({ params: { identity: this.identity } }).then(({ data }) => {
                    if (data.code === 200) {
                        this.content = data.data.content
                        this.Key = data.data.Key
                        this.answer = data.data.answer
                        this.label = data.data.Knowledge[0].name
                        this.name = data.data.name
                        this.knowledgeIdentity = data.data.Knowledge[0].identity // 这个题目属于哪一个知识点
                        this.problem_type = data.data.ProblemCategory.name
                        // 加载图片
                        console.log("不会没看是积极", this.content);
                        this.Image(this.content);
                        console.log("content:", data.data.content, "Key:", data.data.Key, "answer:", data.data.answer, "label:", data.data.Knowledge[0].name, "knowledgeIdentity:", data.data.Knowledge[0].identity, "problem_type:", data.data.ProblemCategory.name)
                        this.$message.success("获取题目详情成功")
                    } else {
                        this.$message.error("获取题目详情失败")
                    }
                });
            } else if (Cookie.get('status') === '1') {
                student_PractiseProblemDetail({
                    params: {
                        practiseIdentity: this.identity,
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.content = data.data.content
                        this.Key = data.data.Key
                        this.answer = data.data.answer
                        this.label = data.data.Knowledge[0].name
                        this.name = data.data.name
                        this.prac_identity = data.data.identity
                        this.knowledgeIdentity = data.data.Knowledge[0].identity // 这个题目属于哪一个知识点
                        this.problem_type = data.data.ProblemCategory.name
                        // 加载图片
                        console.log("不会没看是积极", this.content);
                        this.Image(this.content);
                        console.log("content:", data.data.content, "Key:", data.data.Key, "answer:", data.data.answer, "label:", data.data.Knowledge[0].name, "knowledgeIdentity:", data.data.Knowledge[0].identity, "problem_type:", data.data.ProblemCategory.name)
                        this.$message.success("获取题目详情成功")
                    } else {
                        this.$message.error("获取题目详情失败")
                    }
                });
            }
        },
        Image(content) {
            this.imageSrc = 'http://127.0.0.1:8087/image?url=' + content
            // image({ params: { url: content } }).then(({ data }) => {
            //     console.log("看看对象类型长啥样" + data)
            //     var binaryData = [];
            //     binaryData.push(data);
            //     this.imageSrc =  window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }))
            //     console.log("你来过是吧", this.imageSrc)
            // })
        },
        goback() {
            if (Cookie.get("status") === '2') {
                this.$router.push({ name: "knowledgelist", query: { knowledgeIdentity: this.knowledgeIdentity } })
            } else if (Cookie.get('status') === '1') {
                this.$store.commit('getProblem_identity', '') // 这里把题目id给取消掉
                this.$router.push({ name: "practice" })
            } else {
                console.log("返回个毛");
            }
        },
        nextProblem(index) {
            if (index === this.problems.length - 1) {
                this.isLast = true; // 判断此时是否为最后一个题目
            }
            if (index > this.problems.length - 1) {
                this.$router.push({ name: "knowledgelist", query: { knowledgeIdentity: this.knowledgeIdentity } })
            } else {
                this.radio = ''
                this.radio1 = ''
                this.radio2 = ''
                this.radio3 = ''
                this.radio4 = ''
                this.$store.commit('getProblem_identity', this.problems[index])
                this.identity = this.problems[index]
                this.Problem_identity();
                // this.$router.push({ name: "doproblem", query: { identity: this.problems[index] } })
            }
        },
        CatAnswer() {
            if (this.problem_type === '选择题') {
                // 提交题目
                this.Student_UpProblemAnswer(this.radio, this.identity, this.prac_identity)
                this.$router.push({ name: "answer", query: { problem_type: this.problem_type, Key: this.Key, answer: this.answer, identity: this.identity, radio: this.radio } })
            } else if (this.problem_type === '填空题') {

                this.Student_UpProblemAnswer(this.input.join(";"), this.identity, this.prac_identity)
                this.$router.push({ name: "answer", query: { problem_type: this.problem_type, Key: this.Key, answer: this.getLists, identity: this.identity, input: this.input } })
            } else if (this.problem_type === '判断题') {

                this.Student_UpProblemAnswer(this.radio1 + ";" + this.radio2 + ";" + this.radio3 + ";" + this.radio4, this.identity, this.prac_identity)
                this.$router.push({ name: "answer", query: { problem_type: this.problem_type, Key: this.Key, answer: this.getLists, identity: this.identity, radio1: this.radio1, radio2: this.radio2, radio3: this.radio3, radio4: this.radio4 } })
            } else {
                console.log("什么题型都不是")
            }
        },
        Student_UpProblemAnswer(answer, practiseIdentity, problem_identity) {
            if (Cookie.get('status') === '1') {
                student_UpProblemAnswer({
                    "answer": answer,
                    "practiseIdentity": practiseIdentity,
                    "problem_identity": problem_identity
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.$message.success("题目提交成功")
                    } else {
                        this.$message.error("题目提交失败")
                    }
                });
            }
        }
    },
    computed: {
        getNextIndex() {
            console.log("fuick", this.problems.findIndex(item => item === this.identity) + 1);
            return this.problems.findIndex(item => item === this.identity) + 1;
        },
        getList() {
            if (this.problem_type === '填空题' || this.problem_type === '判断题') {
                var list = this.answer.split("；");// 传给答题页面的时候就是不一样了，就不是字符串了，是数组
                this.getLists = list;
                if (this.getLists.length <= 1) {
                    list = this.answer.split(";");
                    this.getLists = list;
                }
                console.log("answer", this.answer);
                return list;
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
                margin-left: 630px;
            }
        }

        .el-container {
            background-color: #E9EEF3;
            color: #333;
            text-align: center;

            .main {
                height: 521px;
                display: flex;

                .Problem {
                    width: 718px;
                    margin-left: 20px;
                }

                .radios {
                    width: 30%;

                    .btns {
                        margin-left: 232px;
                        margin-top: 60px;
                        display: flex;
                    }

                    .chose {
                        .div {
                            display: flex;
                        }
                    }
                }
            }


            .el-aside {
                border-right: 1px dashed;

                .tags {
                    height: 47px;
                }
            }
        }
    }
}
</style>