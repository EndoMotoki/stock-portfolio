<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- ヘッダー -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold text-gray-900">わたしのポートフォリオ</h1>
        <p class="text-gray-600">あなたの投資状況を一目で確認</p>
      </div>

      <!-- 総資産サマリー -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-sm font-medium text-gray-600 mb-2">総評価額</div>
          <div class="text-2xl font-bold">{{ formatCurrency(totalValue) }}</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-sm font-medium text-gray-600 mb-2">総投資額</div>
          <div class="text-2xl font-bold">{{ formatCurrency(totalCost) }}</div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border p-6">
          <div class="text-sm font-medium text-gray-600 mb-2">損益</div>
          <div :class="`text-2xl font-bold flex items-center gap-2 ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`">
            <TrendingUpIcon v-if="totalGainLoss >= 0" class="w-5 h-5" />
            <TrendingDownIcon v-else class="w-5 h-5" />
            {{ formatCurrency(totalGainLoss) }}
          </div>
          <div :class="`text-sm ${totalGainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`">
            ({{ totalGainLossPercent >= 0 ? '+' : '' }}{{ totalGainLossPercent.toFixed(2) }}%)
          </div>
        </div>
      </div>

      <!-- 株式一覧 -->
      <div class="bg-white rounded-lg shadow-sm border">
        <div class="p-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 class="text-lg font-semibold">保有株式</h2>
            <p class="text-sm text-gray-600">現在保有している株式の一覧</p>
          </div>
          <button
              @click="showAddDialog = true"
              class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <PlusIcon class="w-4 h-4" />
            株式を追加
          </button>
        </div>

        <div class="p-6">
          <div v-if="stocks.length === 0" class="text-center py-8 text-gray-500">
            まだ株式が登録されていません。「株式を追加」ボタンから登録してください。
          </div>

          <div v-else class="overflow-x-auto">
            <table class="w-full">
              <thead>
              <tr class="border-b">
                <th class="text-left py-3 px-2">銘柄</th>
                <th class="text-right py-3 px-2">保有株数</th>
                <th class="text-right py-3 px-2">購入単価</th>
                <th class="text-right py-3 px-2">現在価格</th>
                <th class="text-right py-3 px-2">評価額</th>
                <th class="text-right py-3 px-2">損益</th>
                <th class="w-12 py-3 px-2"></th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="stock in stocks" :key="stock.id" class="border-b hover:bg-gray-50">
                <td class="py-4 px-2">
                  <div>
                    <div class="font-medium">{{ stock.name }}</div>
                    <div class="text-sm text-gray-500">{{ stock.symbol }}</div>
                  </div>
                </td>
                <td class="text-right py-4 px-2">{{ stock.shares.toLocaleString() }}株</td>
                <td class="text-right py-4 px-2">{{ formatCurrency(stock.purchasePrice) }}</td>
                <td class="text-right py-4 px-2">{{ formatCurrency(stock.currentPrice) }}</td>
                <td class="text-right py-4 px-2 font-medium">{{ formatCurrency(stock.currentPrice * stock.shares) }}</td>
                <td class="text-right py-4 px-2">
                  <div :class="`flex items-center justify-end gap-1 ${getStockGainLoss(stock) >= 0 ? 'text-green-600' : 'text-red-600'}`">
                    <TrendingUpIcon v-if="getStockGainLoss(stock) >= 0" class="w-4 h-4" />
                    <TrendingDownIcon v-else class="w-4 h-4" />
                    <div>
                      <div class="font-medium">{{ formatCurrency(getStockGainLoss(stock)) }}</div>
                      <div class="text-xs">
                        ({{ getStockGainLossPercent(stock) >= 0 ? '+' : '' }}{{ getStockGainLossPercent(stock).toFixed(2) }}%)
                      </div>
                    </div>
                  </div>
                </td>
                <td class="py-4 px-2">
                  <button
                      @click="removeStock(stock.id)"
                      class="p-1 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <MinusIcon class="w-4 h-4" />
                  </button>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 株式追加ダイアログ -->
    <div v-if="showAddDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div class="p-6 border-b">
          <h3 class="text-lg font-semibold">新しい株式を追加</h3>
          <p class="text-sm text-gray-600 mt-1">保有している株式の情報を入力してください</p>
        </div>

        <div class="p-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">銘柄コード</label>
            <input
                v-model="newStock.symbol"
                type="text"
                placeholder="例: 7203"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">銘柄名</label>
            <input
                v-model="newStock.name"
                type="text"
                placeholder="例: トヨタ自動車"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">保有株数</label>
            <input
                v-model="newStock.shares"
                type="number"
                placeholder="例: 100"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">購入単価（円）</label>
            <input
                v-model="newStock.purchasePrice"
                type="number"
                placeholder="例: 2800"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
          </div>
        </div>

        <div class="p-6 border-t flex justify-end gap-2">
          <button
              @click="showAddDialog = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            キャンセル
          </button>
          <button
              @click="addStock"
              class="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            追加
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PlusIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon } from 'lucide-vue-next'

// リアクティブデータ
const stocks = ref([
  {
    id: '1',
    symbol: '7203',
    name: 'トヨタ自動車',
    shares: 100,
    purchasePrice: 2800,
    currentPrice: 3150,
  },
  {
    id: '2',
    symbol: '9984',
    name: 'ソフトバンクグループ',
    shares: 50,
    purchasePrice: 8500,
    currentPrice: 7800,
  },
  {
    id: '3',
    symbol: '6758',
    name: 'ソニーグループ',
    shares: 30,
    purchasePrice: 12000,
    currentPrice: 13500,
  },
])

const showAddDialog = ref(false)
const newStock = ref({
  symbol: '',
  name: '',
  shares: '',
  purchasePrice: '',
})

// 計算プロパティ
const totalValue = computed(() => {
  return stocks.value.reduce((sum, stock) => sum + stock.currentPrice * stock.shares, 0)
})

const totalCost = computed(() => {
  return stocks.value.reduce((sum, stock) => sum + stock.purchasePrice * stock.shares, 0)
})

const totalGainLoss = computed(() => {
  return totalValue.value - totalCost.value
})

const totalGainLossPercent = computed(() => {
  return totalCost.value > 0 ? (totalGainLoss.value / totalCost.value) * 100 : 0
})

// メソッド
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getStockGainLoss = (stock) => {
  const currentValue = stock.currentPrice * stock.shares
  const purchaseValue = stock.purchasePrice * stock.shares
  return currentValue - purchaseValue
}

const getStockGainLossPercent = (stock) => {
  const gainLoss = getStockGainLoss(stock)
  const purchaseValue = stock.purchasePrice * stock.shares
  return (gainLoss / purchaseValue) * 100
}

const addStock = () => {
  if (newStock.value.symbol && newStock.value.name && newStock.value.shares && newStock.value.purchasePrice) {
    const stock = {
      id: Date.now().toString(),
      symbol: newStock.value.symbol,
      name: newStock.value.name,
      shares: parseInt(newStock.value.shares),
      purchasePrice: parseFloat(newStock.value.purchasePrice),
      currentPrice: parseFloat(newStock.value.purchasePrice), // 初期値として購入価格を設定
    }
    stocks.value.push(stock)
    newStock.value = { symbol: '', name: '', shares: '', purchasePrice: '' }
    showAddDialog.value = false
  }
}

const removeStock = (id) => {
  stocks.value = stocks.value.filter(stock => stock.id !== id)
}
</script>

<style scoped>
/* カスタムスタイルが必要な場合はここに追加 */
</style>