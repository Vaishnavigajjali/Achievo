export default class Todo {
  constructor({ id, username, text, completed = false } = {}) {
    this.id = id;
    this.username = username;
    this.text = text;
    this.completed = completed;
  }
}
