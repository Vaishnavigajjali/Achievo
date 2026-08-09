class User {
  constructor({ id, username, password, streak, lastLoginDate }) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.streak = Number(streak) || 0;
    this.lastLoginDate = lastLoginDate || null;
  }
}

export default User;
