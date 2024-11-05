<!-- Main.vue -->
<template>
  <div>
    <!-- 子コンポーネントに ref を設定し、イベントをリッスン -->
    <LoadPrefectureID ref="prefectureLoader" @error="HandleError" />
    <LoadPopulationData ref="populationLoader" />

    <!-- ローディング状態の表示 -->
    <div v-if="prefectureLoader?.is_loading">データを読み込み中...</div>

    <!-- エラーメッセージの表示 -->
    <div v-else-if="error">{{ error }}</div>

    <!-- 都道府県リストの表示 -->
    <div v-else-if="prefectures && prefectures.length > 0">
      <div class="checkbox-container">
        <ul class="checkbox-grid">
          <li v-for="prefecture in prefectures" :key="prefecture.prefCode">
            <CheckBox
              :title="prefecture.prefName"
              v-model:is_checked="prefecture.is_checked"
              @change="HandleCheckboxChange(prefecture)"
            />
          </li>
        </ul>
      </div>

      <!-- <p v-for="prefecture in visibleItems" :key="prefecture.prefCode">
        {{ prefecture.prefName }}
      </p> -->

      <!-- <p
        v-if="prefectures && prefectures.length > 0"
        v-for="prefecture in prefectures.filter(
          pref => pref.is_checked === true
        )"
        :key="prefecture.prefCode"
      >
        {{ prefecture.prefName }}
      </p> -->

      <!-- <div
        v-if="prefectures && prefectures.length > 0"
        v-for="prefecture in prefectures.filter(
          pref => pref.is_checked === true
        )"
        :key="prefecture.prefCode"
      >
        {{ prefecture.prefName }}<br />

        <div class="table-container" v-if="prefecture.population">
          <table>
            <thead>
              <tr>
                <th>年</th>
                <th>総人口</th>
                <th>年少人口</th>
                <th>生産年齢人口</th>
                <th>老年人口</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="yearData in getYearData(prefecture)"
                :key="yearData.year"
              >
                <td>{{ yearData.year }}年</td>
                <td>{{ yearData.total.toLocaleString() }}</td>
                <td>{{ yearData.young.toLocaleString() }}</td>
                <td>{{ yearData.working.toLocaleString() }}</td>
                <td>{{ yearData.elderly.toLocaleString() }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div> -->

      <DropdownMenu
        :list="list"
        v-model="dropdown_selected"
        @selected="HandleDropdownSelected"
      ></DropdownMenu
      ><br />

      <CreateGraph ref="creategraphLoader" :text_xaxis="'年'" :tooltip="'人'" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, onMounted, computed } from 'vue';
import CheckBox from './checkbox.vue';
import LoadPrefectureID from './load_prefecture_id.vue';
import LoadPopulationData from './load_population_data.vue';
import CreateGraph from './create_graph.vue';
import DropdownMenu from './dropdown_menu.vue';
import { Prefecture, Population } from './types';

