<template>
  <div id="app">
    <HighchartsLineChart />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
// import HighchartsLineChart from './components/HighchartsLineChart.vue';
import HighchartsLineChart from './components/HighchartsLineChart2.vue';

export default defineComponent({
  name: 'App',
  components: {
    HighchartsLineChart,
  },
});
</script>

<style>
/* グローバルなスタイルを必要に応じて追加 */
</style>
