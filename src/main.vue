<!-- CheckBoxList.vue -->
<template>
  <div>
    <!-- 子コンポーネントに ref を設定し、イベントをリッスン -->
    <LoadPrefectureID
      ref="prefectureLoader"
      @prefectures-loaded="handlePrefecturesLoaded"
      @error="handleError"
    />

    <!-- ローディング状態の表示 -->
    <div v-if="prefectureLoader?.is_loading">データを読み込み中...</div>

    <!-- エラーメッセージの表示 -->
    <div v-else-if="error">{{ error }}</div>

    <!-- 都道府県リストの表示 -->
    <ul v-else class="checkbox-grid">
      <li v-for="prefecture in prefectures" :key="prefecture.prefCode">
        <CheckBox :title="prefecture.prefName" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import CheckBox from './checkbox.vue';
import LoadPrefectureID from './load_prefecture_id.vue';
import { Prefecture } from './types';

export default defineComponent({
  name: 'Main',
  components: {
    CheckBox,
    LoadPrefectureID,
  },
  setup() {
    const prefectures = ref<Prefecture[]>([]);
    const prefectureLoader = ref<InstanceType<typeof LoadPrefectureID> | null>(
      null
    );
    const error = ref<string | null>(null);

    // イベントハンドラで prefectures を設定
    const handlePrefecturesLoaded = (data: Prefecture[]) => {
      prefectures.value = data;
      error.value = null;
    };

    const handleError = (errorMessage: string) => {
      error.value = errorMessage;
    };

    // 子コンポーネントの getPrefectures を呼び出すメソッド
    const GetData = async () => {
      if (prefectureLoader.value) {
        try {
          await prefectureLoader.value.GetPrefectures();
        } catch (error) {
          console.error(error);
        }
      }
    };

    // 初期化時にデータを取得する場合
    onMounted(() => {
      GetData();
    });

    return {
      prefectures,
      prefectureLoader,
      error,
      handlePrefecturesLoaded,
      handleError,
      GetData,
    };
  },
});
</script>

<style>
.checkbox-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5列 */
  gap: 10px; /* 各チェックボックスの間のスペースを設定 */
  list-style-type: none; /* バレットを非表示にする */
  padding: 0; /* パディングを削除 */
  margin: 0; /* マージンを削除 */
}

.checkbox-grid li {
  text-align: left;
  margin-bottom: 8px;
}

button {
  padding: 8px 16px;
  font-size: 16px;
  margin-top: 20px;
  cursor: pointer;
}
</style>
