import React, { useState, useEffect } from 'react';
import { FaChartBar, FaClock, FaBuilding } from 'react-icons/fa';
import { clientStorage } from '../../services/clientStorage';
import { reportService, ReportFilters, TimeReport, ClientTimeReport, StatusTimeReport } from '../../services/reportService';
import { formatDuration } from '../../utils/timeUtils';

const ReportsSection: React.FC = () => {
    const [filters, setFilters] = useState<ReportFilters>({
        startDate: new Date(new Date().setDate(1)).toISOString().split('T')[0], // Início do mês
        endDate: new Date().toISOString().split('T')[0], // Hoje
        period: 'monthly',
        clientId: undefined,
        projectId: undefined,
        status: undefined
    });

    const [timeReport, setTimeReport] = useState<TimeReport | null>(null);
    const [clientReports, setClientReports] = useState<ClientTimeReport[]>([]);
    const [statusReports, setStatusReports] = useState<StatusTimeReport[]>([]);
    const [clients] = useState(clientStorage.getAll());

    // Atualizar relatórios quando os filtros mudarem
    useEffect(() => {
        updateReports();
    }, [filters]);

    const updateReports = () => {
        setTimeReport(reportService.getTimeReport(filters));
        setClientReports(reportService.getClientReport(filters));
        setStatusReports(reportService.getStatusReport(filters));
    };

    const handlePeriodChange = (period: ReportFilters['period']) => {
        const dates = reportService.getPeriodDates(period);
        setFilters(prev => ({
            ...prev,
            ...dates,
            period
        }));
    };

    return (
        <div className="p-6">
            {/* Filtros */}
            <div className="glass-card p-4 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar /> Filtros do Relatório
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Período */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Período</label>
                        <select
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                            value={filters.period}
                            onChange={(e) => handlePeriodChange(e.target.value as ReportFilters['period'])}
                        >
                            <option value="daily">Diário</option>
                            <option value="weekly">Semanal</option>
                            <option value="monthly">Mensal</option>
                            <option value="yearly">Anual</option>
                        </select>
                    </div>

                    {/* Data Início */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Data Início</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                            value={filters.startDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        />
                    </div>

                    {/* Data Fim */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Data Fim</label>
                        <input
                            type="date"
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                            value={filters.endDate}
                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        />
                    </div>

                    {/* Cliente */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Cliente</label>
                        <select
                            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                            value={filters.clientId || ''}
                            onChange={(e) => setFilters(prev => ({ 
                                ...prev, 
                                clientId: e.target.value ? Number(e.target.value) : undefined,
                                projectId: undefined // Resetar projeto ao mudar cliente
                            }))}
                        >
                            <option value="">Todos os Clientes</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>{client.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Resumo Geral */}
            {timeReport && (
                <div className="glass-card p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <FaClock /> Tempo Total
                    </h2>
                    <div className="text-3xl font-bold text-blue-400">
                        {formatDuration(timeReport.totalTime)}
                    </div>
                </div>
            )}

            {/* Relatório por Status */}
            <div className="glass-card p-4 mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaChartBar /> Tempo por Status
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {statusReports.map(report => (
                        <div key={report.status} className="p-4 rounded-lg bg-gray-800">
                            <h3 className="font-semibold mb-2 capitalize">{report.status}</h3>
                            <div className="text-2xl font-bold text-blue-400">
                                {formatDuration(report.totalTime)}
                            </div>
                            <div className="text-sm text-gray-400">
                                {report.totalTasks} tarefas
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Relatório por Cliente */}
            <div className="glass-card p-4">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <FaBuilding /> Tempo por Cliente
                </h2>
                <div className="space-y-6">
                    {clientReports.map(client => (
                        <div key={client.clientId} className="border-b border-gray-700 pb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">{client.clientName}</h3>
                                <div className="text-2xl font-bold text-blue-400">
                                    {formatDuration(client.totalTime)}
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {client.projects.map(project => (
                                    <div key={project.projectId} className="p-4 rounded-lg bg-gray-800">
                                        <h4 className="font-medium mb-2">{project.projectName}</h4>
                                        <div className="text-xl font-bold text-blue-400">
                                            {formatDuration(project.totalTime)}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {project.tasks.length} tarefas
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReportsSection;
