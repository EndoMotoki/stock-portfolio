<!--<script setup lang="ts">-->
<!--import { RouterView, RouterLink } from 'vue-router'-->
<!--</script>-->

<!--<template>-->
<!--&lt;!&ndash;  <header>&ndash;&gt;-->
<!--&lt;!&ndash;    <div class="wrapper">&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/">Go to Home</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;      <RouterLink to="/test">Go to Test</RouterLink>&ndash;&gt;-->
<!--&lt;!&ndash;    </div>&ndash;&gt;-->
<!--&lt;!&ndash;  </header>&ndash;&gt;-->

<!--  <main>-->
<!--    <RouterView />-->
<!--  </main>-->
<!--</template>-->

<!--<style scoped>-->
<!--header {-->
<!--  line-height: 1.5;-->
<!--}-->

<!--.logo {-->
<!--  display: block;-->
<!--  margin: 0 auto 2rem;-->
<!--}-->

<!--@media (min-width: 1024px) {-->
<!--  header {-->
<!--    display: flex;-->
<!--    place-items: center;-->
<!--    padding-right: calc(var(&#45;&#45;section-gap) / 2);-->
<!--  }-->

<!--  .logo {-->
<!--    margin: 0 2rem 0 0;-->
<!--  }-->

<!--  header .wrapper {-->
<!--    display: flex;-->
<!--    place-items: flex-start;-->
<!--    flex-wrap: wrap;-->
<!--  }-->
<!--}-->
<!--</style>-->
<template>
  <div id="app">
    <header class="header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1 class="title">
              <span class="icon">📊</span>
              わたしのポートフォリオ
            </h1>
            <p class="subtitle">あなたの株式投資を一元管理！<br>日本株 & 米国株に対応しています。</p>
          </div>
          <div class="header-right">
            <AuthButtons @login="handleLogin" @register="handleRegister" />
          </div>
        </div>
      </div>
    </header>

    <main class="main">
      <div class="container">
        <PortfolioSummary :summary="summary" :stocks="stocks" />

        <div class="content-section">
          <div class="section-header">
            <h2>株式管理</h2>
            <button @click="toggleForm" class="btn btn-primary">
              新しい株式を追加
            </button>
          </div>

          <Modal
              :is-open="showForm"
              :title="editingStock ? '株式情報を編集' : '新しい株式を追加'"
              @close="handleFormCancel"
          >
            <StockForm
                :stock="editingStock"
                :is-edit="!!editingStock"
                @submit="handleStockSubmit"
                @cancel="handleFormCancel"
            />
          </Modal>

          <Modal
              :is-open="showLoginModal"
              title="ログイン"
              @close="handleLoginCancel"
          >
            <LoginForm
                @submit="handleLoginSubmit"
                @cancel="handleLoginCancel"
            />
          </Modal>

          <Modal
              :is-open="showRegisterModal"
              title="新規登録"
              @close="handleRegisterCancel"
          >
            <RegisterForm
                @submit="handleRegisterSubmit"
                @cancel="handleRegisterCancel"
            />
          </Modal>

          <StockTable
              :stocks="stocks"
              @edit="handleEditStock"
              @delete="handleDeleteStock"
          />
        </div>
      </div>
    </main>

    <footer class="footer">
      <div class="container">
        <p>&copy; 2025 わたしのポートフォリオ</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Modal from './components/Modal.vue';
import LoginForm from './components/LoginForm.vue';
import RegisterForm from './components/RegisterForm.vue';
import AuthButtons from './components/AuthButtons.vue';
import StockForm from './components/StockForm.vue';
import StockTable from './components/StockTable.vue';
import PortfolioSummary from './components/PortfolioSummary.vue';
import { useStocks } from './composables/useStocks';
import type { Stock } from './types/stock';

const { stocks, summary, addStock, updateStock, removeStock } = useStocks();

const showForm = ref(false);
const showLoginModal = ref(false);
const showRegisterModal = ref(false);
const editingStock = ref<Stock | null>(null);

const toggleForm = () => {
  showForm.value = !showForm.value;
};

const handleStockSubmit = (stockData: Omit<Stock, 'id'>) => {
  if (editingStock.value) {
    updateStock(editingStock.value.id, stockData);
  } else {
    addStock(stockData);
  }
  showForm.value = false;
  editingStock.value = null;
};

const handleFormCancel = () => {
  showForm.value = false;
  editingStock.value = null;
};

const handleEditStock = (stock: Stock) => {
  editingStock.value = stock;
  showForm.value = true;
};

const handleDeleteStock = (id: string) => {
  removeStock(id);
};

const handleLogin = () => {
  showLoginModal.value = true;
};

const handleRegister = () => {
  showRegisterModal.value = true;
};

const handleLoginSubmit = (data: { email: string; password: string; rememberMe: boolean }) => {
  // ログイン処理をここに実装
  console.log('ログイン:', data);
  showLoginModal.value = false;
  // 実際のアプリケーションでは、ここで認証APIを呼び出します
};

const handleLoginCancel = () => {
  showLoginModal.value = false;
};

const handleRegisterSubmit = (data: { name: string; email: string; password: string }) => {
  // 新規登録処理をここに実装
  console.log('新規登録:', data);
  showRegisterModal.value = false;
  // 実際のアプリケーションでは、ここで登録APIを呼び出します
};

const handleRegisterCancel = () => {
  showRegisterModal.value = false;
};
</script>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f8fafc;
}

.header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  text-align: left;
}

.header-right {
  flex-shrink: 0;
}

.title {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon {
  font-size: 2rem;
}

.subtitle {
  margin: 0.5rem 0 0 0;
  font-size: 1.125rem;
  opacity: 0.9;
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 1.875rem;
  font-weight: 600;
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
  transform: translateY(-1px);
}

.footer {
  background: #1f2937;
  color: white;
  padding: 1.5rem 0;
  text-align: center;
}

.footer p {
  margin: 0;
  opacity: 0.8;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1.5rem;
    text-align: center;
  }

  .header-left {
    text-align: center;
  }

  .title {
    font-size: 2rem;
    justify-content: center;
  }

  .section-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .content-section {
    padding: 1rem;
  }

  .container {
    padding: 0 0.5rem;
  }
}
</style>