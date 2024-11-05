<!-- LoadPrefectureID.vue -->
<template></template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { Prefecture } from './types';

export default defineComponent({
  name: 'LoadPrefectureID',
  emits: ['error'],
  setup(_, { emit, expose }) {
    const is_loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const GetPrefectures = async () => {
      is_loading.value = true;
      error.value = null;
      const apiKey = import.meta.env.VITE_RESAS_API_KEY;
      const prefUrl =
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures';
      let rtn_data: Prefecture[] = [];

      try {
        const response = await axios.get(prefUrl, {
          headers: { 'X-API-KEY': apiKey },
        });

        if (!(response.data && response.data.result)) {
          error.value = '都道府県データが取得できませんでした。';
          emit('error', error.value);
        } else {
          rtn_data = response.data.result;
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || '都道府県データの取得に失敗しました。';
        emit('error', error.value);
      } finally {
        is_loading.value = false;
      }
      return rtn_data;
    };

    // メソッドと状態を公開
    expose({
      is_loading,
      GetPrefectures,
    });

    return {
      is_loading,
      error,
    };
  },
});
</script>

<style></style>
