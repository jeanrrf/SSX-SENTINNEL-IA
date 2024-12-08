import React from 'react';
import { FaServer, FaMemory, FaMicrochip, FaHdd } from 'react-icons/fa';

interface ServerMetrics {
  status: 'online' | 'offline';
  cpuUsage: number;
  memoryUsage: number;
  diskSpace: number;
  uptime: string;
}

const ServerSection: React.FC = () => {
  // Dados mockados - em produção viriam de uma API
  const serverMetrics: ServerMetrics = {
    status: 'online',
    cpuUsage: 45,
    memoryUsage: 60,
    diskSpace: 75,
    uptime: '15d 6h 30m'
  };

  const getStatusColor = (status: 'online' | 'offline') => {
    return status === 'online' ? 'bg-green-500' : 'bg-red-500';
  };

  const getUsageColor = (usage: number) => {
    if (usage < 50) return 'text-green-500';
    if (usage < 80) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg m-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Status do Servidor</h1>
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor(serverMetrics.status)}`}></div>
          <span className="text-sm text-gray-600 capitalize">{serverMetrics.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaMicrochip className="text-2xl text-blue-600" />
            <h2 className="text-lg font-medium text-gray-700">CPU</h2>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getUsageColor(serverMetrics.cpuUsage)} mb-2`}>
              {serverMetrics.cpuUsage}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${serverMetrics.cpuUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl border border-green-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaMemory className="text-2xl text-green-600" />
            <h2 className="text-lg font-medium text-gray-700">Memória</h2>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getUsageColor(serverMetrics.memoryUsage)} mb-2`}>
              {serverMetrics.memoryUsage}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-green-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${serverMetrics.memoryUsage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Disk Space */}
        <div className="bg-gradient-to-br from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaHdd className="text-2xl text-purple-600" />
            <h2 className="text-lg font-medium text-gray-700">Disco</h2>
          </div>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getUsageColor(serverMetrics.diskSpace)} mb-2`}>
              {serverMetrics.diskSpace}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-purple-600 rounded-full h-2 transition-all duration-300"
                style={{ width: `${serverMetrics.diskSpace}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Uptime */}
        <div className="bg-gradient-to-br from-orange-50 to-white p-6 rounded-xl border border-orange-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <FaServer className="text-2xl text-orange-600" />
            <h2 className="text-lg font-medium text-gray-700">Uptime</h2>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-2">
              {serverMetrics.uptime}
            </div>
            <p className="text-sm text-gray-600">Tempo Online</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerSection;
