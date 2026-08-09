import { useEffect, useMemo, useState } from 'react';
import ProgressForm from './components/ProgressForm.jsx';
import ProgressList from './components/ProgressList.jsx';
import ProgressChart from './components/ProgressChart.jsx';
import WaterReminder from './components/WaterReminder.jsx';
import AuthPanel from './components/AuthPanel.jsx';
import TodoPanel from './components/TodoPanel.jsx';

const API_URL = '/api/progress';

function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const loadEntries = async (username) => {
    setLoading(true);
    if (!username) {
      setEntries([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}?username=${encodeURIComponent(username)}`);
      const data = await response.json();
      setEntries(data);
    } catch (error) {
      console.error('Failed to load progress entries', error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries(user ? user.username : null);
  }, [user]);

  const totalMinutes = useMemo(() => entries.reduce((sum, entry) => sum + entry.minutes, 0), [entries]);

  const handleCreate = async (formData) => {
    const payload = user && user.username ? { ...formData, username: user.username } : formData;
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const createdEntry = await response.json();
    setEntries((current) => [createdEntry, ...current]);
  };

  const handleDelete = async (id) => {
    if (user && user.username) {
      await fetch(`${API_URL}/${id}?username=${encodeURIComponent(user.username)}`, { method: 'DELETE' });
    } else {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    }
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Daily momentum</p>
          <h1>Achievo</h1>
          <p className="subtitle">Capture wins, review your weekly effort, and stay consistent.</p>
        </div>
        {user && (
          <div className="stats-card">
            <span className="stat-label">Total minutes</span>
            <strong>{totalMinutes}</strong>
          </div>
        )}
      </header>

      <main className="content-grid">
        {!user ? (
          <section className="panel">
            <h2>Sign in to continue</h2>
            <AuthPanel onAuth={setUser} />
          </section>
        ) : (
          <>
            <section className="panel">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  Signed in as <strong>{user.username}</strong>
                </div>
                <button type="button" onClick={() => setUser(null)}>
                  Sign out
                </button>
              </div>

              <WaterReminder user={user} />
              <ProgressForm onCreate={handleCreate} user={user} />
              <TodoPanel user={user} />
              <ProgressChart entries={entries} />
            </section>

            <section className="panel">
              <h2>Recent progress</h2>
              {loading ? <p>Loading entries...</p> : <ProgressList entries={entries} onDelete={handleDelete} />}
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
