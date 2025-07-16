<template>
  <div class="stock-form">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="code">証券コード(ティッカー)</label>
        <input
            id="code"
            v-model="form.code"
            type="text"
            required
            class="form-input"
            placeholder="例: 7203"
        />
      </div>

<!--      <div class="form-group">-->
<!--        <label for="name">銘柄名</label>-->
<!--        <input-->
<!--            id="name"-->
<!--            v-model="form.name"-->
<!--            type="text"-->
<!--            required-->
<!--            class="form-input"-->
<!--            placeholder="例: トヨタ自動車"-->
<!--        />-->
<!--      </div>-->

      <div class="form-row">
        <div class="form-group">
          <label for="quantity">保有数量</label>
          <input
              id="quantity"
              v-model.number="form.quantity"
              type="number"
              min="1"
              required
              class="form-input"
              placeholder="100"
          />
        </div>

        <div class="form-group">
          <label for="purchasePrice">取得単価</label>
          <input
              id="purchasePrice"
              v-model.number="form.purchasePrice"
              type="number"
              min="1"
              required
              class="form-input"
              placeholder="2800"
          />
        </div>
      </div>

<!--      <div class="form-group">-->
<!--        <label for="currentPrice">現在価格</label>-->
<!--        <input-->
<!--            id="currentPrice"-->
<!--            v-model.number="form.currentPrice"-->
<!--            type="number"-->
<!--            min="1"-->
<!--            required-->
<!--            class="form-input"-->
<!--            placeholder="2950"-->
<!--        />-->
<!--      </div>-->

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          キャンセル
        </button>
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? '更新' : '追加' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { Stock } from '../types/stock';

interface Props {
  stock?: Stock | null;
  isEdit?: boolean;
}

interface Emits {
  (e: 'submit', stock: Omit<Stock, 'id'>): void;
  (e: 'cancel'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const form = ref({
  code: '',
  name: '',
  quantity: 0,
  purchasePrice: 0,
  currentPrice: 0,
});

watchEffect(() => {
  if (props.stock) {
    form.value = {
      code: props.stock.code,
      name: props.stock.name,
      quantity: props.stock.quantity,
      purchasePrice: props.stock.purchasePrice,
      currentPrice: props.stock.currentPrice,
    };
  }
});

const handleSubmit = () => {
  emit('submit', form.value);
  if (!props.isEdit) {
    form.value = {
      code: '',
      name: '',
      quantity: 0,
      purchasePrice: 0,
      currentPrice: 0,
    };
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.stock-form {
  padding: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

.form-input {
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

@media (max-width: 640px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>