<script setup>
import { ref, onMounted } from "vue";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
// import imageUrl from "../img/Map.jpg";
import Introducation from "./introducation.vue";
import { Close } from "@element-plus/icons-vue";
import axios from "axios";

const imageUrl = "https://s21.ax1x.com/2024/05/28/pk1he0S.jpg";
let opacity = ref([0.8, 0.8, 0.8, 0.8]);
let showCard = ref(false);
let title = ref(null);
let cover = ref(null);
let introduction = ref(null);
let boothCache = [];
let extraZoomRef = ref(1);
let firstLoading = ref(true);

function closeCard() {
  opacity.value = [0.8, 0.8, 0.8, 0.8];
  showCard.value = false;
}

//websocket
const map = ref(null);
const socket = ref(null);
const reconnectInterval = 5000; // 5秒后重连
const maxReconnectAttempts = 10; // 最多尝试重连10次
let reconnectAttempts = 0;

const connectWebSocket = () => {
  socket.value = new WebSocket(import.meta.env.VITE_WS_URL);

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
    url: `${import.meta.env.VITE_API_URL}/get_booths`,
  }).then(res => {
    updateMap(res.data);
    console.log(res.data);
  });
}
const updateMap = data => {
  boothCache.forEach(booth => {
    booth.removeFrom(map.value);
  });
  boothCache = data.map((item, index) => {
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
    let booth = L.marker(
      [
        item.position.y * extraZoomRef.value,
        item.position.x * extraZoomRef.value,
      ],
      {
        icon: Booth,
      },
    ).addTo(map.value);
    booth.on("click", () => {
      title.value = item.name;
      introduction.value = item.card.info;
      cover.value = item.card.cover;
      showCard.value = true;
      if (opacity.value[index] == 0.8) {
        opacity.value = [0.8, 0.8, 0.8, 0.8];
        console.log(opacity.value);
        opacity.value[index] = 1;
      } else {
        opacity.value = [0.8, 0.8, 0.8, 0.8];
        showCard.value = false;
        console.log(opacity.value[index]);
      }
    });
    firstLoading.value = false;
    return booth;
  });
};

onMounted(() => {
  let { width, height, extraZoom } = JSON.parse(
    import.meta.env.VITE_MAP_IMG_DETAIL ??
      JSON.stringify({
        width: 100,
        height: 100,
        extraZoom: 1,
      }),
  );

  extraZoomRef.value = extraZoom;

  console.log({ width, height, extraZoom });

  width *= extraZoom;
  height *= extraZoom;

  let center = L.latLng(width / 3, height / 3);

  map.value = L.map("map", {
    crs: L.CRS.Simple,
    // roomSpan: 0,
    zoomDelta: 0.1,
    zoomSnap: 0,
    minZoom: 0,
    maxZoom: 5,
    attributionControl: false,
  }).setView(center, 1);
  //放图片
  let imageBounds = [
    [0, 0],
    [height, width],
  ];
  L.imageOverlay(imageUrl, imageBounds).addTo(map.value);

  // 边界设定
  let southWest = L.latLng(height * -0.5, width * -0.5),
    northEast = L.latLng([height * 1.5, width * 1.5]);
  let bounds = L.latLngBounds(southWest, northEast);

  // 将maxBounds添加到地图上
  map.value.setMaxBounds(bounds);

  // 图标修改定位时用，点击地图获取坐标
  let popup = L.popup();

  if (import.meta.env.DEV) {
    function onMapClick(e) {
      popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map.value);
    }

    map.value.on("click", onMapClick);
  }
  connectWebSocket();
});
</script>

<template>
  <div
    v-loading.fullscreen.lock="firstLoading"
    element-loading-text="获取地图信息中..."
  >
    <!-- 地图 -->
    <div id="map" class="map" style="background-color: #fff5e3"></div>
    <transition
      enter-active-class="animate__animated animate__zoomIn"
      leave-active-class="animate__animated animate__zoomOut"
    >
      <div class="carousel" v-show="showCard">
        <div class="relative w-fit mx-auto">
          <Introducation
            :title="title"
            :info="introduction"
            :cover="cover"
          ></Introducation>
          <div class="button" @click="closeCard">
            <Close
              style="width: 0.7em; height: 1.1em; margin: auto; color: #000"
            />
          </div>
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
  right: 8px;
  border-radius: 4rem;
  width: 18px;
  height: 18px;
  background-color: rgb(190, 192, 194);
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
  /* text-align: center; */
  z-index: 114514;
  bottom: 30px;
  width: 100%;
  /* height: 120px !important; */
}
</style>
