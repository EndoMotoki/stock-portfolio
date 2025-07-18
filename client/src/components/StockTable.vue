<template>
  <div class="stock-table">
    <div class="table-header">
      <h3>保有株式一覧</h3>
      <div class="table-actions">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="銘柄名で検索..."
            class="search-input"
        />
      </div>
    </div>

    <div class="table-responsive">
      <table class="table">
        <thead>
        <tr>
          <th>証券コード<br>(ティッカー)</th>
          <th>銘柄名</th>
          <th>保有数量</th>
          <th>取得単価</th>
          <th>現在価格</th>
          <th>評価額</th>
          <th>損益</th>
          <th>損益率</th>
          <th>操作</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="stock in filteredStocks" :key="stock.id">
          <td>{{ stock.code }}</td>
          <td class="stock-name">{{ stock.name }}</td>
          <td>{{ stock.quantity.toLocaleString() }}</td>
          <td>¥{{ stock.purchasePrice.toLocaleString() }}</td>
          <td>¥{{ stock.currentPrice.toLocaleString() }}</td>
          <td>¥{{ (stock.currentPrice * stock.quantity).toLocaleString() }}</td>
          <td class="gain-loss-cell" :class="getGainLossClass(stock)">
            ¥{{ getGainLoss(stock).toLocaleString() }}
          </td>
          <td class="gain-loss-cell" :class="getGainLossClass(stock)">
            {{ getGainLossPercent(stock) }}%
          </td>
          <td>
            <div class="action-buttons">
              <button @click="editStock(stock)" class="btn btn-sm btn-edit">
                編集
              </button>
              <button @click="deleteStock(stock.id)" class="btn btn-sm btn-delete">
                削除
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- モバイル用カードレイアウト -->
    <div class="mobile-card-layout">
      <div v-for="stock in filteredStocks" :key="stock.id" class="stock-card">
        <div class="stock-card-header">
          <div class="stock-info">
            <h4>{{ stock.name }}</h4>
            <div class="stock-code">{{ stock.code }}</div>
          </div>
          <div class="stock-card-actions">
            <button @click="editStock(stock)" class="btn btn-sm btn-edit">
              編集
            </button>
            <button @click="deleteStock(stock.id)" class="btn btn-sm btn-delete">
              削除
            </button>
          </div>
        </div>

        <div class="stock-card-body">
          <div class="stock-detail">
            <div class="stock-detail-label">保有数量</div>
            <div class="stock-detail-value">{{ stock.quantity.toLocaleString() }}株</div>
          </div>

          <div class="stock-detail">
            <div class="stock-detail-label">取得単価</div>
            <div class="stock-detail-value">¥{{ stock.purchasePrice.toLocaleString() }}</div>
          </div>

          <div class="stock-detail">
            <div class="stock-detail-label">現在価格</div>
            <div class="stock-detail-value">¥{{ stock.currentPrice.toLocaleString() }}</div>
          </div>

          <div class="stock-detail">
            <div class="stock-detail-label">評価額</div>
            <div class="stock-detail-value">¥{{ (stock.currentPrice * stock.quantity).toLocaleString() }}</div>
          </div>

          <div class="stock-detail">
            <div class="stock-detail-label">損益</div>
            <div class="stock-detail-value" :class="getGainLossClass(stock)">
              ¥{{ getGainLoss(stock).toLocaleString() }}
            </div>
          </div>

          <div class="stock-detail">
            <div class="stock-detail-label">損益率</div>
            <div class="stock-detail-value" :class="getGainLossClass(stock)">
              {{ getGainLossPercent(stock) }}%
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="filteredStocks.length === 0" class="empty-state">
      <p>{{ searchQuery ? '検索結果がありません' : '株式が登録されていません' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Stock } from '../types/stock';

interface Props {
  stocks: Stock[];
}

interface Emits {
  (e: 'edit', stock: Stock): void;
  (e: 'delete', id: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const searchQuery = ref('');

const filteredStocks = computed(() => {
  if (!searchQuery.value) return props.stocks;
  return props.stocks.filter(stock =>
      stock.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      stock.code.includes(searchQuery.value)
  );
});

const getGainLoss = (stock: Stock) => {
  return (stock.currentPrice - stock.purchasePrice) * stock.quantity;
};

const getGainLossPercent = (stock: Stock) => {
  const percent = ((stock.currentPrice - stock.purchasePrice) / stock.purchasePrice) * 100;
  return percent > 0 ? `+${percent.toFixed(2)}` : percent.toFixed(2);
};

const getGainLossClass = (stock: Stock) => {
  const gainLoss = getGainLoss(stock);
  if (gainLoss > 0) return 'gain';
  if (gainLoss < 0) return 'loss';
  return 'neutral';
};

const editStock = (stock: Stock) => {
  emit('edit', stock);
};

const deleteStock = (id: string) => {
  if (confirm('この株式を削除してもよろしいですか？')) {
    emit('delete', id);
  }
};
</script>

<style scoped>
.stock-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.table-header h3 {
  margin: 0;
  color: #1f2937;
  font-size: 1.5rem;
  font-weight: 600;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.875rem;
  min-width: 200px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.table-responsive {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 1rem;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

.table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.table td {
  color: #1f2937;
}

.stock-name {
  font-weight: 500;
}

.sector-badge {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
}

.gain {
  color: #16a34a;
  font-weight: 500;
}

.loss {
  color: #dc2626;
  font-weight: 500;
}

.neutral {
  color: #6b7280;
}

.gain-loss-cell {
  font-weight: 600;
}

.gain-loss-cell.gain {
  background-color: rgba(22, 163, 74, 0.1);
  color: #16a34a;
}

.gain-loss-cell.loss {
  background-color: rgba(220, 38, 38, 0.1);
  color: #dc2626;
}

.gain-loss-cell.neutral {
  background-color: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

.btn-edit {
  background: #f3f4f6;
  color: #374151;
}

.btn-edit:hover {
  background: #e5e7eb;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover {
  background: #fee2e2;
}

.empty-state {
  padding: 3rem;
  text-align: center;
  color: #6b7280;
}

/* モバイル用カードレイアウト */
.mobile-card-layout {
  display: none;
}

.stock-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
}

.stock-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.stock-info h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
}

.stock-info .stock-code {
  font-size: 0.75rem;
  color: #6b7280;
  margin-top: 0.125rem;
}

.stock-card-actions {
  display: flex;
  gap: 0.5rem;
}

.stock-card-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.stock-detail {
  display: flex;
  flex-direction: column;
}

.stock-detail-label {
  font-size: 0.75rem;
  color: #6b7280;
  margin-bottom: 0.125rem;
}

.stock-detail-value {
  font-size: 0.875rem;
  font-weight: 500;
  color: #1f2937;
}

.stock-detail-value.gain {
  color: #16a34a;
}

.stock-detail-value.loss {
  color: #dc2626;
}

.stock-detail-value.neutral {
  color: #6b7280;
}
@media (max-width: 768px) {
  /* テーブルを非表示にしてカードレイアウトを表示 */
  .table-responsive {
    display: none;
  }

  .mobile-card-layout {
    display: block;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .search-input {
    min-width: auto;
  }

  .btn-sm {
    padding: 0.25rem 0.5rem;
    font-size: 0.625rem;
  }
}
</style>