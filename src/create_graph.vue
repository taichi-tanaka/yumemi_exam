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
    const chartOptions = ref({
      chart: {
        type: 'line',
      },
      title: {
        text: '',
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

    const AddDataToSeries = (
      name: string,
      data: [number, number][],
      visible: boolean = true
    ) => {
      let id = chartOptions.value.series.length;
      chartOptions.value.series.push({
        name: name,
        data: [...data],
        type: 'line',
      } as Highcharts.SeriesOptionsType);
      // インスタンス取得後にシリーズを再描画
      if (chartRef.value && chartRef.value.chart) {
        chartRef.value.chart.addSeries(chartOptions.value.series[id], true);
        if (visible == true) {
          VisibleSeries(id);
        } else {
          HideSeries(id);
        }
      }
      return id;
    };

    const ChangeDataSeries = (id: number, data: [number, number][]) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        if (chart.series[id]) {
          const series = chart.series[id];
          const Visible = series.visible;
          const ShownInLegend = series.options.showInLegend;
          chart.series[id].setData(data, false, false);

          if (Visible) {
            series.setVisible(true, true); // true: 再描画する
          } else {
            series.setVisible(false, true); // 非表示のまま再描画
          }
          series.update({ showInLegend: ShownInLegend }, true);
        }
      }
    };

    const ChangeYAxisTitle = (newTitle: string) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        chart.update({
          yAxis: {
            title: {
              text: newTitle,
            },
          },
        });
      }
    };

    const AllDelleteSeries = () => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        if (chart) {
          // 全てのシリーズを削除
          while (chart.series.length > 0) {
            chart.series[0].remove(true);
          }
        }
      }
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
      AddDataToSeries,
      ChangeDataSeries,
      ChangeYAxisTitle,
      AllDelleteSeries,
      HideSeries,
      VisibleSeries,
    });

    return {
      chartRef,
      chartOptions,
    };
  },
});
</script>

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
