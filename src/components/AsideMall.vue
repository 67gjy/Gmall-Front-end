<!--此文件为侧边栏的vue组件-->
<template>

  <el-menu :default-openeds="opens" style="height: 100%;overflow-x:hidden" router>
    <div style="height:60px;line-height: 60px;text-align: center">
      <img src="../assets/logo.png" alt="" style="width: 20px;position: relative;top:10px;margin-right: 5px">
      <b style="color: black">GMall后台管理系统</b>
    </div>
    <div v-for="item in menus" :key="item.id">
      <div v-if="item.path">
        <el-menu-item :index="item.path">
          <i :class="item.icon"></i>
          <span>{{item.name}}</span>
        </el-menu-item>
      </div>
      <div v-else>
        <el-submenu :index="item.id+''">
          <template slot="title"> <i :class="item.icon"></i><span slot="title">{{item.name}}</span></template>

          <div v-for="subItem in item.children" :key="subItem.id">
            <el-menu-item :index="subItem.path">
              <i :class="subItem.icon"></i>
              <span slot="title">{{subItem.name}}</span>
            </el-menu-item>
          </div>
        </el-submenu>
      </div>
    </div>

<!--    <el-submenu index="2">-->
<!--      <template slot="title"><i class="el-icon-menu"></i>系统管理</template>-->
<!--      <el-menu-item index="/user"><i class="el-icon-user"></i>用户管理</el-menu-item>-->
<!--      <el-menu-item index="/file"><i class="el-icon-menu"></i>文件管理</el-menu-item>-->
<!--      <el-menu-item index="/role"><i class="el-icon-menu"></i>角色管理</el-menu-item>-->
<!--      <el-menu-item index="/menu"><i class="el-icon-menu"></i>菜单管理</el-menu-item>-->
<!--    </el-submenu>-->
  </el-menu>

</template>

<script>
export default {
  props:{
  },
  data(){
    return {
      menus: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
      opens: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")).map(v => v.id + '') : []
    }
  }
}
</script>