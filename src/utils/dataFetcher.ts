export async function fetchTasks() {
  const response = await fetch('/api/tasks');
  const data = await response.json();
  console.log('Fetched tasks:', data); // Add logging
  return data;
}
