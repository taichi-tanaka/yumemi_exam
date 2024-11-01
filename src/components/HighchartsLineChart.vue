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
        text: '月別平均気温',
      },
      subtitle: {
        text: 'ソース: 気象庁',
      },
      xAxis: {
        categories: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
        title: {
          text: '月',
        },
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
            7.0, 6.9, 9.5, 14.5, 18.2, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6,
          ],
        },
        {
          name: '大阪',
          data: [
            3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8,
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
