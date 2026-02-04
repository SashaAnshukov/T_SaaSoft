import { defineStore } from 'pinia'
import type { transform } from 'typescript';

interface User {
  label: string;
  type: string;
  login: string;
  password: string | null;
  showPasswordField: boolean;
}

const key = 'users'

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    //showPasswordField: true,
  }),
  getters: {
  },
  actions: {
    loadUsers() {
      const data = localStorage.getItem(key)
      console.log("data", data)
      if (data) {
        const parsed = JSON.parse(data)
        this.users = parsed.map((user: User) => ({
          ...user,
          label: Array.isArray(user.label)
            ? user.label.map((item) => item.text).join('; ')
            : user.label,
        }))
      }
    },
    transformLabel() {
      const usersForStorage = this.users.map(user => ({
        ...user,
        label: user.label
          .split(/[\s;]+/)
          .map(text => text.trim())
          .filter(text => text !== '')
          .map(text => ({ text })),
      }))
      localStorage.setItem(key, JSON.stringify(usersForStorage))
    },
    createUser() {
      this.users.push({
        label: "",
        type: "",
        login:"",
        password:"",
        showPasswordField: true,
      });
      this.transformLabel()
    },
    removeUser(index: number) {
      this.users.splice(index, 1);
      this.transformLabel()
    },
    updateUser(index: number, updatedUser: Partial<User>) {
      const user = this.users[index]
      if (user == null) return
      this.users[index] = {
        label: updatedUser.label ?? user.label,
        type: updatedUser.type ?? user.type,
        login: updatedUser.login ?? user.login,
        password: updatedUser.password ?? (user.type === "LDAP" ? null : user.password),
        showPasswordField: user.type === "LDAP" ? false : true,
      }
      if (this.isUserValid(this.users[index])) {
        this.transformLabel();
      }
    },
    isUserValid(user: User): boolean {
      return (
        (user.label === '' || user.label.trim() !== '') &&
        user.type.trim() !== '' &&
        user.login.trim() !== '' &&
        user.password?.trim() !== ''
      );
    },
  }
})
