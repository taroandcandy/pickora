<template>
    <div class="ranking-box">
        <div class="title">
            <p>热门景区排行</p>
            <img src="../../images/dataScreen-title.png" alt="">
        </div>
        <div class="header">
            <span>排名</span>
            <span>景区</span>
            <span>预约数量</span>
        </div>
        <ul class="ranking-list">
            <li v-for="(item, index) in data" :key="index">
                <div class="rank">NO.{{ index + 1 }}</div>
                <div class="name">{{ item.name }}</div>
                <div class="bar">
                    <div class="percent-text">{{ item.percent }}%</div>
                    <div class="progress">
                        <div class="fill" :style="{ width: item.percent + '%', backgroundColor: item.color }"></div>
                    </div>
                    <div class="value">{{ item.value }}w</div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
const data = [
    { name: '峨眉山', percent: 80, value: 8.00, color: '#3aa0ff' },
    { name: '稻城亚丁', percent: 60, value: 6.00, color: '#ff6b6b' },
    { name: '九寨沟', percent: 50, value: 5.00, color: '#56e6e6' },
    { name: '万里长城', percent: 40, value: 4.00, color: '#f9a825' },
    { name: '北京故宫', percent: 30, value: 3.00, color: '#b388eb' }
]
</script>

<style scoped lang="scss">
.ranking-box {
    width: 100%;
    color: #fff;
    font-size: 14px;
    background: url(../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
        margin-left: 5px;
        margin-top: 30px;

        p {
            color: white;
            font-size: 20px;
        }
    }

    .header {
        display: flex;
        justify-content: space-between;
        padding: 8px 12px;
        background: #182254;
        font-weight: bold;
        margin-top: 55px;
    }

    .ranking-list {
        list-style: none;
        padding: 0;
        margin-top: 10px;

        li {
            display: flex;
            align-items: center;
            padding: 10px 12px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);

            .rank {
                width: 60px;
                font-weight: bold;
                color: #fff;
                background: linear-gradient(to right, #ff9a44, #ff3e3e);
                padding: 4px 8px;
                border-radius: 4px;
                text-align: center;
                margin-right: 10px;
            }

            &:nth-child(2) .rank {
                background: linear-gradient(to right, #ffdb6e, #ffa500);
            }

            &:nth-child(3) .rank {
                background: linear-gradient(to right, #00c6ff, #0072ff);
            }

            &:nth-child(4) .rank {
                background: linear-gradient(to right, #fbc02d, #ffa000);
            }

            &:nth-child(5) .rank {
                background: linear-gradient(to right, #9575cd, #7e57c2);
            }

            .name {
                flex: 1;
            }

            .bar {
                flex: 2;
                display: flex;
                align-items: center;

                .percent-text {
                    width: 40px;
                }

                .progress {
                    flex: 1;
                    height: 10px;
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                    margin: 0 10px;
                    overflow: hidden;

                    .fill {
                        height: 100%;
                        border-radius: 5px;
                        transition: width 0.5s ease;
                    }
                }

                .value {
                    width: 50px;
                    text-align: right;
                }
            }
        }
    }
}
</style>
