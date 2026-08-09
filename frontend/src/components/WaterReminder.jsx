import { useEffect, useMemo, useState } from 'react';

function WaterReminder({ user }) {
  if (!user) return null;
  const [lastDrink, setLastDrink] = useState(() => {
    const saved = localStorage.getItem('achievo-last-drink');
    return saved || null;
  });

  const [streak, setStreak] = useState(() => Number(localStorage.getItem('achievo-streak') || 0));

  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (!('Notification' in window)) return;

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const scheduleReminder = () => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    new Notification('Achievo reminder', {
      body: 'Time for a glass of water. Stay hydrated.'
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      scheduleReminder();
    }, 1000 * 60 * 60 * 2);

    return () => clearInterval(interval);
  }, []);

  const markDrank = () => {
    const now = new Date().toISOString().split('T')[0];
    if (lastDrink !== now) {
      const nextStreak = lastDrink && lastDrink === new Date(Date.now() - 86400000).toISOString().split('T')[0] ? streak + 1 : 1;
      setStreak(nextStreak);
      localStorage.setItem('achievo-streak', String(nextStreak));
      setLastDrink(now);
      localStorage.setItem('achievo-last-drink', now);
    }
  };

  return (
    <div className="reminder-card">
      <h3>Hydration habit</h3>
      <p>{user ? `${user.username}'s current streak` : 'Your current streak'}: <strong>{streak} days</strong></p>
      <button type="button" onClick={markDrank}>I drank water</button>
      <p className="hint">You’ll get a reminder every 2 hours while this app is open.</p>
    </div>
  );
}

export default WaterReminder;
