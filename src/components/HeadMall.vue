<!--此文件为头部的vue组件-->
<template>
  <div style="line-height: 60px;display: flex;">
    <div style="flex: 1">
      <el-breadcrumb separator="/" style="display: inline-block;font-size:20px;">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{currentPathName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-dropdown style="width: 120px;cursor: pointer;">
      <div style="display: inline-block">
        <img :src="user.avatarUrl" style="width: 30px;border-radius: 50%;position: relative;top: 10px;right: 5px">
        <span>{{user.nickname}}</span><i class="el-icon-arrow-down" style="margin-left: 15px"></i>
      </div>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>
          <router-link to="/person" style="text-decoration: none;color: black">个人信息</router-link>
        </el-dropdown-item>
          <el-dropdown-item>
            <div style="text-decoration: none;" @click="logout"> <span>退出</span></div>
          </el-dropdown-item>
      </el-dropdown-menu>

    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: "HeadMall",
  props:{
    user: Object
  },
  data(){
    return{

    }
  },
  computed:{
    currentPathName(){
      return this.$store.state.currentPathName;
    }
  },
  watch:{
    currentPathName(newVal){
      console.log(newVal)
    }
  },
  methods: {

    logout(){
      this.$store.commit("logout")
      this.$message.success("退出成功")
    }
  }
}
</script>
