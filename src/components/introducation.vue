<template>
  <div
    :class="[
      'shadow bg-white rounded-md w-80vw max-w-720px',
      'flex flex-row gap-2 pa-2',
      'overflow-hidden',
      'animate__bounceInRight',
    ]"
  >
    <div class="basis-1/3 self-center">
      <!-- 换成props.cover -->
      <img class="" :src="props.cover" alt="" @error="setDefaultImage" />
    </div>
    <div class="flex-1 pa-2">
      <h2 class="text-lg font-medium">{{ props.title }}</h2>
      <p class="text-sm mt-1 indent-6">{{ props.info }}</p>
    </div>
  </div>
</template>

<style scoped></style>

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
