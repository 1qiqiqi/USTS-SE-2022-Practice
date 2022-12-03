<template>
    <div class="ExamPaperInfo">
        <el-container>
            <el-header style="height: 80px;">
                <div>
                    <i class="el-icon-close" style="margin-left: 63px;font-size: 32px;" @click="goback"></i>
                </div>
                <div style="display:flex">
                    <span class="class">题目名称</span>
                    <p v-if="IntoStatus === '进入考试'"
                        style="margin-left: 370px;font-size: 24px;font-weight: bolder;color: black;">{{ "剩余时间: " }}</p>
                    <p v-if="IntoStatus === '进入考试'" style="font-size: 24px;">{{ (Hours < 10 ? "0" + Hours : Hours) + ":"
                    }}</p>
                            <p v-if="IntoStatus === '进入考试'" style="font-size: 24px;">{{ (Minutes < 10 ? "0" + Minutes :
                                    Minutes) + ":"
                            }}</p>
                                    <p v-if="IntoStatus === '进入考试'" style="font-size: 24px;">{{ (Secondss < 10 ? "0" +
                                            Secondss : Secondss)
                                    }}</p>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <div class="tags">
                        <span>选择题</span>
                        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                        <div class="chose">
                            <el-tag :body-style="{ display: 'flex', padding: 0 }"
                                v-for="(item, index) in isChoseProblem" @click="findProblem(item)" :key="item.identity"
                                effect="plain">
                                {{ index }}
                            </el-tag>
                        </div>
                        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                        <span>判断题</span>
                        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                        <div class="judge">
                            <el-tag v-for="(item, index) in isJudgeProblem" @click="findProblem(item)"
                                :key="item.identity" effect="plain">
                                {{ index }}
                            </el-tag>
                        </div>
                        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                        <span>填空题</span>
                        <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                        <div class="fill">
                            <el-tag v-for="(item, index) in isFillProblem" @click="findProblem(item)"
                                :key="item.identity" effect="plain">
                                {{ index }}
                            </el-tag>
                        </div>
                    </div>
                </el-aside>
                <el-main>
                    <div class="main">
                        <div class="Problem">
                            <div class="image">
                                <el-image :src="imageSrc"></el-image>
                            </div>
                        </div>
                        <div v-if="IntoStatus === '进入考试'" class="radios">
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
                            <div class="btns">
                                <el-button type="primary" style="margin-left: 0px;" @click="nextProblem(getNextIndex)">
                                    {{ isLast ? "提交" : "下一题" }}</el-button>
                            </div>
                        </div>
                        <div v-if="IntoStatus === '查看考试'" class="radios">
                            <h1>你的答案: {{ MyAnswer }}</h1>
                            <h1>正确答案: {{ answer }}</h1>
                            <div class="btns">
                                <el-button type="primary" style="margin-left: 0px;" @click="nextProblem(getNextIndex)">
                                    {{ isLast ? "退出" : "下一题" }}</el-button>
                            </div>
                        </div>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>



