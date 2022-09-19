<!--文件管理页面，用于上传下载-->
<template>
<div>
  <div style="margin: 10px 0">
    <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
    <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
    <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
  </div>
  <div style="margin: 10px 0">
    <el-upload :action="'http://'+serverIp+':9090/file/upload'" style="display: inline-block" class="mr-5" :show-file-list="false" :on-success="handleFileUploadSuccess">
      <el-button class="ml-5" type="primary">上传文件</el-button>
    </el-upload>
    <el-popconfirm
        class="ml-5"
        confirm-button-text='好的'
        cancel-button-text='不用了'
        icon="el-icon-info"
        icon-color="red"
        title="这是一段内容确定删除吗？"
        @confirm="delBatch"
    >
      <el-button type="danger" slot="reference">批量删除</el-button>
    </el-popconfirm>
  </div>
  <el-table :data="tableData" border stripe  @selection-change="handleSelectionChange">
    <el-table-column type="selection" width="55" ></el-table-column>
    <el-table-column prop="id" label="ID" width="80"></el-table-column>
    <el-table-column prop="name" label="文件名称" ></el-table-column>
    <el-table-column prop="type" label="文件类型" ></el-table-column>
    <el-table-column prop="size" label="文件大小(kb)"></el-table-column>
    <el-table-column label="下载">
      <template slot-scope="scope">
        <el-button type="primary" @click="download(scope.row.url)">下载</el-button>
      </template>
    </el-table-column>
    <el-table-column label="启用">
      <template v-slot="scope">
        <el-switch v-model="scope.row.enable" active-color="#13ce66" inactive-color="#ccc" @change="changeEnable(scope.row)"></el-switch>
      </template>
    </el-table-column>
    <el-table-column  label="操作">
      <template slot-scope="scope">
        <el-popconfirm
            class="ml-5"
            confirm-button-text='好的'
            cancel-button-text='不用了'
            icon="el-icon-info"
            icon-color="red"
            title="这是一段内容确定删除吗？"
            @confirm="del(scope.row.id)"
        >
          <el-button type="danger" slot="reference">删除</el-button>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <div style="padding: 10px 0">
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[2, 5, 10, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>
  </div>

</div>
</template>

<script>

import {serverIp} from "../../public/config";

export default {
  name: "FileView",
  data(){
    return {
      tableData: [],
      name: '',
      multipleSelection: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      serverIp: serverIp
    }
  },
  created() {
    this.load();
  },
  methods:{
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    del(id){
      this.request.delete("/file/" + id).then(res => {
        if (res.code==='200'){
          this.$message.success("删除成功")
          this.load()
        }else {
          this.$message.error("删除失败")
        }
      })
    },
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("/file/del/batch",ids).then(res => {
        if (res.code==='200') {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    reset(){
      this.name = ""
      this.load()
    },
    load(){
      this.request.get("/file/page",{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          name:this.name
        }
      }).then(res => {
        this.tableData=res.data.records
        this.total = res.data.total
      })
    },
    handleSizeChange(pageSize){
      console.log(pageSize)
      this.pageSize=pageSize
      this.load()
    },
    handleCurrentChange(pageNum){
      console.log(pageNum)
      this.pageNum=pageNum
      this.load()
    },
    handleFileUploadSuccess(res){
      console.log(res)
      this.load()
    },
    download(url){
      window.open(url)
    },
    changeEnable(row){
      this.request.post("/file/update",row).then(res => {
        if(res.code==='200'){
          this.$message.success("更新成功")
        }else {
          this.$message.success("更新失败")
        }
      })
    }
  }
}
</script>

<style scoped>

</style>