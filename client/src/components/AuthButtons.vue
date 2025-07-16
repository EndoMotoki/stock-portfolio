<template>
  <div class="auth-buttons">
    <button @click="handleLogin" class="btn btn-outline">
      ログイン
    </button>
    <button @click="handleRegister" class="btn btn-primary">
      新規登録
    </button>
  </div>
</template>

<script setup lang="ts">
interface Emits {
  (e: 'login'): void;
  (e: 'register'): void;
}

const emit = defineEmits<Emits>();

const handleLogin = () => {
  emit('login');
};

const handleRegister = () => {
  emit('register');
};
</script>

<style scoped>
.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn-outline {
  background: transparent;
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

@media (max-width: 640px) {
  .auth-buttons {
    gap: 0.5rem;
  }

  .btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
</style>