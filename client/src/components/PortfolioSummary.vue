<template>
  <div class="portfolio-summary">
    <div class="summary-grid">
      <div class="summary-card">
        <div class="card-header">
          <h3>評価額</h3>
          <div class="icon">💰</div>
        </div>
        <div class="card-value">
          ¥{{ summary.totalValue.toLocaleString() }}
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <h3>投資額</h3>
          <div class="icon">💴</div>
        </div>
        <div class="card-value">
          ¥{{ summary.totalCost.toLocaleString() }}
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <h3>損益</h3>
          <div class="icon">📈</div>
        </div>
        <div class="card-value" :class="getGainLossClass(summary.totalGainLoss)">
          {{ summary.totalGainLoss > 0 ? '+' : '' }}¥{{ summary.totalGainLoss.toLocaleString() }}
        </div>
      </div>

      <div class="summary-card">
        <div class="card-header">
          <h3>損益率</h3>
          <div class="icon">📊</div>
        </div>
        <div class="card-value" :class="getGainLossClass(summary.totalGainLoss)">
          {{ summary.totalGainLossPercent > 0 ? '+' : '' }}{{ summary.totalGainLossPercent.toFixed(2) }}%
        </div>
      </div>
    </div>

    <div class="portfolio-stats">
      <div class="stat-item">
        <span class="stat-label">保有銘柄数</span>
        <span class="stat-value">{{ stockCount }}銘柄</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">最終更新</span>
        <span class="stat-value">{{ currentTime }}</span>
      </div>
      <div class="stat-item">
        <span class="stat-label">ポートフォリオの公開</span>
        <div class="toggle-container">
          <label class="toggle-switch">
            <input 
              type="checkbox" 
              v-model="isPublic" 
              @change="handleToggleChange"
            />
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label">{{ isPublic ? '公開' : '非公開' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import type { Stock, StockSummary } from '../types/stock';

interface Props {
  summary: StockSummary;
  stocks: Stock[];
}

const props = defineProps<Props>();

const currentTime = ref('');
const isPublic = ref(false);

const stockCount = computed(() => props.stocks.length);

const getGainLossClass = (value: number) => {
  if (value > 0) return 'gain';
  if (value < 0) return 'loss';
  return 'neutral';
};

const updateCurrentTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleString('ja-JP');
};

const handleToggleChange = () => {
  // ここで公開状態の変更をAPIに送信したり、状態を保存したりできます
  console.log('ポートフォリオ公開状態:', isPublic.value ? '公開' : '非公開');
};
onMounted(() => {
  updateCurrentTime();
  setInterval(updateCurrentTime, 60000); // 1分ごとに更新
});
</script>

<style scoped>
.portfolio-summary {
  margin-bottom: 2rem;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.summary-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.summary-card:hover {
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.icon {
  font-size: 1.5rem;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
}

.gain {
  color: #16a34a;
}

.loss {
  color: #dc2626;
}

.neutral {
  color: #6b7280;
}

.portfolio-stats {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  color: #6b7280;
  font-size: 0.875rem;
  font-weight: 500;
}

.stat-value {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
}

.toggle-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #cbd5e1;
  transition: 0.3s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.3s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: #3b82f6;
}

.toggle-switch input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle-switch input:focus + .toggle-slider {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.toggle-label {
  color: #1f2937;
  font-size: 1.125rem;
  font-weight: 600;
  min-width: 40px;
}

@media (max-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .summary-card {
    padding: 1rem;
  }

  .card-header {
    margin-bottom: 0.5rem;
  }

  .card-header h3 {
    font-size: 0.75rem;
  }

  .icon {
    font-size: 1.25rem;
  }

  .card-value {
    font-size: 1.25rem;
  }

  .portfolio-stats {
    padding: 1rem;
    gap: 1rem;
  }

  .stat-item {
    gap: 0.25rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-value {
    font-size: 0.875rem;
  }

  .toggle-container {
    gap: 0.5rem;
  }

  .toggle-switch {
    width: 36px;
    height: 20px;
  }

  .toggle-slider:before {
    height: 14px;
    width: 14px;
    left: 3px;
    bottom: 3px;
  }

  .toggle-switch input:checked + .toggle-slider:before {
    transform: translateX(16px);
  }

  .toggle-label {
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .summary-grid {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }

  .summary-card {
    padding: 0.75rem;
  }

  .card-value {
    font-size: 1.125rem;
  }
}
</style>