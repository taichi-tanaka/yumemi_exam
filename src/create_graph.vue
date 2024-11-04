<template>
  <div>
    <highcharts :options="chartOptions" ref="chartRef"></highcharts>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, nextTick } from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';

export default defineComponent({
  name: 'HighchartsLineChart',
  components: {
    highcharts: HighchartsVue.component,
  },
  setup(_, { expose }) {
    const chartRef = ref(null); // chartRefを追加
    const num_data = ref<number>(0);
    const chartOptions = ref({
      chart: {
        type: 'line',
      },
      title: {
        text: 'グラフ',
      },
      subtitle: {
        text: '',
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
          text: '',
        },
      },
      tooltip: {
        valueSuffix: '人',
      },
      series: [],
    });

    const AddDataToChart = (name: string, data: [number, number][]) => {
      //   let id = num_data.value;
      //   chartOptions.value.series!.push({
      //     name: name,
      //     data: [...data],
      //     type: 'line',
      //   } as Highcharts.SeriesOptionsType);
      //   num_data.value++;
      //   return id;
      let id = chartOptions.value.series.length;
      chartOptions.value.series.push({
        name: name,
        data: [...data],
        type: 'line',
      } as Highcharts.SeriesOptionsType);
      // インスタンス取得後にシリーズを再描画
      if (chartRef.value && chartRef.value.chart) {
        chartRef.value.chart.addSeries(chartOptions.value.series[id], true);
      }
      return id;
    };

    const HideSeries = (id: number) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        if (chart.series[id]) {
          chart.series[id].setVisible(false, true); // シリーズを非表示にする
          chart.series[id].update({ showInLegend: false });
        }
      }
    };

    const VisibleSeries = (id: number) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        if (chart.series[id]) {
          chart.series[id].setVisible(true, true); // シリーズを表示にする
          chart.series[id].update({ showInLegend: true });
        }
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.chart = Highcharts.chart(
          chartRef.value,
          chartOptions.value
        );
      }
    });

    expose({
      chartRef,
      AddDataToChart,
      HideSeries,
      VisibleSeries,
    });

    return {
      chartRef,
      num_data,
      chartOptions,
    };
  },
});
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
