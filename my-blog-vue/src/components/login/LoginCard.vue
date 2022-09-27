<template>
  <div class="auth-card">
    <slot name="title"></slot>
    <slot name="form"></slot>
  </div>
</template>

<style>
.auth-card {
  display: flex;
  flex-direction: column;
  padding: 3rem 10rem;
  align-items: center;
  justify-content: center;
  background-color: var(--primary-color);
  border: 2px solid var(--primary-border-color);
  border-color: var(--primary-border-color);
  border-radius: 8px;
  width: 25rem;
}
</style>
