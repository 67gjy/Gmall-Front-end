<!--展示组件页面-->
<template>
  <div style="height: 100%">
    <el-container style="height: 100%; border: 1px solid #eee">

      <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 100%;">
        <AsideMall></AsideMall>
      </el-aside>

      <el-container>
        <el-header style="text-align: left; font-size: 12px;border-bottom: 1px solid #ccc;line-height: 60px;background-color: #cccccc;">
          <head-mall :user =user></head-mall>
        </el-header>

        <el-main>
          <router-view @refreshUser="getUser"/>
        </el-main>

      </el-container>
    </el-container>
  </div>
</template>

<script>

import AsideMall from "@/components/AsideMall";
import HeadMall from "@/components/HeadMall";
export default {
  components: {HeadMall, AsideMall},
  data() {
    return {
      user: {}
    }
  },
  created() {
    this.getUser()
  },
  methods: {
    //拿user数据
    getUser(){
      let username = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).username : ""
      this.request.get("/user/username/" + username).then(res => {
        //重新赋值
        this.user = res.data
      })
    },
  }

};
</script>

<style scoped>

</style>