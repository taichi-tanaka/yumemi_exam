<template>
  <div>
    <h1>47都道府県の年別人口データ</h1>

    <!-- ローディング中の表示 -->
    <div v-if="isLoading">データを読み込み中...</div>

    <!-- エラーメッセージの表示 -->
    <div v-else-if="errorMessage">
      <p>{{ errorMessage }}</p>
    </div>

    <!-- データの表示 -->
    <ul v-else>
      <li v-for="prefecture in prefectures" :key="prefecture.prefCode">
        <h2>{{ prefecture.prefName }}</h2>

        <!-- 人口データのテーブル -->
        <div class="table-container">
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
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

interface PopulationData {
  year: number;
  value: number;
}

interface Population {
  total: PopulationData[];
  young: PopulationData[];
  working: PopulationData[];
  elderly: PopulationData[];
}

interface Prefecture {
  prefCode: number;
  prefName: string;
  population?: Population;
}

export default defineComponent({
  name: 'App',
  setup() {
    // リアクティブなデータの定義
    const prefectures = ref<Prefecture[]>([]); // `ref` を使用して配列を初期化
    const isLoading = ref<boolean>(true); // ローディング状態の管理
    const errorMessage = ref<string>(''); // エラーメッセージの管理

    /**
     * 都道府県一覧を取得するメソッド
     */
    const fetchPrefectures = async () => {
      const apiKey = import.meta.env.VITE_RESAS_API_KEY; // 環境変数からAPIキーを取得
      // const prefUrl = 'https://opendata.resas-portal.go.jp/api/v1/prefectures';
      const prefUrl =
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures';

      try {
        const response = await axios.get(prefUrl, {
          headers: { 'X-API-KEY': apiKey },
        });

        if (response.data && response.data.result) {
          prefectures.value = response.data.result;
          await fetchPopulationData();
        } else {
          throw new Error('都道府県データが取得できませんでした。');
        }
      } catch (error) {
        console.error('都道府県データの取得に失敗しました:', error);
        errorMessage.value = '都道府県データの取得に失敗しました。';
      }
    };

    /**
     * 各都道府県の人口データを取得するメソッド
     */
    const fetchPopulationData = async () => {
      const apiKey = import.meta.env.VITE_RESAS_API_KEY; // 環境変数からAPIキーを取得
      const baseUrl =
        'https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear';

      // 各都道府県ごとにAPIリクエストを作成
      const requests = prefectures.value.map((prefecture: Prefecture) => {
        return axios
          .get(baseUrl, {
            headers: { 'X-API-KEY': apiKey },
            params: { prefCode: prefecture.prefCode, cityCode: '-' },
          })
          .then(response => {
            if (response.data && response.data.result) {
              const dataSets = response.data.result.data;

              // 各人口データを格納
              prefecture.population = {
                total: dataSets[0].data, // 総人口
                young: dataSets[1].data, // 年少人口
                working: dataSets[2].data, // 生産年齢人口
                elderly: dataSets[3].data, // 老年人口
              };
            } else {
              console.error(
                `都道府県コード ${prefecture.prefCode} の人口データが取得できませんでした。`
              );
            }
          })
          .catch(error => {
            console.error(
              `都道府県コード ${prefecture.prefCode} の人口データ取得に失敗しました:`,
              error
            );
          });
      });

      // すべてのリクエストが完了するのを待つ
      await Promise.all(requests);
    };

    /**
     * 各都道府県の年別人口データを整形して返すメソッド
     * @param {Prefecture} prefecture - 都道府県オブジェクト
     * @returns {Array} - 年別の人口データ配列
     */
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

    // コンポーネント作成時にデータ取得を開始
    fetchPrefectures()
      .catch(error => {
        console.error('データ取得中にエラーが発生しました:', error);
        errorMessage.value =
          'データの取得に失敗しました。後ほど再試行してください。';
      })
      .finally(() => {
        isLoading.value = false;
      });

    // setup 関数から公開するデータとメソッド
    return {
      prefectures,
      isLoading,
      errorMessage,
      getYearData,
    };
  },
});
</script>

<style>
/* テーブルコンテナにスクロールを追加 */
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

h2 {
  margin-top: 1.5em;
}
</style>
