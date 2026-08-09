function ProgressList({ entries, onDelete }) {
  return (
    <div className="progress-list">
      {entries.length === 0 ? (
        <p className="empty-state">No progress entries yet. Start by logging your first win.</p>
      ) : (
        entries.map((entry) => (
          <article key={entry.id} className="entry-card">
            <div>
              <h3>{entry.title}</h3>
              <p>{entry.note || 'No notes provided.'}</p>
            </div>
            <div className="entry-meta">
              <span>{entry.minutes} min</span>
              <button type="button" onClick={() => onDelete(entry.id)}>
                Delete
              </button>
            </div>
          </article>
        ))
      )}
    </div>
  );
}

export default ProgressList;
