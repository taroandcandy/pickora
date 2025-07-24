<template>
    <div class="box7">
        <div class="title">
            <p>年度游客量对比</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="charts" ref="charts"></div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { ref, onMounted } from 'vue';
//获取DOM节点
let charts = ref();
//组件挂载完毕
onMounted(() => {
    //一个容器可以同时展示多种类型的图形图标
    let mychart = echarts.init(charts.value);
    //设置配置项
    mychart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['2021年', '2022年', '2023年'],
            textStyle: { color: '#fff' }
        },
        grid: {
            left: '5%',
            right: '5%',
            bottom: '10%',
            top: '15%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
            axisLine: { lineStyle: { color: '#fff' } },
            axisLabel: { color: '#ccc' }
        },
        yAxis: {
            type: 'value',
            axisLine: { lineStyle: { color: '#fff' } },
            axisLabel: { color: '#ccc' },
            splitLine: { show: false }
        },
        series: [
            {
                name: '2021年',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#f8b448' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(248,180,72,0.5)' },
                        { offset: 1, color: 'rgba(248,180,72,0.1)' }
                    ])
                },
                data: [50, 120, 150, 80, 70, 110, 130, 160, 210, 330, 240, 100]
            },
            {
                name: '2022年',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#58c8f2' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(88,200,242,0.5)' },
                        { offset: 1, color: 'rgba(88,200,242,0.1)' }
                    ])
                },
                data: [80, 140, 180, 120, 100, 200, 150, 180, 260, 400, 300, 150]
            },
            {
                name: '2023年',
                type: 'line',
                smooth: true,
                symbol: 'none',
                lineStyle: { color: '#f56c6c' },
                areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: 'rgba(245,108,108,0.5)' },
                        { offset: 1, color: 'rgba(245,108,108,0.1)' }
                    ])
                },
                data: [30, 100, 160, 140, 130, 300, 250, 270, 320, 500, 420, 300]
            }
        ]
    })
})
</script>

<style scoped lang="scss">
.box7 {
    width: 100%;
    height: 100%;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;
    margin: 20px 0px;

    .title {
        p {
            color: white;
            font-size: 18px;
        }
    }

    .charts {
        height: calc(100% - 30px);
    }

}
</style>