<template>
  <div class="card animate__bounceInRight">
    <el-container>
      <el-aside width="150px" class="img">
        <!-- 换成props.cover -->
        <img :src="props.cover" alt="" @error="setDefaultImage" />
      </el-aside>
      <div>
        <el-main>
          <div class="intro">
            <div class="title">
              {{ props.title }}
              <p class="word">{{ props.info }}</p>
            </div>
          </div>
        </el-main>
      </div>
    </el-container>
  </div>
</template>

<style scoped>
.card {
  display: flexbox;
  width: 295px;
  height: 90px;
  margin: auto;
  background-color: rgb(255, 255, 255);
  border-radius: 10px;
  box-shadow: 1px 2px 2px 0px rgba(0, 0, 0, 0.2);
}
.img {
  background-color: aliceblue;
  display: block;
  height: 90px;
  border-radius: 10px 0px 0px 10px;
}
h3 {
  display: block;
  height: 10px;
}
.intro {
  display: flexbox;
  position: absolute;
  height: 90px;
  width: 90px;
  margin: 0px;
}
.title {
  cursor: pointer;
  display: grid;
  position: absolute;
  top: 0;
  left: 0;
  font-family: "STXingkai";
  font-size: 20px;
}
.word {
  display: grid;
  font-size: small;
}
</style>

<script setup>
import { defineProps, ref } from "vue";
import imgUrl from "../img/404.png";

const ks = ref(imgUrl);
const props = defineProps({
  title: String,
  cover: String,
  info: String,
});

function setDefaultImage(event) {
  event.target.src = imgUrl;
}
</script>
