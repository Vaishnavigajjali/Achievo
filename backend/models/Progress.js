
class Progress {
  constructor({ id, title, minutes, note, username } = {}) {
    this.id = id;
    this.title = title;
    this.minutes = Number(minutes);
    this.note = note || '';
    this.username = username || null;
  }
}

export default Progress;
