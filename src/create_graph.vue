<template>
  <div class="chart-container">
    <!-- <vue-highcharts :options="chartOptions" ref="chartRef"></vue-highcharts> -->
    <vue-highcharts ref="chartRef" :options="chartOptions"></vue-highcharts>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
  ExtractPropTypes,
  SetupContext,
} from 'vue';
import VueHighcharts from 'vue3-highcharts';
// import Accessibility from 'highcharts/modules/accessibility';

// Accessibility(VueHighcharts.Highcharts);

const propsDefinition = {
  text_xaxis: {
    type: String,
    default: '',
  },
  tooltip: {
    type: String,
    default: '',
  },
};

export default defineComponent({
  name: 'CreateGraph',
  components: {
    VueHighcharts,
  },
  props: propsDefinition,
  setup(
    props: ExtractPropTypes<typeof propsDefinition>,
    { expose }: SetupContext
  ) {
    const chartRef = ref<InstanceType<typeof VueHighcharts> | null>(null);
    const chartOptions = ref<{
      chart: { type: string };
      title: { text: string };
      subtitle: { text: string };
      xAxis: {
        type: string;
        title: { text: string };
        tickInterval: number;
        allowDecimals: boolean;
      };
      yAxis: { title: { text: string } };
      tooltip: { valueSuffix: string };
      series: Array<{ name: string; data: [number, number][]; type: string }>;
    }>({
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
        type: 'linear',
        title: {
          text: props.text_xaxis,
        },
        tickInterval: 1,
        allowDecimals: false,
      },
      yAxis: {
        title: {
          text: '',
        },
      },
      tooltip: {
        valueSuffix: props.tooltip,
      },
      series: [],
    });

    const AddDataToSeries = (
      name: string,
      data: [number, number][],
      visible: boolean = true
    ): Promise<number> => {
      if (!chartOptions.value.series) {
        chartOptions.value.series = [];
      }

      let id = chartOptions.value.series.length;
      chartOptions.value.series.push({
        name: name,
        data: [...data],
        type: 'line',
      });

      if (chartRef.value?.chart) {
        if (chartOptions.value.series[id]) {
          chartRef.value.chart.addSeries(chartOptions.value.series[id], true);
          if (visible) {
            VisibleSeries(id);
          } else {
            HideSeries(id);
          }
        } else {
          console.warn('Series IDが無効です。シリーズが存在しません。');
        }
      } else {
        console.warn('chartRefが存在しないため、シリーズを追加できません。');
      }

      return id;
    };

    const ChangeDataSeries = (id: number, data: [number, number][]): void => {
      if (chartRef.value?.chart) {
        const chart = chartRef.value.chart;
        if (chart.series[id]) {
          const series = chart.series[id];
          const Visible = series.visible;
          const ShownInLegend = series.options.showInLegend;
          chart.series[id].setData(data, false, false);

          if (Visible) {
            series.setVisible(true, true);
          } else {
            series.setVisible(false, true);
          }
          const currentOptions = series.options;
          series.update(
            {
              ...currentOptions,
              showInLegend: ShownInLegend,
            },
            true
          );
        }
      }
    };

    const SetXAxisTitle = (text: string): void => {
      if (chartRef.value?.chart) {
        chartOptions.value.xAxis.title.text = text;
        // chartRef.value.chart.update(chartOptions.value, true);
        // chartRef.value.chart.reflow();
        chartRef.value.chart.update(
          {
            xAxis: {
              title: {
                text: text,
              },
            },
          },
          true
        );
      }
    };

    const SetYAxisTitle = (text: string): void => {
      if (chartRef.value?.chart) {
        chartOptions.value.yAxis.title.text = text;
        // chartRef.value.chart.update(chartOptions.value, true);
        // chartRef.value.chart.reflow();
        chartRef.value.chart.update(
          {
            yAxis: {
              title: {
                text: text,
              },
            },
          },
          true
        );
      }
    };

    const SetTooltip = (text: string): void => {
      if (chartRef.value?.chart) {
        chartRef.value.chart.update({
          tooltip: {
            valueSuffix: text,
          },
        });
      }
    };

    const AllDelleteSeries = (): void => {
      if (chartRef.value?.chart) {
        const chart = chartRef.value.chart;
        while (chart.series.length > 0) {
          chart.series[0].remove(true);
        }
      }
    };

    const HideSeries = (id: number): void => {
      if (chartRef.value?.chart) {
        const chart = chartRef.value.chart;
        if (chart.series[id]) {
          const series = chart.series[id];
          series.setVisible(false, true);
          series.update({ showInLegend: false });
        }
      }
    };

    const VisibleSeries = (id: number): void => {
      if (chartRef.value?.chart) {
        const chart = chartRef.value.chart;
        if (chart.series[id]) {
          const series = chart.series[id];
          series.setVisible(true, true);
          series.update({ showInLegend: true });
        }
      }
    };

    const ResizeChart = (): void => {
      if (chartRef.value && chartRef.value.chart) {
        chartRef.value.chart.reflow();
      }
    };

    onMounted(() => {
      window.addEventListener('resize', ResizeChart);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', ResizeChart);
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
      ResizeChart,
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
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* @media (min-width: 1200px) {
  .chart-container {
    height: 60vh;
    width: 100%;
  }
}

@media (min-width: 768px) and (max-width: 1199px) {
  .chart-container {
    height: 60vh;
    width: 80vh;
  }
}

@media (max-width: 767px) {
  .chart-container {
    height: 40vh;
    width: 40vh;
  }
} */
</style>
