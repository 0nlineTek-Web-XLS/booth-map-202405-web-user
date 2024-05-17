<script setup>
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import imageUrl from "../img/Map.jpg";
import Introducation from "./introducation.vue";
import { Close } from "@element-plus/icons-vue";
import axios from "axios";

let opacity = ref([0.8, 0.8, 0.8, 0.8]);
let show1 = ref(false);
let title = ref(null);
let cover = ref(null);
let introduction = ref(null);

function close() {
  opacity.value = [0.8, 0.8, 0.8, 0.8];
  show1.value = false;
}

//websocket
const map = ref(null);
const socket = ref(null);
const reconnectInterval = 5000; // 5秒后重连
const maxReconnectAttempts = 10; // 最多尝试重连10次
let reconnectAttempts = 0;

const connectWebSocket = () => {
  socket.value = new WebSocket("wss://api.booth-map-202405.0nline.tech/ws");

  socket.value.addEventListener("open", e => {
    console.log("WebSocket连接已打开");
    reconnectAttempts = 0;
    console.log(e);
    getItem();
  });

  socket.value.addEventListener("message", event => {
    const data = JSON.parse(event.data);
    updateMap(data);
  });

  socket.value.addEventListener("error", error => {
    console.error("WebSocket错误:", error);
  });

  socket.value.addEventListener("close", event => {
    console.log("WebSocket连接已关闭:", event);
    if (reconnectAttempts < maxReconnectAttempts) {
      setTimeout(() => {
        connectWebSocket();
        reconnectAttempts++;
      }, reconnectInterval);
    }
  });
};
function getItem() {
  axios({
    method: "get",
    url: "https://api.booth-map-202405.0nline.tech/get_booths/",
  }).then(res => {
    updateMap(res.data);
    console.log(res.data);
  });
}
const updateMap = data => {
  data.forEach((item, index) => {
    let show = null;
    if (item.show == "count") {
      show = "<div><br><b>" + item.count.toString() + "人</b></div>";
    } else {
      show =
        "<div><p>等待</p><b>" +
        item.minutes.toString() +
        "</b><p>分钟</p></div>";
    }
    let Booth = L.divIcon({
      html: show,
      className: "Booth booth" + index.toString(),
      iconSize: [60, 120],
    });
    //测试数据
    let position = [
      [40.797852, -74.145546],
      [40.792969, -74.087452],
      [40.759766, -74.099651],
      [40.831543, -74.113071],
    ];
    let booth = L.marker(position[index], {
      icon: Booth,
    }).addTo(map.value);
    booth.on("click", () => {
      title.value = item.name;
      introduction.value = item.card.info;
      cover.value = item.cover;
      show1.value = true;
      if (opacity.value[index] == 0.8) {
        opacity.value = [0.8, 0.8, 0.8, 0.8];
        console.log(opacity.value);
        opacity.value[index] = 1;
      } else {
        opacity.value = [0.8, 0.8, 0.8, 0.8];
        show1.value = false;
        console.log(opacity.value[index]);
      }
    });
  });
};

onMounted(() => {
  map.value = L.map("map", {
    crs: L.CRS.Simple,
    roomSpan: 0,
    zoomDelta: 0,
    attributionControl: false,
  }).setView([40.782471, -74.101358], 12);
  map.value.setMinZoom(11);
  map.value.setMaxZoom(14);
  //放图片
  let imageBounds = [
    [40.712216, -74.22655],
    [40.873941, -74.02544],
  ];
  L.imageOverlay(imageUrl, imageBounds).addTo(map.value);

  // 边界设定
  let southWest = L.latLng(40.707601, -74.198167),
    northEast = L.latLng(40.873372, -74.012934);
  let bounds = L.latLngBounds(southWest, northEast);

  // 将maxBounds添加到地图上
  map.value.setMaxBounds(bounds);

  // 图标修改定位时用，点击地图获取坐标
  let popup = L.popup();

  function onMapClick(e) {
    popup
      .setLatLng(e.latlng)
      .setContent("You clicked the map at " + e.latlng.toString())
      .openOn(map.value);
  }

  map.value.on("click", onMapClick);
  connectWebSocket();
});
</script>

<template>
  <div>
    <!-- 地图 -->
    <div id="map" class="map" style="background-color: #fff5e3"></div>
    <transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <div class="carousel" v-show="show1">
        <Introducation
          :title="title"
          :info="introduction"
          :cover="cover"
        ></Introducation>
        <div class="button" @click="close">
          <Close
            style="width: 0.7em; height: 1.1em; margin: auto; color: #000"
          />
        </div>
      </div>
    </transition>
  </div>
</template>

<style>
#map {
  height: 100vh;
}
* {
  margin: 0px;
  padding: 0px;
}

.card {
  background-color: #ffffff;
  text-align: center;
  width: 295px;
  height: 90px;
}
.button {
  display: block;
  position: absolute;
  top: 8px;
  right: 45px;
  border-radius: 4rem;
  width: 18px;
  height: 18px;
  background-color: rgb(190, 192, 194);
}

.img {
  width: 120px;
  height: 100%;
  border-radius: 10px 0px 0px 10px;
}

img {
  width: 120px;
  height: 100%;
  border-radius: 10px 0px 0px 10px;
}

.map {
  position: relative;
  z-index: 1;
}
/*展台css*/
.Booth {
  /*设置相对定位模式 作为绝地定位元素的父元素*/
  text-align: center;
  font-size: 12px;
  font-weight: 700;
  /*定义元素大小、外形*/
  display: block;
  border-radius: 100%;
  width: 55px !important;
  height: 55px !important;
  /*设置元素阴影*/

  /*设置元素背景图样式*/
  background-color: #ffffff;

  /*设置元素动画效果*/
  transform: translate(2px, 30px);
}
.Booth::before {
  content: "";
  /*绝对定位元素*/
  position: absolute;

  /*设置元素位置*/
  bottom: 0;
  left: 50%;

  /*设置元素层级关系,和走马灯一个层级*/
  z-index: -2;

  /*定义元素大小、背景色*/
  display: block;
  margin-left: -5px;
  width: 10px;
  height: 10px;
  background-color: #ffffff;

  /*设置X轴缩放比例、旋转图形、调整Y轴位置*/
  transform: scaleX(1.3) translateY(2px) rotate(45deg);
}
.booth2 {
  opacity: v-bind("opacity[2]");
}
.booth3 {
  opacity: v-bind("opacity[3]");
}
.booth1 {
  opacity: v-bind("opacity[1]");
}
.booth0 {
  opacity: v-bind("opacity[0]");
}

.carousel {
  position: absolute;
  text-align: center;
  z-index: 2;
  bottom: 30px;
  width: 100%;
  height: 120px !important;
}
</style>
