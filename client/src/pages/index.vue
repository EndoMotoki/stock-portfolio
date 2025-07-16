<!--<template>-->
<!--  <h1>Home</h1>-->
<!--</template>-->

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios'; // npm install axios でインストール

const greetingMessage = ref('');
const userList = ref([]);
const selectedUser = ref(null);
const fetchError = ref(null);

// 例1: 固定の値をフェッチ
const fetchGreeting = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/items');
    if (!response.ok) throw new Error('Failed to fetch greeting');
    const data = await response.json();
    greetingMessage.value = data;
    console.log(data);
  } catch (error) {
    console.error('Error fetching greeting:', error);
    fetchError.value = error.message;
  }
};
//
// // 例2: ユーザーリストをフェッチ
// const fetchUsers = async () => {
//   try {
//     const response = await axios.get('http://localhost:3000/api/users');
//     userList.value = response.data;
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     fetchError.value = error.message;
//   }
// };

// // 例3: 特定のユーザーをフェッチ
// const fetchUserById = async (id) => {
//   try {
//     const response = await axios.get(`http://localhost:3000/api/users/${id}`);
//     selectedUser.value = response.data;
//   } catch (error) {
//     console.error(`Error fetching user ${id}:`, error);
//     fetchError.value = error.message;
//   }
// };

// コンポーネントがマウントされたときにデータをフェッチ
onMounted(() => {
  fetchGreeting();
  // fetchUsers();
  // fetchUserById(1); // 例としてIDが1のユーザーを取得
});
</script>

<template>
  <div>
    <h2>Expressから受け取ったメッセージ:</h2>
    <p v-if="greetingMessage">
      <p v-for="value in greetingMessage">
        {{ value.id }}
        <br>
        {{ value.name }}
      </p>
    </p>

    <p v-else-if="fetchError">エラー: {{ fetchError }}</p>
    <p v-else>メッセージを読み込み中...</p>

    <hr>

    <h2>ユーザーリスト:</h2>
    <ul v-if="userList.length">
      <li v-for="user in userList" :key="user.id">
        {{ user.name }} ({{ user.age }}歳)
      </li>
    </ul>
    <p v-else-if="fetchError">エラー: {{ fetchError }}</p>
    <p v-else>ユーザーを読み込み中...</p>

    <hr>

    <h2>選択されたユーザー:</h2>
    <div v-if="selectedUser">
      <p>ID: {{ selectedUser.id }}</p>
      <p>名前: {{ selectedUser.name }}</p>
      <p>年齢: {{ selectedUser.age }}</p>
    </div>
    <p v-else-if="fetchError">エラー: {{ fetchError }}</p>
    <p v-else>ユーザーを選択していません。</p>
  </div>
</template>