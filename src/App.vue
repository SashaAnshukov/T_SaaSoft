<template>
  <div class="list">
    <div class="add">
      <h1>Учётные записи</h1>
      <button
        type ="submit"
        aria-label="addButton"
        class="button buttonAdd"
        @click="createUser"
      >
      </button>
    </div>
    <div class="nameFields">
      <p>Метки</p>
      <p>Тип записи</p>
      <p>Логин</p>
      <p>Пароль</p>
    </div>
    <ul>
      <li class="card" v-for="(user, index) in usersStore.users" :key="index">
        <textarea
          class="labelCard"
          maxlength="50"
          id="label"
          type="text"
          v-model="user.label"
          @blur="usersStore.updateUser(index, { label: user.label })"
        >
        </textarea>

        <div class="select-wrapper">
          <select
            :class="{ 'input-error': !user.type.trim() }"
            name="тип записи"
            id="city-select"
            v-model="user.type"
            @change="usersStore.updateUser(index, { type: user.type })"
          >
            <option value="" disabled>--Выберите тип--</option>
            <option value="Локальная">Локальная</option>
            <option value="LDAP">LDAP</option>
          </select>
        </div>

        <input
          minlength="1"
          maxlength="100"
          id="login"
          type="text"
          :class="{
            'inputCard': user.showPasswordField,
            'inputCard inputCardAdd': !user.showPasswordField,
            'input-error': !user.login.trim()
          }"
          v-model="user.login"
          @blur="usersStore.updateUser(index, { login: user.login })"
          placeholder="Введите логин"
          required
        />
        <div v-if="user.showPasswordField" class="passwordField">
          <input
            minlength="1"
            maxlength="100"
            id="password"
            :type="showPassword === index ? 'text' : 'password'"
            class="inputCard"
            :class="{ 'input-error': !user.password?.trim() }"
            v-model="user.password"
            @blur="usersStore.updateUser(index, { password: user.password })"
            placeholder="Введите пароль"
            required
          />
          <img
            v-if="user.showPasswordField"
            class="icon"
            @click="handleTogglePassword(index)"
            :src="showPassword === index ? '/images/EyeClose.svg' : '/images/Eye.svg'"
            alt="Иконкка для скрытия и показа пароля"
          />
        </div>

        <button
          class="button buttonDelete"
          type="button"
          aria-label="delete"
          @click="deleteUser(index)"
        ></button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import {useUsersStore} from "@/stores/users"
  const usersStore = useUsersStore()
  const showPassword =  ref<number | null>(null);

  onMounted(() => {
    usersStore.loadUsers()
  });

  function createUser() {
    usersStore.createUser();
  }

  function deleteUser(index: number) {
    usersStore.removeUser(index);
  }

  function handleTogglePassword(index: number): void {
    showPassword.value = showPassword.value === index ? null : index;
  }
</script>


<style scoped>
  .list {
    background: rgb(44, 44, 44);
    padding: 50px;
    min-height: 100vh;
  }

  .add {
    display: flex;
    gap: 24px;
    margin: 0 0 32px 0;
  }

  .nameFields {
    display: flex;
    color: #fff;
    margin: 12px 41px;
    gap: 10px;
  }

  .nameFields p {
    max-width: 210px;
    width: 100%;
  }

  h1 {
    color: #fff;
  }

  h1,
  h2,
  p {
    font-family: 'Roboto', sans-serif;
    font-weight: normal;
  }

  p {
    font-size: 18px;
  }

  ul {
    padding: 0;
  }

  .inputCard {
    display: flex;
    justify-content: center;
    align-self: center;
    text-align: center;
    padding: 7px 16px;
    border: 2px solid rgb(44, 44, 44);
    border-radius: 10px;
    max-width: 210px;
    width: 100%;
    max-height: 32px;
    box-sizing: border-box;
    outline: none;
    background-color: #90ee90;;
    font-family: 'Roboto', sans-serif;
    color: #ffff;
    cursor: default;
  }

  .labelCard {
    padding: 7px 16px;
    border: 2px solid rgb(44, 44, 44);
    border-radius: 10px;
    max-width: 210px;
    width: 100%;
    height: 102px;
    outline: none;
    overflow: hidden;
    box-sizing: border-box;
    resize: vertical;
    background-color: #90ee90;
    font-family: 'Roboto', sans-serif;
    color: #ffff;
    cursor: default;
  }

  .inputCardAdd {
    max-width: 430px;
  }

  ::placeholder {
    color: #42b983;
  }

  .select-wrapper {
    position: relative;
    height: fit-content;
    align-self: center;
    max-width: 210px;
    width: 100%;
  }

  .select-wrapper::after {
    content: "";

    position: absolute;
    top: 10px;
    right: 16px;
    display: inline-block;
    padding: 2px;
    width: 2px;
    height: 2px;

    border: solid #848388;
    border-width: 0 2px 2px 0;

    transform: rotate(-45deg);
  }

  select {
    appearance: none;
    width: 200px;
    padding: 4px 16px;
    border-color: #aaa;
    border-radius: 10px;
    color: #ffff;
    background: #90ee90;
    outline: none;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
  }

  .card {
    display: flex;
    justify-content: start;
    gap: 10px;
    text-align: center;
    margin: 25px;
    padding: 7px 16px;
    width: 1015px;
    border: 1px solid #42b983;
    border-radius: 10px;
  }

  .button {
    border: none;
    width: 54px;
    height: 54px;
    padding: 0;
    align-self: center;
    outline: none;
    cursor: pointer;
  }

  .buttonEdit {
    background: url("/images/Edit.svg");
    background-position: center;
    background-repeat: no-repeat;
  }

  .buttonDelete {
    background: url("/images/Trash_white.svg");
    background-position: center;
    background-repeat: no-repeat;
  }

  .buttonAdd {
    background: url("/images/Plus.svg");
    background-position: center;
    background-repeat: no-repeat;
  }

  .input-error {
    border: 1px solid red;
  }

  .passwordField {
    position: relative;
    align-self: center;
    height: fit-content;
  }
  .icon {
    position: absolute;
    top: 6px;
    right: 5px;
    cursor: pointer;
    width: 20px;
    height: 20px;
  }
</style>
