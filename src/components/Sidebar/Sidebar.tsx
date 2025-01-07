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
                    className="absolute inset-0 bg-black/12 mix-blend-screen"
                    style={{
                        backgroundImage: 'url("/Logo.png")',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center', 
                        imageResolution: 'from-image',
                    }}></div>

                {/* Gradiente radial para escurecer os cantos */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'radial-gradient(circle, transparent, transparent 40%, rgba(17, 17, 32, 0.67))'
                    }}></div>
                    {/* Gradiente adicional para unir a logo ao restante com transição */}
                    <div 
                        className="absolute inset-x-0 bottom-0 h-16 transition-all duration-500 ease-in-out"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(9, 11, 14, 0) 0%, rgba(25, 30, 39, 0.4) 100%)'
                        }}></div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {menuItems.map(item => (
                    <div
                        key={item.id}
                        className={`p-4 cursor-pointer ${activeSection === item.id ? 'bg-gray-700' : ''}`}
                        onClick={() => onSectionChange(item.id)}
                    >
                        <item.icon className="inline-block mr-2" />
                        {item.label}
                    </div>
                ))}
            </div>
            <div className="p-4 border-t border-gray-700">
                <button
                    className="w-full flex items-center justify-center p-2 bg-red-600 hover:bg-red-700 text-white"
                    onClick={onLogout}
                >
                    <FaSignOutAlt className="mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
