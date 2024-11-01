<!-- LoadPrefectureID.vue -->
<template>
  <!-- <div v-if="is_loading">データを取得中...</div>
  <div v-else-if="err_mag">{{ err_mag }}</div> -->
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import { Prefecture } from './types';

export default defineComponent({
  name: 'LoadPrefectureID',
  emits: ['prefectures-loaded', 'error'],
  setup(props, { emit, expose }) {
    const is_loading = ref<boolean>(false);
    const error = ref<string | null>(null);

    const GetPrefectures = async () => {
      is_loading.value = true;
      error.value = null;
      const apiKey = import.meta.env.VITE_RESAS_API_KEY;
      const prefUrl =
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures';

      try {
        const response = await axios.get(prefUrl, {
          headers: { 'X-API-KEY': apiKey },
        });

        if (!(response.data && response.data.result)) {
          error.value = '都道府県データが取得できませんでした。';
          emit('error', error);
        } else {
          emit('prefectures-loaded', response.data.result as Prefecture[]);
        }
      } catch (err: any) {
        error.value =
          err.response?.data?.message || '都道府県データの取得に失敗しました。';
        emit('error', error);
      } finally {
        is_loading.value = false;
      }
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

<style scoped>
/* 必要に応じてスタイルを追加 */
</style>