export default defineComponent({
  name: 'Main',
  components: {
    CheckBox,
    LoadPrefectureID,
    LoadPopulationData,
    DropdownMenu,
    CreateGraph,
  },
  setup() {
    type PrefectureCNB = Prefecture & {
      is_checked: Ref<boolean>;
    } & {
      population: Ref<Population | null>;
    } & {
      series_id: Ref<number | null>;
    };
    const prefectures: Ref<PrefectureCNB[]> = ref([]);

    const prefectureLoader: Ref<InstanceType<typeof LoadPrefectureID> | null> =
      ref(null);
    const populationLoader: Ref<InstanceType<
      typeof LoadPopulationData
    > | null> = ref(null);
    const creategraphLoader: Ref<InstanceType<typeof CreateGraph> | null> =
      ref(null);

    const list: string[] = ['総人口', '年少人口', '生産年齢人口', '老年人口'];
    const dropdown_selected = ref<string>(list[0]);
    const unit = ref<string>('　[人]');

    const error = ref<string | null>(null);

    const HandleError = (errorMessage: string) => {
      error.value = errorMessage;
    };

    // 子コンポーネントの getPrefectures を呼び出すメソッド
    const GetPrefectureIDs = async () => {
      if (prefectureLoader.value) {
        let data: Prefecture[] | null = null;
        try {
          data = await prefectureLoader.value.GetPrefectures();
          if (data) {
            prefectures.value = data.map(pref => ({
              ...pref,
              is_checked: ref<boolean>(false),
              population: ref(null),
              series_id: ref(null),
            }));
            error.value = null;
          }
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

    // チェックボックスの変更を処理する関数
    const HandleCheckboxChange = async (prefecture: PrefectureCNB) => {
      // await nextTick();
      if (prefecture.is_checked && !prefecture.population) {
        await GetPopulation(prefecture);
      }
      if (prefecture.population) {
        VisibleGraph(prefecture, dropdown_selected.value);
      }
    };

    // 人口データを取得する関数
    const GetPopulation = async (prefecture: PrefectureCNB) => {
      try {
        if (populationLoader.value) {
          const populationData = await populationLoader.value.GetPopulation(
            prefecture.prefCode
          );
          prefecture.population = populationData;
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getYearData = (prefecture: Prefecture) => {
      if (!prefecture.population) return [];

      const total = prefecture.population.total;
      const young = prefecture.population.young;
      const working = prefecture.population.working;
      const elderly = prefecture.population.elderly;

      // 年ごとにデータをマージ
      return total.map((totalItem: PopulationData, index: number) => {
        return {
          year: totalItem.year,
          total: totalItem.value,
          young: young[index] ? young[index].value : 'N/A',
          working: working[index] ? working[index].value : 'N/A',
          elderly: elderly[index] ? elderly[index].value : 'N/A',
        };
      });
    };

    const SelectedData = (population: Population, selected: string) => {
      let data;
      switch (selected) {
        case '総人口':
          data = population.total;
          break;
        case '年少人口':
          data = population.young;
          break;
        case '生産年齢人口':
          data = population.working;
          break;
        case '老年人口':
          data = population.elderly;
          break;
        default:
          throw new Error('無効な選択肢です');
      }
      return data;
    };

    const ReshapeData = (dataArray: Population[]) => {
      // データ配列をループして、[year, value]の形式で格納
      const reshapedData = dataArray.map(item => [item.year, item.value]);

      // [[year, value], ...] の形状で返す
      return reshapedData;
    };

    const VisibleGraph = (prefecture: PrefectureCNB, selected: string) => {
      try {
        if (creategraphLoader.value) {
          if (prefecture.series_id == null) {
            prefecture.series_id = creategraphLoader.value.AddDataToSeries(
              prefecture.prefName,
              ReshapeData(SelectedData(prefecture.population, selected)),
              true
            );
            creategraphLoader.value.SetYAxisTitle(selected + unit.value);
          } else if (prefecture.is_checked) {
            creategraphLoader.value.VisibleSeries(prefecture.series_id);
          } else {
            creategraphLoader.value.HideSeries(prefecture.series_id);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    const HandleDropdownSelected = (selected: string) => {
      ChangeGraph(selected);
    };

    const ChangeGraph = (selected: string) => {
      try {
        if (
          creategraphLoader.value &&
          populationLoader.value &&
          prefectures.value &&
          prefectures.value.length > 0
        ) {
          creategraphLoader.value.SetYAxisTitle(selected + unit.value);

          for (const prefecture of prefectures.value) {
            // if (prefecture.is_checked) {
            if (prefecture.series_id != null && prefecture.population != null) {
              creategraphLoader.value.ChangeDataSeries(
                prefecture.series_id,
                ReshapeData(SelectedData(prefecture.population, selected))
              );
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    // 初期化時にデータを取得する場合
    onMounted(async () => {
      await GetPrefectureIDs();
    });

    return {
      prefectures,
      prefectureLoader,
      populationLoader,
      creategraphLoader,
      list,
      dropdown_selected,
      error,
      HandleError,
      GetPrefectureIDs,
      HandleCheckboxChange,
      GetPopulation,
      visibleItems,
      getYearData,
      SelectedData,
      ReshapeData,
      VisibleGraph,
      HandleDropdownSelected,
      ChangeGraph,
    };
  },
});
</script>

<!-- <style>
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
</style> -->

<style>
.checkbox-container {
  display: flex; /* フレックスコンテナにする */
  justify-content: center; /* 横方向の中央揃え */
  align-items: center; /* 縦方向の中央揃え */
  height: auto; /* 画面全体の高さから自動高さに変更することで無駄な余白を減らす */
  padding: 10px; /* 必要に応じてパディングを小さく設定する */
  margin: 0; /* 外側の余白を削除することで余白を減らす */
}
.checkbox-grid {
  display: grid;
  gap: 10px; /* 各チェックボックスの間のスペースを設定 */
  list-style-type: none; /* バレットを非表示にする */
  padding: 0; /* パディングを削除 */
  margin: 0; /* マージンを削除 */
}

/* 大きな画面用のデフォルト設定 (デスクトップ) */
@media (min-width: 1200px) {
  .checkbox-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

/* 中サイズの画面用 (タブレット) */
@media (min-width: 768px) and (max-width: 1199px) {
  .checkbox-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

/* 小さい画面用 (スマートフォン) */
@media (max-width: 767px) {
  .checkbox-grid {
    grid-template-columns: repeat(3, 1fr); /* 3列 */
  }
}

.checkbox-grid li {
  text-align: left;
  margin-bottom: 3px;
}
</style>

<!-- <style>
.table-container {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2em;
  min-width: 600px; /* テーブルの最小幅を設定 */
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: right;
}

th {
  background-color: #f2f2f2;
}
</style> -->
