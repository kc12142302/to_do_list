import { useState, useEffect } from 'react'
import './App.css'

const STORAGE_KEY = 'todo-items'

function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch {
      /* storage unavailable */
    }
  }, [tasks])

  function addTask() {
    const text = task.trim()
    if (text === '') return

    setTasks([{ id: Date.now(), text, completed: false }, ...tasks])
    setTask('')
  }

  function deleteTask(id) {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    )
  }

  function clearCompleted() {
    setTasks(tasks.filter((t) => !t.completed))
  }

  const total = tasks.length
  const doneCount = tasks.filter((t) => t.completed).length
  const left = total - doneCount
  const progress = total ? (doneCount / total) * 100 : 0

  const visible = tasks.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed
  )

  const emptyMessage =
    total === 0
      ? 'No tasks yet. Type one above and press Enter.'
      : filter === 'done'
        ? 'Nothing completed yet.'
        : 'All caught up. Nice work.'

  return (
    <div className="app">
      <div className="header">
        <h1>My To-Do List</h1>
        <div className="count" aria-live="polite">
          <b>
            {doneCount}/{total}
          </b>
          done
        </div>
      </div>

      <div className="progress" aria-hidden="true">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter a task"
          aria-label="New task"
          maxLength={120}
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask()
          }}
        />

        <button onClick={addTask}>Add task</button>
      </div>

      <div className="filters" role="group" aria-label="Filter tasks">
        {[
          ['all', 'All'],
          ['active', 'To do'],
          ['done', 'Done'],
        ].map(([value, label]) => (
          <button
            key={value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <ul>
        {visible.map((item) => (
          <li key={item.id} className={item.completed ? 'completed' : ''}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={item.completed}
                aria-label={`Mark "${item.text}" as done`}
                onChange={() => toggleTask(item.id)}
              />
              <span>{item.text}</span>
            </div>
            <button
              className="delete"
              aria-label={`Delete task: ${item.text}`}
              onClick={() => deleteTask(item.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {visible.length === 0 && <p className="empty">{emptyMessage}</p>}

      {total > 0 && (
        <div className="footer">
          <span>{left === 1 ? '1 task left' : `${left} tasks left`}</span>
          {doneCount > 0 && (
            <button className="clear" onClick={clearCompleted}>
              Clear completed
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default App