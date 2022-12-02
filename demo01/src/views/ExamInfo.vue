<template>
    <div class="examinfo">
        <el-container>
            <el-header style="height: 55px;">
                <i class="el-icon-back" style="margin-left: 63px;font-size: 42px;" @click="goback"></i>
                <span class="class">考试信息</span>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <h1>考试信息</h1>
                    <h2>{{ name }}</h2>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <h2>{{ StartAt }}</h2>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <h2>{{ Duration }}</h2>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <el-button v-if="publish === 0" type="danger" size="small" class="blueBug" @click="change">
                        修改考试信息
                    </el-button>
                </el-aside>
                <el-main>
                    <div class="tableBar">
                        <el-button type="primary" size="small" class="blueBug" @click="AddProblem">
                            增加题目
                        </el-button>
                        <el-input size="mini" v-model="input" style="width: 250px;padding-left: 0%;" clearable
                            @keyup.enter.native="handleQuery">
                            <i slot="suffix" class="el-input__icon el-icon-search"
                                style="cursor: pointer; margin-left: 53px;" @click="handleQuery"></i>
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
                        <el-table-column label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <el-button type="primary" size="small" class="blueBug" @click="DelProblem(scope.row)">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pageList" :page-sizes="[6, 10, 20, 30]" :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper" :total="counts" :current-page.sync="page"
                        @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>

                </el-main>
            </el-container>
            <el-dialog :title="classData.title" :visible.sync="classData.dialogVisible" width="30%"
                :before-close="handleClose">
                <el-form class="demo-form-inline" label-width="100px">
                    <el-form-item label="考试时间">
                        <el-col :span="11">
                            <el-date-picker v-model="dataForm.date" type="date" placeholder="选择日期" style="width: 100%;"
                                value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </el-col>
                        <el-col class="line" :span="2">---</el-col>
                        <el-col :span="11">
                            <el-time-picker v-model="dataForm.time" placeholder="选择时间" style="width: 100%; "
                                value-format="HH:mm:ss">
                            </el-time-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="考试时长">
                        <!-- <el-input v-model="classData.duration" placeholder="单行输入" maxlength="14" /> -->
                        <el-time-picker format="HH:mm" v-model="classData.duration" placeholder="选择时间"
                            style="width: 100%;">
                        </el-time-picker>
                    </el-form-item>
                    <el-form-item label="考试名称">
                        <el-input v-model="classData.name" placeholder="单行输入" maxlength="14" />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="classData.dialogVisible = false">取 消</el-button>
                    <el-button type="danger" size="medium" class="continue" @click="Teacher_Exam_Put">
                        保存</el-button>
                </span>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { teacher_Exam_identity, teacher_ExamProblem_Delete, teacher_Exam_Put, teacher_ExamProblem } from '../api'
import { publicMethod } from '../utils/public/datechange'
export default {
    data() {
        return {
            name: '',
            StartAt: '',
            Duration: '',
            publish: 0,
            input: '',
            counts: 0,
            page: 1,
            pageSize: 6,
            tableData: [],
            problem_identities: '',
            identity: '',
            isSearch: false,
            classData: {
                'title': '添加考试',
                'dialogVisible': false,
                'duration': '',
                'name': ''
            },
            dataForm: {
                'date': '',
                'time': ''
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            console.log("接收到", this.$route.query.identity)
            this.identity = this.$route.query.identity;
            this.Teacher_Exam_identity();
            this.Teacher_ExamProblem();
        },
        Teacher_Exam_Put() {
            console.log("日期", this.dataForm.date)
            console.log("时间", this.dataForm.time)
            var duration = new Date(this.classData.duration);
            duration = (duration.getHours() * 60 * 60 + duration.getMinutes() * 60) * 1000000000
            teacher_Exam_Put({
                startAt: this.dataForm.date + "T" + this.dataForm.time + ".886" + "+08:00",
                duration: duration,
                exam_identity: this.identity,
                name: this.classData.name
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.classData.dialogVisible = false
                    this.Teacher_Exam_identity()
                    this.$message.success("修改成功")
                } else if (data.code === 403) {
                    this.classData.dialogVisible = false
                    this.Teacher_Exam_identity()
                    this.$message.error("修改失败")
                }
            })
        },
        Teacher_Exam_identity() {
            // 这个地方是获取考试题目的信息
            teacher_Exam_identity({ params: { identity: this.identity } }).then(({ data }) => {
                if (data.code === 200) {
                    this.name = data.data.name;
                    this.StartAt = new Date(data.data.StartAt).toLocaleString();
                    this.Duration = Number((data.data.Duration / 1000000000) / 3600).toFixed(2) + "h"
                    this.publish = data.data.publish
                    this.$message.success("获取班级详情成功")
                } else {
                    this.$message.error("获取班级详情失败")
                }
            });
        },
        Teacher_ExamProblem() {
            if (this.isSearch) {
                teacher_ExamProblem({
                    params: {
                        examIdentity: this.identity,
                        page: this.page,
                        pageSize: this.pageSize,
                        keyWord: this.input
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.tableData = data.data.list
                        this.counts = data.data.total
                        this.$message.success("获取老师考试列表成功")
                    } else {
                        this.$message.error("获取老师考试列表失败")
                    }
                });
            } else {
                teacher_ExamProblem({
                    params: {
                        examIdentity: this.identity,
                        page: this.page,
                        pageSize: this.pageSize,
                    }
                }).then(({ data }) => {
                    if (data.code === 200) {
                        this.tableData = data.data.list
                        this.counts = data.data.total
                        this.$message.success("获取老师考试列表成功")
                    } else {
                        this.$message.error("获取老师考试列表失败")
                    }
                });
            }

        },
        // 添加考试题目
        AddProblem() {
            this.$store.commit('addProblems', this.identity)
            this.$router.push({ name: "knowledge" })
        },
        DelProblem(row) {
            this.problem_identities = row.identity;
            this.Teacher_ExamProblem_Delete()
        },
        // 删除考试题目
        Teacher_ExamProblem_Delete() {
            teacher_ExamProblem_Delete(
                {
                    params: {
                        examIdentity : this.identity,
                        problemIdentity : this.problem_identities
                    }
                }
            ).then(({ data }) => {
                if (data.code === 200) {
                    this.Teacher_ExamProblem();
                    this.$message.success("删除考试题目成功")
                } else {
                    this.$message.error("删除考试题目失败")
                }
            });
        },
        handleQuery() {
            this.isSearch = true;
            this.Teacher_ExamProblem();
        },
        indexMethod(index) {
            return index * 1 + 1;
        },
        AddHandle() {

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
        goback() {
            this.$router.go(-1)
        },
        change() {
            this.classData.dialogVisible = true
        },
        EditHandle() {

        },
        getTimestamp(time) {
            return publicMethod.getTimestamp(time)
        }
    },
}
</script>
<style lang="less" scoped>
.examinfo {

    .el-container {
        .el-header {
            background-color: #B3C0D1;
            color: #333;

            .class {
                font-size: 30px;
                margin-left: 567px;
            }
        }

        .el-container {
            .el-main {
                background-color: #E9EEF3;
                color: #333;
                text-align: center;
                height: 586px;

                .tableBar {
                    width: 40%;
                    margin-left: 718px;
                    margin-bottom: 12px;

                    .el-input {
                        padding-left: 0px;
                        margin-left: 53px;
                    }
                }

                .el-pagination {
                    margin: 12px 0px 12px 700px;
                }
            }

            .el-aside {
                background-color: #E9EEF3;
                color: #333;
                text-align: center;
                border-right: 1px dashed;
            }
        }
    }
}
</style>