<template>
  <div class="box5">
    <div class="title">
      <p>未来七天游客数量趋势图</p>
      <img src="../../images/dataScreen-title.png" alt="" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { ref, onMounted } from 'vue'
//获取图形图标的节点
let line = ref()
onMounted(() => {
  let mycharts = echarts.init(line.value)
  //设置配置项
  mycharts.setOption({
    // //标题组件
    title: {
      text: '访问量',
      textStyle: {
        color: 'white',
        fontSize: 14, // 设置字体大小（单位是 px）
      },
      left: 40, // 水平居中对齐
      top: 4, // （可选）控制上下位置，默认是顶部
    },
    //x|y轴
    xAxis: {
      type: 'category',
      //两侧不留白
      boundaryGap: false,
      //分割线不要
      splitLine: {
        show: false,
      },
      data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      //轴线的设置
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
    },
    yAxis: {
      splitLine: {
        show: false,
      },
      //轴线的设置
      axisLine: {
        show: true,
      },
      //刻度
      axisTick: {
        show: true,
      },
      max: (value: any) => {
        return value.max + 300 // 比最大值高 300，让图不“顶”
      },
      type: 'value',
      boundaryGap: [0, '20%'], // 顶部留出 10%
    },
    grid: {
      left: 40,
      top: 0,
      right: 20,
      bottom: 20,
    },
    //系列
    series: [
      {
        type: 'line',
        data: [120, 1240, 66, 2299, 321, 890, 1200],
        //平滑曲线的设置
        smooth: true,
        //区域填充样式
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'red', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'blue', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
        // clip: true // 限制区域不溢出
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-cb.png) no-repeat;
  background-size: 105% 100%;
  margin: 0px 20px;

  .title {
    margin-bottom: 10px;

    p {
      color: white;
      font-size: 20px;
    }
  }

  .charts {
    margin-top: 20px;
    height: calc(100% - 30px);
    // width: 110%;
  }
}
</style>
