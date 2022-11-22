<template>
    <div class="knowledgelist">
        <div class="tableBar">
            <!-- 下面这个组件更是轻量级 -->
            <el-popover placement="top" width="160" v-model="visible">
                <p>已选题数： {{ problem_identities.length }}</p>
                <p>已选分值： {{ Totalscores }}</p>
                <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="showAnother">确定</el-button>
                </div>
            </el-popover>

            <el-popover placement="top" width="160" v-model="visible1">
                <p>已选分值</p>
                <p>{{ Totalscores }}</p>
                <div style="text-align: right; margin: 0">
                    <el-button type="danger" size="mini" @click="submit">完成</el-button>
                </div>
            </el-popover>

            <el-button v-if="isChoosed" type="danger" size="small" class="blueBug" style="margin-right: 10px;"
                @click="finish">
                完成选题
            </el-button>
            <el-input size="mini" v-model="input" style="width: 250px;padding-left: 0%;" clearable
                @keyup.enter.native="handleQuery">
                <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer; margin-left: 53px;"
                    @click="handleQuery"></i>
            </el-input>
        </div>
        <el-table :data="tableData" stripe class="tableBox" :header-cell-style="{ 'text-align': 'center' }"
            :cell-style="{ 'text-align': 'center' }">
            <el-table-column :index="indexMethod" type="index" width="140" label="序号">
            </el-table-column>
            <el-table-column prop="name" label="名称">
            </el-table-column>
            <el-table-column prop="ProblemCategory.name" label="类型">
            </el-table-column>
            <el-table-column prop="score" label="分值"></el-table-column>
            <el-table-column v-if="exam_identity != ''" label="操作" width="180" align="center">
                <template slot-scope="scope">
                    <el-button type="primary" size="small" @click="AddPaper(scope.row)"> 加入试卷 </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :pager-count="3" class="pageList" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next,jumper" :total="counts" :current-page.sync="page"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>
<script>
import { teacher_Problem, teacher_ExamProblem_post } from '../api'
export default {
    data() {
        return {
            loading: false,
            input: '',
            isSearch: false,
            counts: 0,
            page: 1,
            pageSize: 5,
            isChoosed: false,
            tableData: [],
            visible: false,
            visible1: false,
            exam_identity: '', // 老师选题需要的exam_identity
            identity: '', // 这个其实是那个知识点类型identity
            problem_identities: [],
            scores: [],
            classData: {
                'title': '添加考试',
                'dialogVisible': false,
                'duration': '',
                'name': ''
            },
        }
    },
    created() {
        this.init()
    },
    computed: {
        Totalscores() {
            var total = 0;
            this.scores.forEach((item) => {
                total += item;
            })
            return total;
        }
    },
    methods: {
        init() {
            console.log("接收到", this.$route.query.knowledgeIdentity)
            if (this.$store.state.examId.exam_identity) {
                this.exam_identity = this.$store.state.examId.exam_identity
            }
            this.identity = this.$route.query.knowledgeIdentity;
            this.Teacher_Problem()
        },
        submit() {
            teacher_ExamProblem_post({
                exam_identity: this.exam_identity,
                problem_identities: this.problem_identities
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.$message.success("添加考试题目成功")
                    this.$router.push({ name: "examinfo", query: { identity: this.exam_identity } })
                    this.exam_identity = ''; // 复原
                } else {
                    this.$message.error("添加考试题目失败")
                }
                this.visible1 = false;
            });
        },
        Teacher_Problem() {
            if (this.isSearch) {
                teacher_Problem({
                    params: {
                        knowledgeIdentity: this.identity,
                        page: this.page,
                        pageSize: this.pageSize,
                        keyWord: this.input
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.tableData = data.data.list
                        this.counts = data.data.total
                        this.$message.success("获取考试题目成功")
                    } else {
                        this.$message.error("获取考试题目失败")
                    }
                });
            } else {
                teacher_Problem({
                    params: {
                        knowledgeIdentity: this.identity,
                        page: this.page,
                        pageSize: this.pageSize,
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.tableData = data.data.list
                        this.counts = data.data.total
                        this.$message.success("获取考试题目成功")
                    } else {
                        this.$message.error("获取考试题目失败")
                    }
                });
            }
        },
        AddPaper(row) {
            this.isChoosed = true
            this.problem_identities.push(row.identity)
            this.scores.push(row.score)
        },
        showAnother() {
            this.visible = false;
            this.isChoosed = false;
            this.visible1 = true;
        },
        finish() {
            this.visible = true;
            this.isChoosed = false;
        },
        handleQuery() {
            this.isSearch = true;
            this.Teacher_Problem();
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.init()
        },
        handleCurrentChange(val) {
            this.page = val
            this.init()
        },
        // 关闭弹窗
        handleClose(st) {
            this.classData.dialogVisible = false
        },
        indexMethod(index) {
            return index * 1 + 1;
        }
    }
}
</script>
<style lang="less" scoped>
.knowledgelist {
    .tableBar {
        width: 40%;
        margin-left: 818px;
    }

    .el-pagination {
        margin: 12px 0px 12px 700px;
    }
}
</style>