import { useState } from 'react'
import './App.css'

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  function addTask() {
    if (task.trim() === '') return

    setTasks([...tasks, { text: task, completed: false }])
    setTask('')
  }

  function deleteTask(index) {
    setTasks(tasks.filter((_, i) => i !== index))
  }

  function toggleTask(index) {
    setTasks(
      tasks.map((t, i) =>
        i === index ? { ...t, completed: !t.completed } : t
      )
    )
  }

  return (
    <div className="app">
      <h1>My To-Do List</h1>

      <div className="input-area">
        <input
          type="text"
          placeholder="Enter a task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') addTask()
          }}
        />

        <button onClick={addTask}>Add</button>
      </div>

      <ul>
        {tasks.map((item, index) => (
          <li key={index} className={item.completed ? 'completed' : ''}>
            <div className="task-content">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleTask(index)}
              />
              <span>{item.text}</span>
            </div>
            <button onClick={() => deleteTask(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
