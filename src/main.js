import "reset-css";
import "@unocss/reset/tailwind.css";
import "./assets/main.css";
import "element-plus/dist/index.css";
import "animate.css";
import "uno.css";

import ElementPlus from "element-plus";
import { createApp } from "vue";
import App from "./App.vue";

const app = createApp(App);

app.use(ElementPlus);

app.mount("#app");
