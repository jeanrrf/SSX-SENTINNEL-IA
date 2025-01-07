import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../utils/dataFetcher';
import { KANBAN_COLUMNS } from '../constants';

interface Task {
  id: number;
  title: string;
  status: string;
}

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    async function loadTasks() {
      const fetchedTasks = await fetchTasks();
      setTasks(fetchedTasks);
    }
    loadTasks();
  }, []);

  useEffect(() => {
    console.log('Displayed tasks:', tasks); // Add logging
  }, [tasks]);

  return (
    <div className="task-board">
      {KANBAN_COLUMNS.map(column => (
        <div key={column.status} className="kanban-column">
          <h2>{column.title}</h2>
          <div className="kanban-cards">
            {tasks.filter(task => task.status === column.status).map(task => (
              <div key={task.id} className="kanban-card">
                {task.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
