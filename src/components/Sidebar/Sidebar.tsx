import { IconType } from 'react-icons';
import { FaSignOutAlt } from 'react-icons/fa';

interface MenuItem {
    id: string;
    icon: IconType;
    label: string;
}

interface SidebarProps {
    menuItems: MenuItem[];
    activeSection: string;
    onSectionChange: (section: string) => void;
    onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
    menuItems,
    activeSection,
    onSectionChange,
    onLogout
}) => {

    return (
        <div className="w-64 bg-gray-800 h-full flex flex-col">
            <div className="relative border-b border-gray-700" style={{ height: '240px' }}>
                {/* Gradiente de fundo base */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-800/95 to-gray-800/90"></div>
                
                {/* Container da imagem com blend mode */}
                <div 
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'url("/Designer.png")',
                        backgroundSize: '140%',
                        backgroundPosition: 'center 15%',
                        backgroundRepeat: 'no-repeat',
                        mixBlendMode: 'screen',
                        filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))'
                    }}
                />
                
                {/* Gradiente superior para suavizar */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/30 via-transparent to-transparent"></div>
                
                {/* Gradiente inferior para texto */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-800 via-gray-800/50 to-transparent"></div>
                
                {/* Conteúdo */}
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center">
                    <h1 className="logo-text text-2xl font-bold text-white text-center tracking-wider mb-2 relative">
                        <span className="relative z-10 drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                            SENTINNELL
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-cyan-500/20 blur-sm"></div>
                    </h1>
                    <h2 className="logo-text text-sm font-medium text-gray-300 text-center tracking-widest relative group transition-all duration-300">
                        <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-gray-100 via-gray-300 to-gray-100">
                            WORKSTATION
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </h2>
                </div>
            </div>

            <nav className="flex-1">
                <ul className="space-y-2 p-4">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => onSectionChange(item.id)}
                                className={`w-full flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                                    activeSection === item.id
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                <item.icon />
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="p-4 border-t border-gray-700">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                >
                    <FaSignOutAlt />
                    <span>Sair</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
