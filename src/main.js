import "reset-css";
import "@unocss/reset/tailwind.css";
import "./assets/main.css";
import "element-plus/dist/index.css";
import TDesign from "tdesign-mobile-vue";
import "tdesign-mobile-vue/es/style/index.css";
import "animate.css";
import "uno.css";

import ElementPlus from "element-plus";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(router);
app.use(ElementPlus);
app.use(TDesign);

app.mount("#app");
