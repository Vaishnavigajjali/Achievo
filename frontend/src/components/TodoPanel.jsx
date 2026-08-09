import { useEffect, useState } from 'react';

function TodoPanel({ user }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  // load from server if user, otherwise localStorage
  useEffect(() => {
    let mounted = true;
    async function load() {
      if (user && user.username) {
        try {
          const res = await fetch(`/api/todos?username=${encodeURIComponent(user.username)}`);
          const data = await res.json();
          if (mounted) setItems(data);
        } catch (e) {
          console.error('Failed to load todos from server', e);
        }
        return;
      }

      try {
        const raw = localStorage.getItem('todos');
        if (raw) setItems(JSON.parse(raw));
      } catch (e) {
        console.error('Failed to load todos', e);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (user && user.username) return; // server persists
    try {
      localStorage.setItem('todos', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save todos', e);
    }
  }, [items, user]);

  const handleAdd = async (evt) => {
    evt.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    if (user && user.username) {
      try {
        const res = await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: user.username, text: trimmed })
        });
        const created = await res.json();
        setItems((cur) => [created, ...cur]);
        setText('');
        return;
      } catch (e) {
        console.error('Failed to create todo', e);
      }
    }

    const newItem = { id: Date.now(), text: trimmed, completed: false };
    setItems((cur) => [newItem, ...cur]);
    setText('');
  };

  const toggle = async (id) => {
    if (user && user.username) {
      const it = items.find((i) => i.id === id);
      if (!it) return;
      try {
        const res = await fetch(`/api/todos/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: !it.completed }),
        });
        const updated = await res.json();
        setItems((cur) => cur.map((c) => (c.id === id ? updated : c)));
        return;
      } catch (e) {
        console.error('Failed to update todo', e);
      }
    }

    setItems((cur) => cur.map((it) => (it.id === id ? { ...it, completed: !it.completed } : it)));
  };

  const remove = async (id) => {
    if (user && user.username) {
      try {
        await fetch(`/api/todos/${id}`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: user.username }) });
        setItems((cur) => cur.filter((it) => it.id !== id));
        return;
      } catch (e) {
        console.error('Failed to delete todo', e);
      }
    }

    setItems((cur) => cur.filter((it) => it.id !== id));
  };

  const remaining = items.filter((i) => !i.completed).length;

  return (
    <div className="todo-panel">
      <h3>To‑do</h3>
      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a quick task"
          aria-label="New todo"
          style={{ flex: 1 }}
        />
        <button type="submit">Add</button>
      </form>

      {items.length === 0 ? (
        <p className="empty-state">No tasks yet. Add a quick todo.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {items.map((item) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0' }}>
              <input type="checkbox" checked={!!item.completed} onChange={() => toggle(item.id)} />
              <span style={{ textDecoration: item.completed ? 'line-through' : 'none', flex: 1 }}>{item.text}</span>
              <button type="button" onClick={() => remove(item.id)} aria-label="Delete todo">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: '#555' }}>{remaining} remaining</div>
    </div>
  );
}

export default TodoPanel;
