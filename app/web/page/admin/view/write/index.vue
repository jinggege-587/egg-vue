<template>
  <div>
    <div class="search">
      <el-row class="clear">
            <el-input class="long-input" clearable v-model="article.name" placeholder="请填写要添加名字"></el-input>
            <el-button class="add-button" type="success" icon="el-icon-document" @click="submit(1)">提交</el-button>
            <!-- <el-button class="add-button" type="primary" icon="el-icon-document" @click="submit(0)">草稿</el-button> -->
      </el-row>
      <el-row class="clear top16">
        <el-input class="long-input" clearable v-model="article.parent_name" placeholder="请填写要添加名字的父亲名字"></el-input>
      </el-row>
      <el-row class="clear top16">
        <el-input class="long-input" clearable v-model="article.wife" placeholder="请填写要添加名字的妻子名字"></el-input>
      </el-row>
      <el-row class="clear top16">
        <el-input class="long-input" clearable v-model="article.images" placeholder="请填写要添加名字的图片"></el-input>
      </el-row>
      <el-row class="clear top16">
        <el-input class="long-input" clearable v-model="article.parent_id" placeholder="请填写要添加父节点的ID"></el-input>
      </el-row>
    </div>
    <div class="editor-container" v-if="isShowEditor">
      <markdown-editor id="contentEditor" ref="contentEditor" v-model="article.des" :height="500" :zIndex="20"></markdown-editor>
    </div>
  </div>
</template>
<style>
.editor-container {
  width: 100%;
}
</style>
<script type="babel">
import { SET_SAVE_ARTICLE } from '../../store/mutation-type';
export default {
  components: {
    MarkdownEditor: () => import("component/MarkdownEditor/index.vue")
  },
  data() {
    return {
      article: {
        id: "",
        parent_id: 0,
        name: "",
        wife: "",
        parent_name: "",
        images: "",
        des: ""
      },
      isShowEditor: false
    };
  },
  computed: {},
  methods: {
     markdown2Html() {
      import('showdown').then(showdown => {
        const converter = new showdown.Converter()
        this.article.html = converter.makeHtml(this.content)
      })
    },
    submit(status) {
       this.$store.dispatch(SET_SAVE_ARTICLE, this.article);
       this.$message.success(`添加成功${this.article.name}`);
       this.$router.push({path:'/article/list'})
    }
  },
  created () {
    console.log('this.$route.query.id;',this.$route.query.id)
    let query = this.$route.query;
    this.article.id = query.id;
    this.article.parent_id = query.id;
    this.article.name = query.name;
    this.article.wife = query.wife;
    this.article.parent_name = query.parent_name;
    this.article.images = query.images;
    this.article.des = query.des;
  },
  mounted() {
    this.isShowEditor = true;
  }
};
</script>