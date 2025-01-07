import React from 'react';
import { clientStorage } from '../services/clientStorage';
import { projectStorage } from '../services/projectStorage';
import { taskStorage } from '../services/taskStorage';

interface DatabaseViewerProps {
  data?: Record<string, unknown>;
  columns?: Array<{ key: string; label: string }>;
}

const DatabaseViewer: React.FC<DatabaseViewerProps> = () => {
  const getAllData = () => {
    const clients = clientStorage.getAll();
    const projects = projectStorage.getAll();
    const tasks = taskStorage.getAll();

    return {
      clients,
      projects,
      tasks
    };
  };

  const data = getAllData();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-200">Database Viewer</h1>
      
      {Object.entries(data).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-300">{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
          <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-700">
                  {Object.keys((items as any[])[0] || {}).map(header => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {(items as any[]).map((item, index) => (
                  <tr key={index} className="hover:bg-gray-700">
                    {Object.values(item).map((value, i) => (
                      <td key={i} className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DatabaseViewer;
