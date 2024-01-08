<template>
  <!-- 菜单栏 -->
  <div>
    <el-button type="primary" @click="rest">重置</el-button>
    <el-button type="primary" @click="start">开始游戏</el-button>
    <div>你的得分为：{{score}}</div>
  </div>
  <!-- 显示区域 -->
  <div class="box" @click="mousedown" ref="box">
    <div class="mass" v-for="item in itemList" ref="mass" :key="item.id" :style="{
        backgroundColor: item.backgroundColor(),
        left: item.left + 'px',
        top: item.top + 'px'
    }">
      {{ item.number }}
    </div>
    <div class="children" v-for="item in 5" :key="item"></div>
  </div>
</template>

<script  setup>
import { ref, reactive, onMounted, onBeforeMount, onBeforeUnmount, nextTick } from 'vue';
import { dataList, score, mousedown, start, rest } from './data.js';
const mass = ref(null);
const timer = ref(null);
const timerItem = ref(null);
const box = ref(null);
const itemList = ref([]);
const leftMass = ref(0);
const onGoing = ref(true);
onMounted(() => {
    itemList.value = dataList.value;
});
onBeforeUnmount(() => {
    // clearTimeout(timer.value);
});
</script>

<style lang="less" scoped>
.box {
    height: 360px;
    width: 300px;
    position: relative;
    display: flex;
    overflow: hidden;
    border: 1px solid rgb(127, 194, 228);
    border-right: none;
    .children {
        height: 100%;
        flex: 1;
        border-right: 1px solid rgb(127, 194, 228);
        box-sizing: border-box;
    }
    .mass {
        height: 60px;
        width: 60px;
        visibility: visible;
        text-align: center;
        line-height: 60px;
        color: rgb(255, 255, 255);
        position: absolute;
        top: -60px;
        left: 0;
        // border: 1px solid #000000;
        // border-radius: 3px;
    }
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
    }
}
</style>