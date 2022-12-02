<template>
    <div class="examlist">
        <el-container>
            <el-header style="height: 55px;">
                <i class="el-icon-back" style="margin-left: 63px;font-size: 42px;" @click="goback"></i>
                <span class="class">考试列表</span>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <h1>班级信息</h1>
                    <h2>{{ name }}</h2>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <h2>{{ student_number + "人" }}</h2>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <h2>{{ join_code }}</h2>
                    <hr style="height:1px;border:none;border-top:1px solid #555555;" />
                    <el-button type="danger" size="small" class="blueBug" @click="Teacher_Class_put">
                        修改班级代码
                    </el-button>
                </el-aside>
                <el-main>
                    <div class="tableBar">
                        <el-button type="primary" size="small" class="blueBug" @click="AddHandle">
                            添加考试
                        </el-button>
                        <el-input size="mini" v-model="input" style="width: 250px;padding-left: 0%;" clearable
                            @keyup.enter.native="handleQuery">
                            <i slot="suffix" class="el-input__icon el-icon-search"
                                style="cursor: pointer; margin-left: 53px;" @click="handleQuery"></i>
                        </el-input>
                    </div>
                    <el-table :data="tableData" stripe class="tableBox" :header-cell-style="{ 'text-align': 'center' }"
                        :cell-style="{ 'text-align': 'center' }">
                        <el-table-column prop="CreatedAt" label="日期"><template slot-scope="scope">{{ scope.row.CreatedAt
                                | dateFormat
                        }}</template></el-table-column>
                        <el-table-column prop="name" label="考试">
                            <template slot-scope="scope">
                                <el-button type="text" @click="CatExamInfo(scope.row)">{{ scope.row.name }}</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="Duration" label="时长">
                            <template slot-scope="scope">
                                <span>{{ Number((scope.row.Duration / 1000000000) / 3600).toFixed(2) + "小时" }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="total_score" label="分值"></el-table-column>
                        <el-table-column label="考试状态" width="280" align="center">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.publish === 0" type="danger" size="small" class="blueBug"
                                    @click="Teacher_PublishExam(scope.row)">
                                    发布
                                </el-button>
                                <span v-if="scope.row.publish === 1">{{ getStatus(scope.row.StartAt, scope.row.Duration)
                                }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination class="pageList" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
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
                        <el-input v-model="classData.name" placeholder="单行输入" maxlength="34" />
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button size="medium" @click="classData.dialogVisible = false">取 消</el-button>
                    <el-button type="primary" size="medium" class="continue" @click="Teacher_Exam_post">
                        保存</el-button>
                </span>
            </el-dialog>
        </el-container>
    </div>
</template>

<script>
import { teacher_Class_identity, teacher_Exam, teacher_PublishExam, teacher_Class_put, teacher_Exam_post } from '../api'
import { publicMethod } from '../utils/public/datechange'
export default {
    data() {
        return {
            name: '',
            student_number: '',
            join_code: '',
            input: '',
            isSearch: false,
            counts: 0,
            page: 1,
            pageSize: 5,
            tableData: [],
            identity: '',
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
            console.log(new Date().getTime());
            console.log(this.getTimestamp("2022-11-30T09:16:50.886+08:00"));
            console.log("接收到", this.$route.query.classIdentity)
            this.identity = this.$route.query.classIdentity;
            this.Teacher_Class_identity();
            this.Teacher_Exam();
        },
        Teacher_Class_put() {
            teacher_Class_put({
                "class_identity": this.identity,
                "is_change_code": true,
                "student_identities": [
                ]
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.classData.dialogVisible = false
                    this.Teacher_Class_identity()
                    this.$message.success("修改成功")
                } else if (data.code === 403) {
                    this.classData.dialogVisible = false
                    this.Teacher_Class_identity()
                    this.$message.error("修改失败")
                }
            })
        },
        Teacher_Class_identity() {
            // 这个地方是获取班级信息
            teacher_Class_identity({ params: { identity: this.identity } }).then(({ data }) => {
                if (data.code === 200) {
                    this.name = data.data.name;
                    this.student_number = data.data.student_number;
                    this.join_code = data.data.join_code;
                    this.$message.success("获取班级详情成功")
                } else {
                    this.$message.error("获取班级详情失败")
                }
            });
        },
        Teacher_Exam() {
            if (this.isSearch) {
                teacher_Exam({
                    params: {
                        classIdentity: this.identity,
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
                teacher_Exam({
                    params: {
                        classIdentity: this.identity,
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
        CatExamInfo(row) {
            this.$router.push({ name: "examinfo", query: { identity: row.identity } })
        },
        Teacher_PublishExam(row) {
            teacher_PublishExam({ "exam_identity": row.identity }).then(({ data }) => {
                console.log(data.code)
                if (data.code === 200) {
                    console.log(data.data)
                    this.Teacher_Exam();
                    this.$message.success("发布考试成功")
                } else {
                    this.$message.error("发布考试失败")
                }
            });
        },
        Teacher_Exam_post() {
            console.log("日期", this.dataForm.date)
            console.log("时间", this.dataForm.time)
            var duration = new Date(this.classData.duration);
            duration = (duration.getHours() * 60 * 60 + duration.getMinutes() * 60) * 1000000000
            teacher_Exam_post({
                StartAt: this.dataForm.date + "T" + this.dataForm.time + ".886" + "+08:00",
                class_identity: this.identity,
                duration: duration,
                name: this.classData.name,
                problem_identities: [
                ]
            }).then(({ data }) => {
                if (data.code === 200) {
                    this.classData.dialogVisible = false
                    this.Teacher_Exam();
                    this.$message.success("添加成功")
                } else {
                    this.$message.error("添加失败")
                }
                this.classData.dialogVisible = false
            })
        },
        handleQuery() {
            this.isSearch = true;
            this.Teacher_Exam();
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
        AddHandle() {
            this.classData.dialogVisible = true
        },
        EditHandle() {

        },
        getTimestamp(time) {
            return publicMethod.getTimestamp(time)
        }
    },
    computed: {
        getStatus() {
            return (StartAt, Duration) => { return new Date().getTime() < this.getTimestamp(StartAt) ? "未开始" :
                this.getTimestamp(StartAt) + this.getTimestamp(Duration / 1000000000) * 1000 - new
                    Date().getTime() < 0 ? "已结束" : "正在进行"}
        },
    }
}
</script>
<style lang="less" scoped>
.examlist {

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