<!--展示用户注册人数以及会员人数，待后期更改-->
<template>
<div>
  <el-row :gutter="10" style="margin-bottom: 40px;">
    <el-col :span="6">
      <el-card>
        <div >用户总数</div>
        <div style="padding: 10px 0; text-align: center; font-weight: bold">
          100
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div >销售总量</div>
        <div style="padding: 10px 0; text-align: center; font-weight: bold">
          100
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div >收益额</div>
        <div style="padding: 10px 0; text-align: center; font-weight: bold">
          100
        </div>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <div >门店总数</div>
        <div style="padding: 10px 0; text-align: center; font-weight: bold">
          100
        </div>
      </el-card>
    </el-col>
  </el-row>
  <el-row :gutter="10" style="margin-bottom: 20px;">
    <el-col :span="12"> <el-card><div id="main" style="width: 500px;height: 500px;margin: 0 auto"></div></el-card></el-col>
    <el-col :span="12"> <el-card><div id="pie" style="width: 500px;height: 500px;margin: 0 auto"></div></el-card></el-col>
  </el-row>
</div>
</template>

<script>
import * as echarts from 'echarts'
export default {
  name: "HomeView",
  data(){
    return{

    }
  },
  mounted() {
    //页面渲染之后触发
    var chartDom = document.getElementById('main');
    var myChart = echarts.init(chartDom);
    this.request.get("/echarts/members").then(res => {
      // option.xAxis.data = res.data.x
      option.series[0].data = res.data
      option.series[1].data = res.data
      option.series[2].data = [5,6,7,8]
      option.series[3].data = [5,6,7,8]
      myChart.setOption(option);
    })
    var option = {
      title: {
        text: '注册人数统计',
        subtext: '趋势图',
        left: 'center'
      },
      tooltip: {
          trigger: 'item'
        },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      xAxis: {
        type: 'category',
        data: ["第一季度","第二季度","第三季度","第四季度"]
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name:"管理员",
          data: [],
          type: 'bar'
        },
        {
          name:"管理员",
          data: [],
          type: 'line'
        },
        {
          name:"普通用户",
          data: [],
          type: 'bar'
        },
        {
          name:"普通用户",
          data: [],
          type: 'line'
        }

      ]
    };

  //  pie
    var pieDom = document.getElementById('pie');
    var pieChart = echarts.init(pieDom);
    this.request.get("/echarts/members").then(res => {
      // option.xAxis.data = res.data.x
      pieoption.series[0].data = [
        {name:"第一季度", value:res.data[0]},
        {name:"第二季度", value:res.data[1]},
        {name:"第三季度", value:res.data[2]},
        {name:"第四季度", value:res.data[3]}
      ]
      pieChart.setOption(pieoption);
    })
    var pieoption = {
      title: {
        text: '注册人数统计',
        subtext: '比例图',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name:"人数",
          type: 'pie',
          radius: '60%',
          data: [],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        // {
        //   name:"普通用户",
        //   type: 'pie',
        //   radius: '60%',
        //   data: [{name:"第一季度", value:5},
        //     {name:"第二季度", value:6},
        //     {name:"第三季度", value:7},
        //     {name:"第四季度", value:8}],
        //   emphasis: {
        //     itemStyle: {
        //       shadowBlur: 10,
        //       shadowOffsetX: 0,
        //       shadowColor: 'rgba(0, 0, 0, 0.5)'
        //     }
        //   }
        // }
      ]
    };
  }
}
</script>

<style scoped>

</style>