<!--菜单管理页面-->
<template>
  <div>
    <div style="margin: 10px 0">
      <el-input style="width: 200px" placeholder="请输入名称" suffix-icon="el-icon-search" v-model="name"></el-input>
      <el-button class="ml-5" type="primary" @click="load">搜索</el-button>
      <el-button class="ml-5" type="warning" @click="reset">重置</el-button>
    </div>

    <div style="margin: 10px 0">
      <el-button type="primary" @click="handleAdd('')">新增</el-button>
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

    <el-table :data="tableData" border stripe  @selection-change="handleSelectionChange" row-key="id" default-expand-all>
      <el-table-column type="selection" width="55" ></el-table-column>
      <el-table-column prop="id" label="ID" width="80"></el-table-column>
      <el-table-column prop="name" label="名称" ></el-table-column>
      <el-table-column prop="path" label="路径" ></el-table-column>
      <el-table-column prop="pagePath" label="页面路径" ></el-table-column>
      <el-table-column label="图标" >
        <template slot-scope="scope">
          <i :class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="description" label="描述" ></el-table-column>
      <el-table-column  label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" @click="handleAdd(scope.row.id)" v-if="!scope.row.pid && !scope.path">新增子菜单</el-button>
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
<!--    <div style="padding: 10px 0">-->
<!--      <el-pagination-->
<!--          @size-change="handleSizeChange"-->
<!--          @current-change="handleCurrentChange"-->
<!--          :current-page="pageNum"-->
<!--          :page-sizes="[2, 5, 10, 20]"-->
<!--          :page-size="pageSize"-->
<!--          layout="total, sizes, prev, pager, next, jumper"-->
<!--          :total="total">-->
<!--      </el-pagination>-->
<!--    </div>-->

    <!-- 弹窗 -->
    <el-dialog title="菜单管理" :visible.sync="dialogFormVisible" width="30%">
      <el-form label-width="80px" size="small">
        <el-form-item label="名称">
          <el-input v-model="form.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="路径">
          <el-input v-model="form.path" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="页面路径">
          <el-input v-model="form.pagePath" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <template >
            <el-select clearable v-model="form.icon" placeholder="请选择" >
              <el-option v-for="item in options" :key="item.name" :label="item.name" :value="item.value">
                <i :class="item.value" /> {{item.name}}
              </el-option>
            </el-select>
          </template>
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
  </div>
</template>

<script>
export default {
  name: "MenuView",
  data(){
    return {
      tableData:[],
      total: 0,
      pageNum: 1,
      pageSize: 10,
      name:"",
      multipleSelection:[],
      dialogFormVisible: false,
      form:{},
      options: []
    }
  },
  created() {
    this.load()
  },
  methods:{
    save(){
      this.request.post("/menu",this.form).then(res => {
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
      this.request.delete("/menu/" + id).then(res => {
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
      this.request.post("/menu/del/batch",ids).then(res => {
        if (res.code === '200') {
          this.$message.success("批量删除成功")
          this.load()
        } else {
          this.$message.error("批量删除失败")
        }
      })
    },
    handleEdit(row){
      this.form = JSON.parse(JSON.stringify(row))
      this.dialogFormVisible = true
    },
    handleAdd(pid){
      this.dialogFormVisible = true
      this.form= {}
      if (pid){
        this.form.pid = pid
      }
    },
    reset(){
      this.name = ""
      this.load()
    },
    load(){
      this.request.get("/menu",{
        params:{
          name:this.name
        }
      }).then(res => {
        this.tableData=res.data
      })

      //请求图标数据
      this.request.get("/menu/icons").then(res => {
        this.options = res.data
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
      window.open("http://43.142.177.50:9090/menu/export")
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