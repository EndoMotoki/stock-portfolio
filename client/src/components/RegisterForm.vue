<template>
  <div class="auth-form">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="name">お名前</label>
        <input
            id="name"
            v-model="form.name"
            type="text"
            required
            class="form-input"
            placeholder="山田太郎"
        />
      </div>

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
            minlength="8"
            class="form-input"
            placeholder="8文字以上のパスワード"
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">パスワード確認</label>
        <input
            id="confirmPassword"
            v-model="form.confirmPassword"
            type="password"
            required
            class="form-input"
            placeholder="パスワードを再入力"
        />
        <div v-if="passwordMismatch" class="error-message">
          パスワードが一致しません
        </div>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input
              v-model="form.agreeToTerms"
              type="checkbox"
              required
              class="checkbox"
          />
          <span>利用規約とプライバシーポリシーに同意する</span>
        </label>
      </div>

      <div class="form-actions">
        <button type="button" @click="handleCancel" class="btn btn-secondary">
          キャンセル
        </button>
        <button type="submit" :disabled="!isFormValid" class="btn btn-primary">
          新規登録
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Emits {
  (e: 'submit', data: { name: string; email: string; password: string }): void;
  (e: 'cancel'): void;
}

const emit = defineEmits<Emits>();

const form = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreeToTerms: false
});

const passwordMismatch = computed(() => {
  return form.value.password !== form.value.confirmPassword && form.value.confirmPassword.length > 0;
});

const isFormValid = computed(() => {
  return form.value.name &&
      form.value.email &&
      form.value.password.length >= 8 &&
      form.value.password === form.value.confirmPassword &&
      form.value.agreeToTerms;
});

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    });
    // フォームをリセット
    form.value = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false
    };
  }
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
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #6b7280;
  cursor: pointer;
  line-height: 1.4;
}

.checkbox {
  width: 1rem;
  height: 1rem;
  accent-color: #3b82f6;
  margin-top: 0.125rem;
  flex-shrink: 0;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.25rem;
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

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
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
  .form-actions {
    flex-direction: column;
  }
}
</style>