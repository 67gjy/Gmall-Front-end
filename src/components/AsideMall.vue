<template>

  <el-menu :default-openeds="['1', '3']" style="height: 100%;overflow-x:hidden" router>
    <div style="height:60px;line-height: 60px;text-align: center">
      <img src="../assets/logo.png" alt="" style="width: 20px;position: relative;top:10px;margin-right: 5px">
      <b style="color: black">GMall后台管理系统</b>
    </div>
    <el-menu-item index="/">主页</el-menu-item>
    <el-submenu index="2">
      <template slot="title"><i class="el-icon-menu"></i>系统管理</template>
      <el-menu-item index="/user"><i class="el-icon-user"></i>用户管理</el-menu-item>
      <el-menu-item index="/file"><i class="el-icon-menu"></i>文件管理</el-menu-item>
      <el-menu-item index="/role"><i class="el-icon-menu"></i>角色管理</el-menu-item>
      <el-menu-item index="/menu"><i class="el-icon-menu"></i>菜单管理</el-menu-item>
    </el-submenu>
  </el-menu>

</template>