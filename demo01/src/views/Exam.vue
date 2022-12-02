<template>
    <div class="Exam">
        <div v-if="isStart" class="start" align="middle">
            <span class="start_title">提示：请先加入班级再来考试!</span>
            <div class="btns_exam">
                <el-button @click="back" type="primary" size="medium">返回</el-button>
                <el-button @click="join" class="join" type="danger" size="medium">加入班级</el-button>
            </div>
        </div>
        <div v-if="isStartJoin" style="height: 254px;" class="start_join" align="middle">
            <span class="start_join_title">加入班级</span>
            <el-form label-width="80px">
                <el-form-item label="班级码：">
                    <el-input class="start_join_input" v-model="joinCode" placeholder="请输入班级码"></el-input>
                </el-form-item>
                <el-button @click="Student_Class" type="primary" size="medium" style="padding: 10px 40px;">保存
                </el-button>
            </el-form>
        </div>
        <div v-if="isJoin" class="container">
            <span class="class">考试界面</span>
            <div class="tableBar">
                <el-input type="mini" v-model="input" style="width: 250px;padding-left: 0%;" clearable
                    @keyup.enter.native="handleQuery">
                    <i slot="suffix" class="el-input__icon el-icon-search" style="cursor: pointer"
                        @click="handleQuery"></i>
                </el-input>
            </div>
            <el-table :data="tableData" stripe class="tableBox" :header-cell-style="{ 'text-align': 'center' }"
                :cell-style="{ 'text-align': 'center' }">
                <el-table-column prop="CreatedAt" label="日期"><template slot-scope="scope">{{ scope.row.CreatedAt |
                        dateFormat
                }}</template></el-table-column>
                <el-table-column prop="total_score" label="分值"></el-table-column>
                <el-table-column prop="name" label="考试"></el-table-column>
                <el-table-column prop="publish" label="考试状态">
                    <template slot-scope="scope">
                        <span>{{ getStatus(scope.row.StartAt, scope.row.Duration) }}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="280" align="center">
                    <template slot-scope="scope">
                        <el-link v-if="getExam(scope.row.StartAt, scope.row.Duration) === '进入考试'" type='primary'
                            size="small" class="blueBug" @click="GetIntoExam(scope.row)">
                            {{ getExam(scope.row.StartAt, scope.row.Duration)
                            }} </el-link>
                        <el-link v-if="getExam(scope.row.StartAt, scope.row.Duration) === '查看考试'" type='danger'
                            size="small" class="blueBug" @click="GetIntoExam(scope.row)">
                            {{ getExam(scope.row.StartAt, scope.row.Duration)
                            }} </el-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="pageList" :page-sizes="[5, 10, 20, 30]" :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper" :total="counts" :current-page.sync="page"
                @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
        </div>
    </div>
