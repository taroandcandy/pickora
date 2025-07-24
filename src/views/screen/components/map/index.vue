<template>
    <div class="box4" ref="map">
        我是地图组件
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts';
import planeIcon from '../../images/fly.png'
//引入中国地图的JSON数据
import chinaJSON from './china.json'
//获取DOM元素
let map = ref();
//注册中国地图
echarts.registerMap('china', chinaJSON as any)
onMounted(() => {
    let mychart = echarts.init(map.value);
    //设置配置项
    mychart.setOption({
        geo: {
            map: 'china',
            roam: true,//鼠标缩放的效果
            zoom: 0.9,
            //地图的位置调试
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            label: {
                show: true,
                color: '#ffffff',
                fontSize: 10
            },
            itemStyle: {
                borderColor: '#00f6ff',  // 地图边界颜色（发光蓝）
                borderWidth: 1.2,
                areaColor: '#061f45'     // 地图填充颜色
            },
            // emphasis: {
            //     label: {
            //         show: true,
            //         color: '#fff',
            //         fontSize: 14
            //     },
            //     itemStyle: {
            //         areaColor: '#83757c'  // 鼠标 hover 上去后的颜色
            //     }
            // },
            // 选中时
            select: {
                label: {
                    show: true,
                    color: '#fff',
                    fontSize: 14
                },
                itemStyle: {
                    areaColor: '#83757c'
                }
            }
        },
        series: [
            {
                type: 'lines',
                coordinateSystem: 'geo',
                zlevel: 2,
                effect: {
                    show: true,
                    period: 10,
                    color: '#fff',
                    symbol: `image://${planeIcon}`, // 使用完整路径
                    symbolSize: 20,
                    trailLength: 0  //  没有拖影
                },
                lineStyle: {
                    color: '#00f6ff',
                    width: 1,
                    opacity: 0.6,
                    curveness: 0.3
                },
                data: [
                    {
                        coords: [[87.617733, 43.792818], [116.405285, 39.904989]], // 乌鲁木齐 → 北京
                    },
                    {
                        coords: [[114.298572, 30.584355], [116.405285, 39.904989]], // 武汉 → 北京
                    },
                    {
                        coords: [[106.504962, 29.533155], [116.405285, 39.904989]], // 重庆 → 北京
                    }
                    // 可继续添加其他城市飞向中心点
                ]
            },
            {
                name: '目的地',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                rippleEffect: {
                    brushType: 'stroke'
                },
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{b}',
                    color: '#fff'
                },
                symbolSize: 8,
                itemStyle: {
                    color: '#ff6a00'
                },
                data: [
                    { name: '北京', value: [116.405285, 39.904989] },
                    { name: '乌鲁木齐', value: [87.617733, 43.792818] },
                    { name: '武汉市', value: [114.298572, 30.584355] },
                    { name: '重庆市', value: [106.504962, 29.533155] }
                ]
            }
        ]
    })

});
</script>

<style scoped>
.box4 {
    width: 100%;
    height: 100%;
}
</style>