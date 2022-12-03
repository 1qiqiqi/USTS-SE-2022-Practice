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
            <el-table-column label="名称">
                <template slot-scope="scope">
                    <el-button type="text" @click="CatHandle(scope.row)">
                        {{scope.row.name}}
                    </el-button>
                </template>
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
        <el-pagination  class="pageList" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
            layout="total, sizes, prev, pager, next,jumper" :total="counts" :current-page.sync="page"
            @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
    </div>
</template>
<script>
import { teacher_Problem, teacher_ExamProblem_post } from '../../api'
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
            problems: [],
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
            classIdentity: ''
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
            // console.log("接收到", this.$route.query.knowledgeIdentity)
            // console.log("接收到exam_identity:", this.$store.state.examId.exam_identity)
            if (this.$store.state.examId.exam_identity) {
                this.exam_identity = this.$store.state.examId.exam_identity
            }
            this.identity = this.$route.query.knowledgeIdentity;
            if(this.$route.query.classIdentity) {
                this.classIdentity = this.$route.query.classIdentity;
            }
            this.Teacher_Problem()
        },
        submit() {
            teacher_ExamProblem_post({
                exam_identity: this.exam_identity,
                problem_identities: this.problem_identities
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.$message.success("添加考试题目成功")
                    // store中examid的数据要删除
                    this.$store.commit('addProblems', '')
                    this.$router.push({ name: "examinfo", query: { identity: this.exam_identity, classIdentity: this.classIdentity} })
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
                        this.tableData = data.data.list;
                        this.counts = data.data.total
                        // this.$message.success("获取考试题目成功")
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
                        this.getAllproblems()
                        // this.$message.success("获取考试题目成功")
                    } else {
                        this.$message.error("获取考试题目失败")
                    }
                });
            }
        },
        getAllproblems() {
            teacher_Problem({
                    params: {
                        knowledgeIdentity: this.identity,
                        page: this.page,
                        pageSize: this.counts,
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                         // 需要处理一下数据 ，只获取这个知识点的题目的identitys
                        var problems = data.data.list.map(item => item.identity);
                        this.$store.commit('getProblems',problems)
                        // this.$message.success("题库存储成功")
                    } else {
                        this.$message.error("题库存储失败")
                    }
                });
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
        CatHandle(row) {
            this.$store.commit('getProblem_identity',row.identity)
            this.$router.push({ name: "doproblem"})
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