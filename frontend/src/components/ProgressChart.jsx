function ProgressChart({ entries }) {
  if (!entries.length) {
    return <p className="empty-state">Add entries to see your activity trend.</p>;
  }

  const maxMinutes = Math.max(...entries.map((entry) => entry.minutes));

  return (
    <div className="chart">
      {entries.slice(0, 7).map((entry) => (
        <div key={entry.id} className="bar-group">
          <div className="bar" style={{ height: `${Math.max((entry.minutes / maxMinutes) * 100, 12)}%` }} />
          <span>{entry.title}</span>
        </div>
      ))}
    </div>
  );
}

export default ProgressChart;
