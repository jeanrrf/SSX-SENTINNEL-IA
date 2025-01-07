import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, BrowserRouter as Router } from 'react-router-dom';
import { FaUsers, FaFolderOpen, FaTasks, FaChartBar } from 'react-icons/fa';
import Sidebar from './components/Sidebar/Sidebar';
import { ClientsSection } from './components/Clients/ClientsSection';
import ProjectsSection from './components/Projects/ProjectsSection';
import TasksSection from './components/Tasks/TasksSection';
import ReportsSection from './components/Reports/ReportsSection';
import DashboardSection from './components/Dashboard/DashboardSection';
import LoginPage from './components/Auth/LoginPage';
import { Timer } from './components/Timer/Timer';
import { authStorage } from './services/authStorage';
import DatabaseViewer from './components/DatabaseViewer';

const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsLoggedIn(authStorage.isLoggedIn());
    }, []);

    const handleLogin = () => {
        setIsLoggedIn(true);
        navigate('/dashboard');
    };

    const handleLogout = () => {
        authStorage.logout();
        setIsLoggedIn(false);
        navigate('/login');
    };

    if (!isLoggedIn) {
        return <LoginPage onLogin={handleLogin} />;
    }

    const menuItems = [
        { id: 'dashboard', icon: FaChartBar, label: 'Dashboard' },
        { id: 'clients', icon: FaUsers, label: 'Clientes' },
        { id: 'projects', icon: FaFolderOpen, label: 'Projetos' },
        { id: 'tasks', icon: FaTasks, label: 'Tarefas' },
        { id: 'reports', icon: FaChartBar, label: 'Relatórios' },
        { id: 'database', icon: FaChartBar, label: 'Database' }
    ];

    const data = {}; // Replace with actual data
    const columns: Array<{ key: string; label: string }> = []; // Replace with actual columns

    return (
        <Router>
            <div className="flex h-screen bg-gray-900 text-white">
                <Sidebar
                    menuItems={menuItems}
                    activeSection={location.pathname.substring(1) || 'dashboard'}
                    onSectionChange={(section: string) => navigate(`/${section}`)}
                    onLogout={handleLogout}
                />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="bg-gray-800 p-4 shadow-md flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Timer />
                            <div className="border-l border-gray-600 h-6 mx-4"></div>
                            <p className="text-sm text-gray-300">
                                Olá, {authStorage.getCurrentUser()?.username || 'Usuário'}
                            </p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-auto">
                        <Routes>
                            <Route path="/dashboard" element={<DashboardSection />} />
                            <Route path="/clients" element={<ClientsSection />} />
                            <Route path="/projects" element={<ProjectsSection />} />
                            <Route path="/tasks" element={<TasksSection />} />
                            <Route path="/reports" element={<ReportsSection />} />
                            <Route path="/database" element={<DatabaseViewer data={data} columns={columns} />} />
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </Router>
    );
};

export default App;
