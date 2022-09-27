<script setup lang="ts">
import LoginCard from "../components/login/LoginCard.vue";
import { useLoginStore } from "../stores/login-store";

const loginStore = useLoginStore();

const login = async () => {
  const result = await loginStore.login();
  
};
</script>
<template>
  <LoginCard>
    <template #title>
      <h1>Log in {{ loginStore.email }} {{ loginStore.password }}</h1>
    </template>

    <template #form>
      <div class="form-group">
        <label for="email">Email Address</label>
        <input class="text-input" type="email" v-model="loginStore.email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input
          class="text-input"
          type="password"
          v-model="loginStore.password"
        />
      </div>
      <div class="form-group">
        <button class="button" @click="login">Log in</button>
      </div>
    </template>
  </LoginCard>
</template>

<style>
.form-group {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 1rem 0rem;
}

.form-group button {
  margin-top: 1.5rem;
}

label {
  align-self: flex-start;
}
</style>
