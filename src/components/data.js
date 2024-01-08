import { ref } from "vue";
import { ElMessage } from "element-plus";
let boxTop = [5, 5, 5, 5, 5];
let dataArr = Array.from({ length: 5 }, () => []);
let onGoing = false;
let timerItem = null;
let timer = null;
let offset = -1;
const score = ref(0);
const colorMass = Array.from(
  { length: 500 },
  () => "#" + (((Math.random() + 0.1) * 0xdc143c) << 0).toString(16)
).filter((item, index, arr) => arr.indexOf(item) === index);
const dataList = ref([]);
// 物块原始生成
const fn = () => {
  let countTop = { "-2": 0, "-1": 0 };
  offset = Math.floor(Math.random() * 5); // 0-4
  // if(o)
  const countNumber = Math.ceil(Math.random() * 7);
  const obj = {
    startTop: 0,
    realTop: 60 * boxTop[offset],
    top: -60,
    left: offset * 60,
    number: 2 ** countNumber, // 1-7
    backgroundColor: function () {
      return colorMass[getPowerOfTwo(this.number) - 1];
    },
    id: new Date(),
  };
  boxTop[offset] = boxTop[offset] - 1;
  for (let item of boxTop) {
    if (String(item) in countTop) {
      countTop[String(item)]++;
    }
  }
  dataList.value.push(obj);

  return countTop;
};

// 鼠标控制物块
const mousedown = (e) => {
  if (e.detail === 2 || onGoing) return;
  let len = dataList.value.length - 1;
  let leftMass = Number.parseInt(e.offsetX / 60);
  if (leftMass === offset) return;
  if (dataList.value[len].top + 10 > boxTop[leftMass] * 60) {
    ElMessage.error("高度不够，无法换行！！！");
    return;
  }

  dataList.value[len].realTop = boxTop[leftMass] * 60;
  boxTop[offset]++;
  boxTop[leftMass]--;
  offset = leftMass;
  dataList.value[len].left = leftMass * 60;
};

const massProduce = () => {
  timer = setTimeout(() => {
    const countTop = fn();
    onGoing = false;
    let len = dataList.value.length - 1;
    if (countTop["-2"] > 0 || countTop["-1"] == 5) {
      ElMessage.success("游戏结束，欢迎再次游玩！！！");
      onGoing = true;
      return;
    }
    new Promise((resolve, reject) => {
      timerItem = setInterval(() => {
        dataList.value[len].top += 1;
        if (dataList.value[len].top >= dataList.value[len].realTop) {
          dataArr[offset].unshift(dataList.value[len]);
          resolve();
          clearTimeout(timerItem);
        }
      }, 10);
    }).then(() => {
      onGoing = true;
      const { remove, addNumber } = removeMass(dataArr, offset);
      //   console.log(remove);
      dataList.value.map((item, index) => {
        for (let add of addNumber) {
          if (item.id === add.id) {
            dataList.value[index].number = add.number;
          }
        }
        return item;
      });
      for (let i = 0; i < dataList.value.length; i++) {
        if (remove.includes(dataList.value[i].id)) {
          dataList.value.splice(i, 1);
          i--;
        }
      }
      dataArr[offset] = dataArr[offset].filter(
        (item) => !remove.includes(item.id)
      );
      boxTop[offset] = 5 - dataArr[offset].length;
      //   console.log(boxTop, dataArr, remove);
      massProduce();
    });
  }, 50);
  return timer;
};
// 控制物块的消除
const removeMass = (arr, index) => {
  let remove = [],
    addNumber = [];
  for (let i = 1; i < arr[index].length; i++) {
    if (arr[index][i - 1].number === arr[index][i].number) {
      remove.push(arr[index][i - 1].id);
      arr[index][i].number *= 2;
      score.value++;
      addNumber.push({
        number: arr[index][i].number,
        id: arr[index][i].id,
      });
    }
  }

  return { remove, addNumber };
};

// 重置
const rest = () => {
  boxTop = [5, 5, 5, 5, 5];
  dataArr = Array.from({ length: 5 }, () => []);
  dataList.value.length = 0;
  offset = -1;
  score.value = 0;
  clearTimeout(timer);
  clearInterval(timerItem);
};
const start = () => {
  massProduce();
};

// 计算2的多少次方
function getPowerOfTwo(num) {
  let count = 0;
  // 判断是否是2的幂次方
  while (num > 1) {
    num >>= 1;
    count++;
  }
  return count;
}
export { fn, dataList, mousedown, start, rest, score };