</template>
<script>
function createComputedGetter(key) {
    return function computedGetter() {
        console.log('首先执行：computed getter')
        var watcher = this._computedWatchers && this._computedWatchers[key];
        if (watcher) {
            if (watcher.dirty) {
                watcher.evaluate();
            }
            if (Dep.target) {
                watcher.depend();
            }
            return watcher.value
        }
    }
}
</script>
<script>
import { student_Exam, student_Class } from "../api";
import { publicMethod } from '../utils/public/datechange'
export default {
    data() {
        return {
            input: '',
            page: 1, //初始页
            pageSize: 5,// 分页
            tableData: [],
            total: 0,
            counts: 0,
            isStart: false,
            isStartJoin: false,
            isJoin: false,
            joinCode: '',
        }
    },
    created() {
        this.init()
    },
    methods: {
        init() {
            this.Student_Exam();
        },
        Student_Exam() {
            student_Exam(({ params: { page: this.page, pageSize: this.pageSize } })).then(({ data }) => {
                console.log("更新的数据量：" + data)
                console.log(new Date().getTime());
                console.log(this.getTimestamp("2022-11-30T09:12:00.886+08:00"));
                console.log(this.getTimestamp("2022-11-29T22:42:55.886+08:00"));
                console.log(this.getTimestamp("2022-11-29T20:42:55.886+08:00")); // 这一波 显示了我的智商
                console.log(this.getTimestamp("2022-11-29T22:42:55.886+08:00") - this.getTimestamp("2022-11-29T20:42:55.886+08:00"));
                console.log(this.getTimestamp(7200000000000 / 1000000000));
                console.log(new Date().getTime());
                console.log("what's up", (new Date().getTime() - this.getTimestamp("2022-11-29T22:42:55.886+08:00")) / (24 * 60 * 60 * 1000));
                console.log("what fuck", this.getTimestamp("2022-11-29T22:42:55.886+08:00") + this.getTimestamp(7200000000000 / 1000000000) * 1000 - new Date().getTime());
                // console.log("更新" + data.data.list)
                console.log(data.code)
                if (data.code === 200) {
                    if (data.msg === "该学生尚未加入班级") {
                        this.isStart = true
                        this.$message.success("需要先加入班级哦！")
                    } else if (data.msg === "success") {
                        this.isStart = false
                        this.isStartJoin = false
                        this.isJoin = true
                        this.counts = data.data.total;
                        this.tableData = data.data.list
                        this.$message.success("已经加入过了")
                    }
                } else if (data.code === 402) {
                    this.isStart = true
                    this.$message.error("还没有加入班级")
                }
            })
        },
        back() {
            this.$router.push("/home")
        },
        join() {
            this.isStart = false;
            this.isStartJoin = true;
        },
        handleQuery() {

        },
        Student_Class() {
            student_Class({ joinCode: this.joinCode }).then(({ data }) => {
                console.log("更新的数据量：" + data)
                // console.log("更新" + data.data.list)
                console.log(data.code)
                if (data.code === 200) {
                    this.isStartJoin = false
                    this.isJoin = true
                    this.$message.success("加入班级成功")
                } else if (data.code === 401) {
                    this.$message.success("已经加入过了")
                }
                else {
                    this.$message.error("更新失败")
                }
            })
        },
        getTimestamp(time) {
            return publicMethod.getTimestamp(time)
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.init()
        },
        handleCurrentChange(val) {
            this.page = val
            this.init()
        },
        GetIntoExam(row) {
            if(this.getExam(row.StartAt, row.Duration) === '查看考试') {
                this.$router.push({ name: "doexampaper", query: { identity: row.identity,IntoStatus: "查看考试" } })
            } else if(this.getExam(row.StartAt, row.Duration) === '进入考试') {
                this.$router.push({ name: "doexampaper", query: { identity: row.identity,IntoStatus: "进入考试",StartAt: row.StartAt,Duration: row.Duration, } })
            } else {
                console.log("什么牛马");
            }
        }
    },
    computed: {
        getStatus() {
            return (StartAt, Duration) => { return new Date().getTime() < this.getTimestamp(StartAt) ? "未开始" :
                this.getTimestamp(StartAt) + this.getTimestamp(Duration / 1000000000) * 1000 - new
                    Date().getTime() < 0 ? "已结束" : "正在进行"}
        },
        getExam() {
            return (StartAt, Duration) => { return this.getTimestamp(StartAt) + this.getTimestamp(Duration / 1000000000) * 1000 - new
                    Date().getTime() < 0 ? "查看考试" : "进入考试"}
        }
    }
}
</script>

<style lang="less" scoped>
.Exam {
    .start {
        width: 480px;
        margin: 252px auto;

        .start_title {
            font-size: 30px;

        }

        .btns_exam {
            .join {
                margin-left: 85px;
            }
        }
    }

    .start_join {
        width: 480px;
        height: 500px;
        margin: 160px auto;

        .start_join_title {
            font-size: 30px;
        }

        .el-form-item {
            margin-top: 50px;
        }
    }

    .container {
        margin: auto 30px;

        .tableBar {
            width: 40%;
            margin-left: 818px;

            .el-input {
                padding-left: 0%;
            }
        }

        .class {
            margin-left: 544px;
            font-size: 32px;
        }

        .el-pagination {
            margin: 12px 0px 12px 700px;
        }
    }
}
</style>