<template>
    <div class='storage-agency'>

        <div class="title">
            <h2>{{generateTitle('logs')}}</h2>
            <div class="search">
                <el-input v-model="search" :placeholder="$t('logs.search')" :title="$t('logs.search')" prefixIcon="el-icon-search" @keyup.enter.native="handleFilter" clearable></el-input>
                &nbsp;&nbsp;
                <el-date-picker v-model="timeFilter" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" :range-separator="$t('logs.toTime')" :start-placeholder="$t('logs.startTime')" :end-placeholder="$t('logs.endTime')"></el-date-picker>
                <el-button type="primary" @click="handleFilter" icon="el-icon-search">{{$t('table.search')}}</el-button>
                <el-button type="primary" icon="el-icon-download" :loading='$store.getters.downloadLoading' @click="handleDownload(list[0],list,$t('title')+'-'+generateTitle('logs'))">{{$t('table.export')}}</el-button>
            </div>
        </div>

        <main class="list">
            <el-table :data="list" border style="width:100%" v-loading="loading">
                <!-- <el-table-column prop="id" :label="$t('logs.id')" width='60'></el-table-column> -->
                <el-table-column prop="username" :label="$t('logs.username')" width="150"></el-table-column>
                <el-table-column prop="content" :label="$t('logs.content')"></el-table-column>
                <el-table-column prop="time" :label="$t('logs.time')" width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.time}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </main>

        <div class="page">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="listQuery.page"
                :page-sizes="[10,20,50,100]"
                :page-size="listQuery.limit"
                layout="total,sizes,prev,pager,next,jumper"
                :total="total">
            </el-pagination>
        </div>

    </div>
</template>

<style lang='scss'>
.storage-agency {
}
</style>

<script>
import { getUserList } from "@/api/user";
import { getLogsList } from "@/api/logs";
export default {
  name: "storage-agency",
  components: {},
  data() {
    return {
      //表格数据
      list: [], //表格数据
      total: 0, //数据总数
      loading: true, //数据加载
      //查询条件
      tableLists: [], //前端总的查询数据
      currentTableLists: [], //前端分页查询数据

      timeFilter: null,
      search: "", //用于把字符串转化为对象内容作为请求数据参数
      listQuery: {
        searchkeys: {
          //若两个为空则delete
          usernames: [""],
          time: ["", ""]
        },
        page: 1, //当前页
        limit: 10 //一页多少条记录
      }
    };
  },
  created() {
    //获取表格数据
    this.getList();
  },
  methods: {
    //获取数据
    getList() {
      this.loading = true;

      getLogsList(this.listQuery).then(res => {
        if (res.error_code === 0) {
          this.list = res.data.results;
          this.total = res.data.total;
          this.loading = false;

          //this.tableListsChange();
        }
      });
    },
    //点击查询
    handleFilter() {
      this.listQuery.page = 1;

      //转化usernames对象
      if (this.search === "") {
        this.listQuery.searchkeys.usernames = [""];
      } else {
        let arr = this.search.split(" ");
        this.listQuery.searchkeys.usernames = arr;
      }

      //console.log(this.timeFilter);
      if (!this.timeFilter) {
        this.listQuery.searchkeys.time = ["",""];
      } else {
        this.listQuery.searchkeys.time = this.timeFilter;
      }

      this.getList();
      //this.tableListsChange();
    },
    //每页多少条记录改变
    handleSizeChange(val) {
      this.listQuery.limit = val;
      this.getList();
      //this.tableListsChange();
    },
    //当前页改变
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getList();
      //this.tableListsChange();
    },
    //获取当前分页表格数据（前端处理）
    tableListsChange() {
      //转化username正则
      let usernames = this.search.replace(" ", "|");
      let usernameReg = new RegExp(usernames);
      //处理time
      let time = this.timeFilter;

      this.tableLists = this.list.filter((item, index, self) => {
        return usernameReg.test(item.usernames) && this.func(item.time, time);
      });

      this.currentTableLists = this.tableLists.filter((item, index, self) => {
        return (
          index >= this.listQuery.limit * (this.listQuery.page - 1) &&
          index < this.listQuery.limit * this.listQuery.page
        );
      });
      this.total = this.tableLists.length;
      this.loading = false;
    },
    //判断time是否在time1和time2区间内
    func(time, time1) {
      //console.log(time);
      if (time1 === null) {
        return true;
      } else {
        if (time >= time1[0] && time <= time1[1]) return true;
        return false;
      }
    }
  }
};
</script>
