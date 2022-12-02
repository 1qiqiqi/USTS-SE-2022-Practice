<template>
    <el-container>
        <el-header style="height: 80px;">
            <div>
                <i class="el-icon-close" style="margin-left: 63px;font-size: 32px;" @click="goback"></i>
            </div>
            <span class="class">错题名称</span>
        </el-header>
        <el-container>
            <el-main style="width:49%">
                <div class="content" style="height:450px;border-right-style:solid;">
                    <div class="image">
                        <el-image :src="imageSrc1"></el-image>
                    </div>
                    <h1>你的答案: {{ wrong_answer }}</h1>
                    <h1>正确答案: {{ answer }}</h1>
                </div>
            </el-main>
            <el-main style="width:49%">
                <div class="key" style="height:450px;">
                    <div class="image">
                        <el-image :src="imageSrc2"></el-image>
                    </div>
                </div>
            </el-main>
        </el-container>
        <el-footer>
            <div>
                <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                <div class="btns">
                    <el-button type="danger" style="margin-right: 55px;" @click="changeProblem(getNextIndex)">
                    修改</el-button>
                <el-button type="primary" style="" @click="goback">
                    退出</el-button>
                </div>
            </div>
        </el-footer>
    </el-container>
</template>

<script>
import { student_WrongProblem_identity } from "../api";
export default {
    data() {
        return {
            identity: '',
            imageSrc1: '',
            imageSrc2: '',
            content: '',
            Key: '',
            answer: '',
            wrong_answer: ''
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.identity = this.$store.state.practice.problem_identity
            this.Student_WrongProblem_identity();
        },
        Student_WrongProblem_identity() {
            student_WrongProblem_identity({ params: { identity: this.identity } }).then(({ data }) => {
                if (data.code === 200) {
                    this.content = data.data.Problem.content
                    this.Key = data.data.Problem.Key
                    this.answer = data.data.Problem.answer
                    this.wrong_answer = data.data.wrong_answer
                    // 加载图片
                    console.log("不会没看是积极", this.content);
                    this.Image(this.content, this.Key);
                    this.$message.success("获取题目详情成功")
                } else {
                    this.$message.error("获取题目详情失败")
                }
            });
        },
        Image(content, key) {
            this.imageSrc1 = 'http://127.0.0.1:8087/image?url=' + content
            this.imageSrc2 = 'http://127.0.0.1:8087/image?url=' + key
            // image({ params: { url: content } }).then(({ data }) => {
            //     console.log("看看对象类型长啥样" + data)
            //     var binaryData = [];
            //     binaryData.push(data);
            //     this.imageSrc =  window.URL.createObjectURL(new Blob(binaryData, { type: "application/zip" }))
            //     console.log("你来过是吧", this.imageSrc)
            // })
        },
        goback() {
            this.$store.commit('getProblem_identity','')
            this.$router.push({ name: "wrong" })
        },
        changeProblem() {

        }
    }
}
</script>
<style lang="less" scoped>
.el-header {
    background-color: #B3C0D1;
    color: #333;

    .class {
        font-size: 30px;
        margin-left: 630px;
    }
}
.btns {
    margin-left: 1100px;
}
</style>