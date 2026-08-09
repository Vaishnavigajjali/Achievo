import { useState } from 'react';

function ProgressForm({ onCreate, user }) {
  const [formData, setFormData] = useState({ title: '', minutes: '', note: '' });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!user) return;
    if (!formData.title || !formData.minutes) return;

    await onCreate({
      title: formData.title,
      minutes: Number(formData.minutes),
      note: formData.note
    });

    setFormData({ title: '', minutes: '', note: '' });
  };

  return (
    <form className="progress-form" onSubmit={handleSubmit}>
      <h2>Log progress</h2>
      <label>
        Task
        <input
          value={formData.title}
          onChange={(event) => setFormData({ ...formData, title: event.target.value })}
          placeholder="What did you work on?"
          required
          disabled={!user}
        />
      </label>
      <label>
        Minutes
        <input
          type="number"
          min="1"
          value={formData.minutes}
          onChange={(event) => setFormData({ ...formData, minutes: event.target.value })}
          placeholder="30"
          required
          disabled={!user}
        />
      </label>
      <label>
        Note
        <textarea
          value={formData.note}
          onChange={(event) => setFormData({ ...formData, note: event.target.value })}
          placeholder="Add a short reflection"
          disabled={!user}
        />
      </label>
      <button type="submit" disabled={!user}>{user ? 'Save entry' : 'Sign in to save'}</button>
    </form>
  );
}

export default ProgressForm;
