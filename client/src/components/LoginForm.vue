<template>
  <div class="auth-form">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="email">メールアドレス</label>
        <input
            id="email"
            v-model="form.email"
            type="email"
            required
            class="form-input"
            placeholder="example@email.com"
        />
      </div>

      <div class="form-group">
        <label for="password">パスワード</label>
        <input
            id="password"
            v-model="form.password"
            type="password"
            required
            class="form-input"
            placeholder="パスワードを入力"
        />
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
              v-model="form.rememberMe"
              type="checkbox"
              class="checkbox"
          />
          ログイン状態を保持する
        </label>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          キャンセル
        </button>
        <button type="submit" class="btn btn-primary">
          ログイン
        </button>
      </div>

      <div class="form-footer">
        <a href="#" class="forgot-password">パスワードを忘れた方はこちら</a>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Emits {
  (e: 'submit', data: { email: string; password: string; rememberMe: boolean }): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

const form = ref({
  email: '',
  password: '',
  rememberMe: false
});

const handleSubmit = () => {
  emit('submit', form.value);
  // フォームをリセット
  form.value = {
    email: '',
    password: '',
    rememberMe: false
  };
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<style scoped>
.auth-form {
  padding: 2rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
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

.form-footer {
  text-align: center;
  margin-top: 1rem;
}

.forgot-password {
  color: #3b82f6;
  font-size: 0.875rem;
  text-decoration: none;
}

.forgot-password:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column;
  }
}
</style>