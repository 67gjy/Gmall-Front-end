<!--角色管理页面-->
<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd()">新增</el-button>
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
<!--      <el-upload action="http://localhost:9090/role/import" style="display: inline-block" class="mr-5" accept="xlsx" :show-file-list="false" :on-success="handleExcelImportSuccess">-->
<!--        <el-button class="ml-5" type="primary">导入</el-button>-->
<!--      </el-upload>-->
<!--      <el-button type="primary" @click="exp">导出</el-button>-->
    </div>

    <el-table :data="tableData" border stripe  @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" ></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" ></el-table-column>
      <el-table-column prop="flag" label="唯一标识" ></el-table-column>
      <el-table-column prop="description" label="描述" ></el-table-column>
      <el-table-column  label="操作">
        <template slot-scope="scope">
          <el-button type="info" @click="selectMenu(scope.row)">分配菜单</el-button>
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
    <el-dialog title="角色信息" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="唯一标识">
          <el-input v-model="form.flag" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="form.description" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="save" >确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="菜单分配" :visible.sync="dialogMenuVisible" width="30%">
      <el-tree
          :props="props"
          :data="menuData"
          ref="tree"
          show-checkbox
          node-key="id"
          :check-strictly="true"
          :default-expanded-keys="expends"
          :default-checked-keys="checks">
        <span class="custom-tree-node" slot-scope="{ data }">
            <span><i :class="data.icon"/> {{data.name}}</span>
        </span>
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogMenuVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleMenu" >确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

export default {
  name: "RoleView",
  data(){
    return {
      tableData:[],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name:"",
      multipleSelection:[],
      dialogFormVisible: false,
      dialogMenuVisible: false,
      form:{},
      menuData:[],
      props:{
        label: 'name'
      },
      expends:[],
      checks:[],
      roleId: 0,
      roleFlag: ''
    }
  },
  created() {
    this.load()
  },
  methods:{
    save(){
      this.request.post("/role",this.form).then(res => {
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
    // saveRoleMenu(){
    //   let a = this.$refs.tree.getCheckedKeys()
    //   this.request.post("/role/"+ this.roleId,a.toString()).then(res => {
    //     console.log(res)
    //   })
    // },
    saveRoleMenu(){
      this.request.post("/role/roleMenu/" + this.roleId, this.$refs.tree.getCheckedKeys()).then(res => {
        if (res.code === "200"){
          this.$message.success("绑定成功")
          this.dialogMenuVisible = false
          if (this.roleFlag === 'ROLE_ADMIN'){
            this.$store.commit("logout")
          }
        }else {
          this.$message.error(res.message)
        }
      })
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    del(id){
      this.request.delete("/role/" + id).then(res => {
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
      this.request.post("/role/del/batch",ids).then(res => {
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
      this.name = ""
      this.load()
    },
    load(){
      this.request.get("/role/page",{
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
    selectMenu(role){
     this.dialogMenuVisible = true
      this.roleId = role.id
      this.roleFlag = role.flag
      //请求菜单
      this.request.get("/menu").then(res => {
        this.menuData =res.data
        this.expends = this.menuData.map(v => v.id)
      })
      this.request.get("/role/roleMenu/" + this.roleId).then(res => {
        this.checks = res.data
      })
      // this.request.get("/menu/ids"+this.roleId).then(res => {
      //   const ids = res.data
      //   ids.forEach(id => {
      //     if (!this.checks.includes(id)){
      //       this.$refs.tree.setChecked(id,false)
      //     }
      //   })
      // })
    },

  }

}
</script>

<style scoped>

</style>