<script>
import { student_ExamPaper_get, student_ExamPaper_put, student_ExamProblem } from '../../api'
import { publicMethod } from '../../utils/public/datechange'
export default {
    data() {
        return {
            action: '',
            identity: '',
            IntoStatus: '',
            problem_identity: '',
            content: '',
            answer: '',
            name: '',
            problem_type: '',
            radio: '', // 单选题填的答案
            radio1: '', // 判断题答案
            radio2: '', // 判断题答案
            radio3: '', // 判断题答案
            radio4: '', // 判断题答案
            input: [],// 填空题答案
            imageSrc: '',
            isLast: false,
            getLists: [], // 获取答案数量的
            problems: [], // 获取所有题目
            yourAnswer: [],
            Seconds: 0,
            Hours: 0,
            Minutes: 0,
            Secondss: 0,
            timer: '', // 计时器对象
            MyAnswer: '',
            isStart: true,
            problem_index: 0

        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.identity = this.$route.query.identity; // 这个identity是考试标识
            this.IntoStatus = this.$route.query.IntoStatus;
            this.isStart = this.$store.state.examId.isStart;
            this.problem_index = this.$store.state.examId.problem_index
            this.yourAnswer = this.$store.state.examId.yourAnswer
            // console.log("接受到", this.$store.state.examId.problem_index);
            // console.log("接受到： ", this.$store.state.examId.isStart);
            // console.log("接受到答案： ", this.$store.state.examId.yourAnswer);
            if (this.$route.query.IntoStatus === '查看考试') {
                this.Student_ExamPaper_get()
            } else if (this.$route.query.IntoStatus === '进入考试') {
                // 这里加一个倒计时
                this.Seconds = (this.getTimestamp(this.$route.query.StartAt) + this.getTimestamp(this.$route.query.Duration / 1000000000) * 1000 - new Date().getTime()) / 1000
                this.Student_ExamProble();
                this.CountSeconds();
            } else {
                console.log("没天理了");
            }
        },
        CountSeconds() {
            //考试倒计时
            //console.log(this.Time);
            //定时器计算考试剩余 时间
            this.timer = setInterval(() => {
                this.Seconds = this.Seconds - 1;
                // console.log("还剩：" + this.Seconds);
                if (this.Seconds != null && this.Seconds > 0) {
                    //获取考试剩余 天数 小时 分钟 秒数
                    this.Hours = parseInt(this.Seconds % (24 * 3600) / 3600);
                    this.Minutes = parseInt(this.Seconds % (3600) / 60);
                    this.Secondss = parseInt(this.Seconds % (60));
                    // console.log("Hours: " + this.Hours, "Minutes: " + this.Minutes, "Secondss: ", this.Secondss);
                } else {
                    clearInterval(this.timer);
                    //考试结束，提交试卷
                    // console.log("提交试卷");
                    this.Student_ExamPaper_put(this.identity, this.yourAnswer)
                    this.$store.commit('getIsStart', true)
                    this.$router.push({ name: "exam" })
                }
            }, 1000);
        },
        Student_ExamProble() {
            student_ExamProblem({
                params: {
                    examIdentity: this.identity,
                }
            }).then(({ data }) => {
                if (data.code === 200) {
                    var result = []
                    this.problems = data.data.list;
                    // 目的很简单,就是实现题目顺序按照标签来
                    this.problems.filter(item => item.ProblemCategory.name === '选择题').forEach((item) => {
                        result.push(item)
                    })
                    this.problems.filter(item => item.ProblemCategory.name === '判断题').forEach((item) => {
                        result.push(item)
                    })
                    this.problems.filter(item => item.ProblemCategory.name === '填空题').forEach((item) => {
                        result.push(item)
                    })
                    this.problems = result
                    console.log("what happened", result);
                    console.log(this.problems);
                    console.log(data.data.list);
                    if (this.isStart && this.problem_index === '') {
                        this.getProblem(0)
                        this.$store.commit('getIsStart', false)
                    } else {
                        this.getProblem(this.problem_index)
                    }
                    // this.$message.success("获取学生考试题目成功")
                } else {
                    this.$message.error("获取学生考试题目失败")
                }
            });
        },
        Student_ExamPaper_get() {
            student_ExamPaper_get({
                params: {
                    examIdentity: this.identity,
                }
            }).then(({ data }) => {
                if (data.code === 200) {
                    var result = []
                    this.problems = data.data.list;
                    // 目的很简单,就是实现题目顺序按照标签来
                    this.problems.filter(item => item.ProblemCategory.name === '选择题').forEach((item) => {
                        result.push(item)
                    })
                    this.problems.filter(item => item.ProblemCategory.name === '判断题').forEach((item) => {
                        result.push(item)
                    })
                    this.problems.filter(item => item.ProblemCategory.name === '填空题').forEach((item) => {
                        result.push(item)
                    })
                    this.problems = result
                    if (this.isStart && this.problem_index === '') {
                        this.getProblem(0)
                        this.$store.commit('getIsStart', false)
                    } else {
                        this.getProblem(this.problem_index)
                    }
                    // this.$message.success("查看学生考试题目成功")
                } else {
                    this.$message.error("查看学生考试题目失败")
                }
            });
        },
        getProblem(index) {
            if (this.IntoStatus === '进入考试') {
                this.$store.commit('getIsStart', false)
                this.problem_type = this.problems[index].ProblemCategory.name
                this.problem_identity = this.problems[index].identity
                this.content = this.problems[index].content
                this.answer = this.problems[index].answer
                this.Image(this.problems[index].content)
            } else if (this.IntoStatus === '查看考试') {
                this.$store.commit('getIsStart', false)
                this.problem_type = this.problems[index].ProblemCategory.name
                this.problem_identity = this.problems[index].identity
                this.content = this.problems[index].content
                this.answer = this.problems[index].answer
                this.MyAnswer = this.problems[index].MyAnswer
                this.Image(this.problems[index].content)
            }
        },
        Student_ExamPaper_put(exam_identitys, exam_paper_problemss) {
            student_ExamPaper_put({
                exam_identity: exam_identitys,
                exam_paper_problems: exam_paper_problemss
            }).then(({ data }) => {
                if (data.code === 200) {
                    clearInterval(this.timer);
                    // this.$message.success("答案提交成功")
                } else {
                    this.$message.error("答案提交失败")
                }
            });
        },
        nextProblem(index) {
            console.log("第几个题目了？",index);
            if (index === (this.problems.length - 1)) {
                if (this.IntoStatus === '查看考试') {
                    this.problem_index = index
                    this.getProblem(index)
                    this.$store.commit('getExamProblem', index)
                    this.isLast = true; // 判断此时是否为最后一个题目
                } else if (this.IntoStatus === '进入考试') {
                    this.Submit()  // 这个是提交的上一题的答案
                    this.problem_index = index
                    this.getProblem(index)
                    this.$store.commit('getExamProblem', index)
                    this.isLast = true; // 判断此时是否为最后一个题目
                }
            } else if (index > (this.problems.length - 1)) {
                if (this.IntoStatus === '查看考试') {
                    this.$store.commit('getIsStart', true)
                    this.$store.commit('getExamProblem', 0)
                    this.$router.push({ name: "exam" })
                } else if (this.IntoStatus === '进入考试') {
                    this.Submit()  // 这个是提交的上一题的答案
                    this.$confirm('即将结束答题, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then((action) => {
                        // eleUI的确定结束回调函数方法
                        if (action === 'confirm') {
                            this.Student_ExamPaper_put(this.identity, this.yourAnswer)
                            this.$store.commit('getIsStart', true)
                            this.$store.commit('getExamProblem', 0)
                            this.$router.push({ name: "exam" })
                        }
                        this.$message({
                            type: 'success',
                            message: '交卷成功!'
                        });
                    }).catch(() => {
                        // 点击取消后
                        this.$message({
                            type: 'info',
                            message: '已取消交卷'
                        });
                    });
                }
            } else {
                if (this.IntoStatus === '查看考试') {
                    this.problem_index = index
                    this.getProblem(index)
                    this.$store.commit('getExamProblem', index)
                } else if (this.IntoStatus === '进入考试') {
                    this.Submit()  // 这个是提交的上一题的答案
                    this.radio = ''
                    this.radio1 = ''
                    this.radio2 = ''
                    this.radio3 = ''
                    this.radio4 = ''
                    this.input = []
                    this.problem_index = index
                    this.getProblem(index)
                    this.$store.commit('getExamProblem', index)
                }
            }
        },
        Submit() {
            console.log("yourAnswer:",this.yourAnswer);
            if (this.problem_type === '选择题') {
                // 提交题目到数组
                let isHas = false  // 修改答案
                for (var i = 0; i < this.yourAnswer.length; i++) {
                    if (this.yourAnswer[i].problem_identity === this.problem_identity) {
                        this.yourAnswer[i].answer = this.radio
                        isHas = true
                    }
                }
                if (!isHas) {
                    this.yourAnswer.push({
                        "answer": this.radio,
                        "problem_identity": this.problem_identity
                    })
                }
                this.$store.commit('getyourAnswer', this.yourAnswer)
            } else if (this.problem_type === '填空题') {
                // 提交题目到数组
                let isHas = false
                for (var i = 0; i < this.yourAnswer.length; i++) {
                    if (this.yourAnswer[i].problem_identity === this.problem_identity) {
                        this.yourAnswer[i].answer = this.input.join(";")
                        isHas = true
                    }
                }
                if (!isHas) {
                    this.yourAnswer.push({
                        "answer": this.input.join(";"),
                        "problem_identity": this.problem_identity
                    })
                }
                this.$store.commit('getyourAnswer', this.yourAnswer)
            } else if (this.problem_type === '判断题') {
                // 提交题目到数组
                let isHas = false
                for (var i = 0; i < this.yourAnswer.length; i++) {
                    if (this.yourAnswer[i].problem_identity === this.problem_identity) {
                        this.yourAnswer[i].answer = this.radio1 + ";" + this.radio2 + ";" + this.radio3 + ";" + this.radio4
                        isHas = true
                    }
                }
                if (!isHas) {
                    this.yourAnswer.push({
                        "answer": this.radio1 + ";" + this.radio2 + ";" + this.radio3 + ";" + this.radio4,
                        "problem_identity": this.problem_identity
                    })
                }
                this.$store.commit('getyourAnswer', this.yourAnswer)
            }
        },
        getTimestamp(time) {
            return publicMethod.getTimestamp(time)
        },
        findProblem(item) {
            // 还原
            if (this.IntoStatus === '进入考试') {
                this.radio = ''
                this.radio1 = ''
                this.radio2 = ''
                this.radio3 = ''
                this.radio4 = ''
                this.input = []
                this.problem_type = item.ProblemCategory.name
                this.problem_identity = item.identity
                this.content = item.content
                this.answer = item.answer
                this.Image(item.content)
                this.$store.commit('getExamProblem', this.problems.findIndex(problem => problem.identity === item.identity))
                console.log("上面死啊说得好",this.problems.findIndex(problem => problem.identity === item.identity));
                this.problem_index = this.problems.findIndex(problem => problem.identity === item.identity)
                if (this.problems.findIndex(problem => problem.identity === item.identity) === this.problems.length - 1) {
                    this.isLast = true;
                } else {
                    this.isLast = false;
                }
            } else if (this.IntoStatus === '查看考试') {
                this.problem_type = item.ProblemCategory.name
                this.problem_identity = item.identity
                this.content = item.content
                this.answer = item.answer
                this.MyAnswer = item.MyAnswer
                this.Image(item.content)
                this.problem_index = this.problems.findIndex(problem => problem.identity === item.identity)
                this.$store.commit('getExamProblem', this.problems.findIndex(problem => problem.identity === item.identity))
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
            this.problem_index = 0
            this.$store.commit('getIsStart', true)
            clearInterval(this.timer);
            this.$router.push({ name: "exam" })
        },
    },
    computed: {
        isChoseProblem() {
            return this.problems.filter(item => item.ProblemCategory.name === '选择题')
        },
        isJudgeProblem() {
            return this.problems.filter(item => item.ProblemCategory.name === '判断题')
        },
        isFillProblem() {
            return this.problems.filter(item => item.ProblemCategory.name === '填空题')
        },
        getNextIndex() {
            return this.problem_index + 1;
        },
        getList() {
            if (this.problem_type === '填空题' || this.problem_type === '判断题') {
                var list = this.answer.split("；");// 传给答题页面的时候就是不一样了，就不是字符串了，是数组
                this.getLists = list;
                if (this.getLists.length <= 1) {
                    list = this.answer.split(";");
                    this.getLists = list;
                }
                return list;
            }
        }
    }
}
</script>

<style lang="less" scoped>
.ExamPaperInfo {
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

                    .chose {
                        display: flex;
                        flex-wrap: wrap;

                        .el-tag {
                            margin-left: 8px;
                            width: 40px;
                        }
                    }

                    .judge {
                        display: flex;
                        flex-wrap: wrap;

                        .el-tag {
                            margin-left: 8px;
                            width: 40px;
                        }
                    }

                    .fill {
                        display: flex;
                        flex-wrap: wrap;

                        .el-tag {
                            margin-left: 8px;
                            width: 40px;
                        }
                    }
                }
            }

        }
    }
}
</style>