<!--用户管理页面-->
<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="username"></el-input>
      <el-input style="width: 200px" placeholder="请输入邮箱" suffix-icon="el-icon-message" class="ml-5" v-model="email"></el-input>
      <el-input style="width: 200px" placeholder="请输入地址" suffix-icon="el-icon-edit" class="ml-5" v-model="address"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd">新增</el-button>
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
      <el-upload :action="'http://'+serverIp+':9090/user/import'" style="display: inline-block" class="mr-5" accept="xlsx" :show-file-list="false" :on-success="handleExcelImportSuccess">
      <el-button class="ml-5" type="primary">导入</el-button>
      </el-upload>
      <el-button type="primary" @click="exp">导出</el-button>
    </div>

    <el-table :data="tableData" border stripe  @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" ></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="username" label="用户名" width="140"></el-table-column>
      <el-table-column prop="role" label="角色"></el-table-column>
      <el-table-column prop="nickname" label="昵称" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="phone" label="电话"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="success" @click="handleEdit(scope.row)">编辑</el-button>
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

<!--   分页组件 -->
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

    <!-- 弹窗 -->
    <el-dialog title="用户信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="用户名">
          <el-input v-model="form.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色选择">
          <el-select clearable v-model="form.role" placeholder="请选择角色" style="width:100%">
            <el-option v-for="item in roles" :key="item.name" :label="item.name" :value="item.flag"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="form.nickname" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="form.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="form.phone" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="form.address" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {serverIp} from "../../public/config";

export default {
  name: "UserView",
  data(){
    return {
      tableData:[],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      username:"",
      email:"",
      address:"",
      multipleSelection:[],
      dialogFormVisible: false,
      form:{},
      roles: [],
      serverIp: serverIp
    }
  },
  created() {
    this.load()
  },
  methods:{
    save(){
      this.request.post("/user",this.form).then(res => {
            if (res.code === '200'){
              this.$message.success("成功")
              this.dialogFormVisible= false
              this.load()
            }else {
              this.$message.error("失败")
            }
          }
      )
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    del(id){
      this.request.delete("/user/" + id).then(res => {
        if (res.code === '200'){
          this.$message.success("删除成功")
          this.load()
        }else {
          this.$message.error("删除失败")
        }
      })
    },
    delBatch(){
      let ids = this.multipleSelection.map(v => v.id)
      this.request.post("/user/del/batch",ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    handleEdit(row){
      this.form = row
      this.dialogFormVisible = true
    },
    handleAdd(){
      this.dialogFormVisible = true
      this.form= {}
    },
    reset(){
      this.username = ""
      this.email = ""
      this.address = ""
      this.load()
    },
    load(){
      this.request.get("/user/page",{
        params:{
          pageNum:this.pageNum,
          pageSize:this.pageSize,
          username:this.username,
          email:this.email,
          address:this.address
        }
      }).then(res => {
        this.tableData=res.data.records
        this.total = res.data.total
      })

      this.request.get("/role").then(res => {
        this.roles = res.data
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
    //导出
    exp(){
      window.open("http://43.142.177.50:9090/user/export")
    },
    handleExcelImportSuccess(){
      this.$message.success("导入成功")
      this.load()
    }
  }

}
</script>

<style scoped>

</style>