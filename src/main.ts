import { createApp } from 'vue';
import './style.css';
// import App from './App2.vue';
// import App from './App_testgraph.vue';
// import HighchartsVue from 'highcharts-vue';

// const app = createApp(App);
// app.use(HighchartsVue);
// app.mount('#app');

import Main from './main.vue';
const App = createApp(Main);
App.mount('#app');
