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
    <div v-else-if="prefectures && prefectures.length > 0">
      <ul class="checkbox-grid">
        <li v-for="prefecture in prefectures" :key="prefecture.prefCode">
          <CheckBox
            :title="prefecture.prefName"
            v-model:is_checked="prefecture.is_checked"
          />
        </li>
      </ul>

      <!-- <p v-for="prefecture in visibleItems" :key="prefecture.prefCode">
        {{ prefecture.prefName }}
      </p> -->

      <p
        v-if="prefectures && prefectures.length > 0"
        v-for="prefecture in prefectures.filter(
          pref => pref.is_checked === true
        )"
        :key="prefecture.prefCode"
      >
        {{ prefecture.prefName }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, computed } from 'vue';
import CheckBox from './checkbox.vue';
import LoadPrefectureID from './load_prefecture_id.vue';
import LoadPopulationData from './load_population_data.vue';
import { Prefecture, Population } from './types';

export default defineComponent({
  name: 'Main',
  components: {
    CheckBox,
    LoadPrefectureID,
    LoadPopulationData,
  },
  setup() {
    type PrefectureCNV = Prefecture & {
      is_checked: Ref<boolean>;
    } & {
      population: Ref<Population | null>;
    };
    const prefectures: Ref<PrefectureCNV[]> = ref([]);

    const prefectureLoader: Ref<InstanceType<typeof LoadPrefectureID> | null> =
      ref(null);
    const populationLoader: Ref<InstanceType<
      typeof LoadPopulationData
    > | null> = ref(null);

    const error = ref<string | null>(null);

    // イベントハンドラで prefectures を設定
    const handlePrefecturesLoaded = (data: Prefecture[]) => {
      prefectures.value = data.map(pref => ({
        ...pref,
        is_checked: ref<boolean>(false),
        population: ref(null),
      }));
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

    const visibleItems = computed(() => {
      // // is_checked が true のアイテムのみを手動で取得
      // let selectedPrefectures: PrefectureWithChecked[] = [];

      // // `for`ループを使って条件に合う要素を手動で選択
      // for (let i = 0; i < prefectures.value.length; i++) {
      //   const pref = prefectures.value[i];
      //   // if (pref.is_checked?.value == true) {
      //   if (pref.is_checked == true) {
      //     selectedPrefectures.push(pref);
      //   }
      // }
      // return selectedPrefectures; // 条件に合う都道府県リストを返す
      return prefectures.value.filter(pref => pref.is_checked === true);
    });

    const GetPopulation = async () => {
      if (populationLoader.value && prefectures && prefectures.length > 0) {
        try {
          for (let id = 0; id < prefectures.value.length; id++) {
            const pref = prefectures.value[id];
            if (pref.is_checked == true) {
              const populationData = await populationLoader.value.GetPopulation(
                pref.prefCode
              );
              pref.population.value = populationData;
            }
          }
        } catch (error) {
          console.error(error);
        }
      }
    };

    // 初期化時にデータを取得する場合
    onMounted(async () => {
      await GetData();
    });

    return {
      prefectures,
      prefectureLoader,
      error,
      handlePrefecturesLoaded,
      handleError,
      GetData,
      GetPopulation,
      visibleItems,
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
