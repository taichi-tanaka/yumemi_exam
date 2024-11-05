<template>
  <div class="chart-container">
    <highcharts :options="chartOptions" ref="chartRef"></highcharts>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, onMounted, onBeforeUnmount } from 'vue';
import Highcharts from 'highcharts';
import HighchartsVue from 'highcharts-vue';

export default defineComponent({
  name: 'HighchartsLineChart',
  components: {
    highcharts: HighchartsVue.component,
  },
  props: {
    text_xaxis: {
      type: String,
      default: '',
    },
    tooltip: {
      type: String,
      default: '',
    },
  },
  setup(props, { expose }) {
    const chartRef = ref(null); // chartRefを追加
    const chartOptions = ref({
      chart: {
        type: 'line',
        events: {
          load: function () {
            const chart = this;
            // ウィンドウリサイズ時にグラフのサイズを自動調整
            window.addEventListener('resize', function () {
              chart.reflow();
            });
          },
        },
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
          text: '',
        },
        tickInterval: 1, // 年ごとの目盛りを表示
        allowDecimals: false,
      },
      yAxis: {
        title: {
          text: props.text_xaxis,
        },
      },
      tooltip: {
        valueSuffix: props.tooltip,
      },
      series: [],
      // responsive: {
      //   rules: [
      //     {
      //       condition: {
      //         maxWidth: 500,
      //       },
      //       chartOptions: {
      //         legend: {
      //           align: 'center',
      //           verticalAlign: 'bottom',
      //           layout: 'horizontal',
      //         },
      //         yAxis: {
      //           title: {
      //             text: '',
      //           },
      //         },
      //       },
      //     },
      //   ],
      // },
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

    const SetXAxisTitle = (text: string) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        chart.update({
          xAxis: {
            title: {
              text: text,
            },
          },
        });
      }
    };

    const SetYAxisTitle = (text: string) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        chart.update({
          yAxis: {
            title: {
              text: text,
            },
          },
        });
      }
    };

    const SetTooltip = (text: string) => {
      if (chartRef.value && chartRef.value.chart) {
        const chart = chartRef.value.chart;
        chart.update({
          tooltip: {
            valueSuffix: text, // ツールチップの後に付けるテキストを設定
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

    const resizeChart = () => {
      if (chartRef.value && chartRef.value.chart) {
        chartRef.value.chart.reflow();
      }
    };

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.chart = Highcharts.chart(
          chartRef.value,
          chartOptions.value
        );

        // const observer = new ResizeObserver(() => {
        //   if (chartRef.value && chartRef.value.chart) {
        //     chartRef.value.chart.reflow();
        //   }
        // });

        // const container = document.querySelector('.chart-container');
        // if (container) {
        //   observer.observe(container);
        // }

        window.addEventListener('resize', resizeChart);
      }
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeChart);
    });

    expose({
      chartRef,
      AddDataToSeries,
      SetXAxisTitle,
      SetYAxisTitle,
      SetTooltip,
      ChangeDataSeries,
      AllDelleteSeries,
      HideSeries,
      VisibleSeries,
      resizeChart,
    });

    return {
      chartRef,
      chartOptions,
    };
  },
});
</script>

<style scoped>
.chart-container {
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

@media (min-width: 1200px) {
  .chart-container {
    height: 100vh;
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .chart-container {
    height: 60vh;
    width: 60vh;
  }
}

@media (max-width: 767px) {
  .chart-container {
    height: 40vh;
    width: 40vh;
  }
}
</style>
