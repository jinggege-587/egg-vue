<template>
  <div class="list">
    <div class="search">
        <el-row class="clear">
              <label> 姓名:</label><el-input class="search-input" clearable v-model="q.name" placeholder="关键字"></el-input>
              <el-button class="search-button" type="primary" @click="query()">查询</el-button>
              <!-- <el-button class="add-button" type="success" @click="write()">添加</el-button> -->
        </el-row>
    </div>

    <el-table
      :data="articleList"
      v-loading="loading"
      element-loading-text="拼命加载中"
      border
      style="width: 100%;" >
      <el-table-column prop="name" label="名字">
        <template slot-scope="props">
          <router-link
            :to="'/article/add?id='+ props.row.id+'&parent_name='+props.row.name"
          >{{props.row.name}}</router-link>
        </template>
      </el-table-column>
      <el-table-column prop="parent_name" label="父亲" width></el-table-column>
      <el-table-column prop="wife" label="妻子" width></el-table-column>
      <el-table-column prop="des" label="描述" width></el-table-column>
      <el-table-column label="图片" width>
        <template slot-scope="props">
          <img :src="props.row.images" alt />
        </template>
      </el-table-column>
      <el-table-column label="操作" width>
        <template slot-scope="props">
          <router-link :to="{params: {id: props.row.id}}" tag="span">
            <el-button
              type="info"
              size="small"
              icon="edit"
              @click="handleEdit(props.$index, props.row)"
            >修改</el-button>
          </router-link>
          <el-button
            type="danger"
            size="small"
            icon="delete"
            @click="handleDelete(props.$index, props.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <div style="float:right;margin-top:15px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="q.pageIndex"
          :page-sizes="[10, 15, 20, 50]"
          :page-size="q.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
</template>
<style>
.list {
  width: 100%;
}
</style>
<script type="babel">
import { SET_ARTICLE_LIST, DELETE_ARTICLE } from "../store/mutation-type";
export default {
  components: {},
  data() {
    return {
      q: {
        name: undefined,
        pageIndex: 1,
        pageSize: 10
      },
      //请求时的loading效果
      loading: false,
      //批量选择数组
      batchSelectArray: []
    };
  },
  methods: {
    fetchApi({ $store, $router }, json) {
      return $store.dispatch(SET_ARTICLE_LIST, json);
    },
    query() {
        console.log('this.q',this.q)
      this.fetchApi(this, this.q);
    },
    write() {
      this.$router.push("/article/add");
    },
    handleSelectionChange(val) {
      console.log("handleSelectionChange", val);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.q.pageSize = val;
      this.fetchApi(this, this.q);
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.q.pageIndex = val;
      this.fetchApi(this, this.q);
    },
    handleEdit(index, row) {
      // this.$message(`你点击了编辑操作 index:${index}, id:${row.id}`);
      console.log("row", row);
      // this.$router.push("/article/add");
      let query = row;
      //   location.href="#/article/add"
      this.$router.push({ path: "/article/add", query }).then(()=>{
          location.reload()
      });
    },
    handleDelete(index, row) {
      this.$store.dispatch(DELETE_ARTICLE, { id: row.id });
      this.$message(`删除[${row.title}]成功!`);
    },
    //批量删除
    batchDel() {
      this.$confirm("将批量删除选择文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        this.$message.success(msg);
        this.loading = false;
      });
    }
  },
  computed: {
    total() {
      return this.$store.state.articleTotal;
    },
    articleList() {
      return this.$store.state.articleList;
    }
  }
};
</script>