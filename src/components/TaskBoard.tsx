import React, { useEffect, useState } from 'react';
import { fetchTasks } from '../utils/dataFetcher';

const TaskBoard: React.FC = () => {
  const [tasks, setTasks] = useState([]);

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
      {/* Add your task rendering logic here */}
    </div>
  );
};

export default TaskBoard;
