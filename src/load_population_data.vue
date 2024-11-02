<template></template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { Prefecture, Population } from './types';

export default defineComponent({
  name: 'LoadPopulationData',
  //   emits: ['populations-loaded', 'error'],
  emits: ['error'],
  setup(props, { emit, expose }) {
    const is_loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const GetPopulation = async (id: string) => {
      is_loading.value = true;
      error.value = null;
      const apiKey = import.meta.env.VITE_RESAS_API_KEY;
      const baseUrl =
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear';

      let rtn_data: Population | null = null;

      try {
        const response = await axios.get(baseUrl, {
          headers: { 'X-API-KEY': apiKey },
          params: { prefCode: id, cityCode: '-' },
        });
        if (response.data && response.data.result) {
          const resultData = response.data.result.data;

          rtn_data = {
            total: resultData[0]?.data || [],
            young: resultData[1]?.data || [],
            working: resultData[2]?.data || [],
            elderly: resultData[3]?.data || [],
          };
          //   emit('populations-loaded', rtn_data);
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message ||
          'ID ${id} 人口データの取得に失敗しました。';
        emit('error', error);
      } finally {
        is_loading.value = false;
      }

      return rtn_data;
    };

    expose({
      is_loading,
      GetPopulation,
    });

    return {
      is_loading,
      error,
    };
  },
});
</script>
