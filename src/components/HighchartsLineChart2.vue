<!-- HighchartsLineChart.vue -->
<template>
  <div>
    <highcharts :options="chartOptions"></highcharts>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';

export default defineComponent({
  name: 'HighchartsLineChart',
  components: {
    highcharts: HighchartsVue.component,
  },
  setup() {
    const chartOptions = ref({
      chart: {
        type: 'line',
      },
      title: {
        text: '都市別年別平均気温',
      },
      subtitle: {
        text: 'ソース: 気象庁',
      },
      xAxis: {
        type: 'linear', // X軸を数値ベースに設定
        title: {
          text: '年',
        },
        tickInterval: 1, // 年ごとの目盛りを表示
        allowDecimals: false,
      },
      yAxis: {
        title: {
          text: '気温 (℃)',
        },
      },
      tooltip: {
        valueSuffix: '℃',
      },
      series: [
        {
          name: '東京',
          data: [
            [2010, 15.2],
            [2011, 14.8],
            [2012, 16.0],
            [2013, 15.5],
            [2014, 16.3],
            [2015, 17.1],
            [2016, 16.8],
          ],
        },
        {
          name: '大阪',
          data: [
            [2010, 14.5],
            [2011, 14.0],
            [2012, 14.8],
            [2013, 14.3],
            [2014, 15.0],
            [2015, 15.7],
            // 大阪は2016年のデータがない
          ],
        },
        {
          name: '名古屋',
          data: [
            [2010, 15.0],
            [2011, 14.7],
            [2012, 15.5],
            [2013, 15.2],
            [2014, 15.8],
            [2015, 16.4],
            [2016, 16.0],
            [2017, 16.5],
          ],
        },
      ],
    });

    return {
      chartOptions,
    };
  },
});
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
