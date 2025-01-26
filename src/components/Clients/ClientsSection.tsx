import { useState, useEffect } from 'react';
import { FaUserPlus, FaSearch, FaDownload, FaUpload, FaSave } from 'react-icons/fa';
import { clientStorage } from '../../services/clientStorage';
import { backupService } from '../../services/backupService';
import { Client } from '../../types';
import '../../styles/sentinel.css';

interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  status: Client['status'];
  company: string;
}

const defaultFormData: ClientFormData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  notes: '',
  status: 'active',
  company: ''
};

export const ClientsSection: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [formData, setFormData] = useState(defaultFormData);

  useEffect(() => {
    loadClients();

    const backupInterval = setInterval(() => {
      backupService.backup();
    }, 5 * 60 * 1000);

    return () => clearInterval(backupInterval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingClient) {
      const updatedClient = { 
        ...editingClient, 
        ...formData,
        updatedAt: new Date().toISOString()
      };
      clientStorage.update(updatedClient);
      setClients(clients.map(client => 
        client.id === editingClient.id ? updatedClient : client
      ));
    } else {
      const newClient = {
        id: Date.now(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      clientStorage.save(newClient);
      setClients([...clients, newClient]);
    }
    handleCloseForm();
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      notes: client.notes,
      status: client.status,
      company: client.company || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    clientStorage.delete(id);
    setClients(clients.filter(client => client.id !== id));
    setShowDeleteConfirm(null);
  };

  const handleCloseForm = () => {
    setFormData(defaultFormData);
    setEditingClient(null);
    setShowForm(false);
  };

  const loadClients = () => {
    setClients(clientStorage.getAll());
  };

  const handleRestore = () => {
    backupService.restore();
    loadClients();
  };

  const handleBackup = () => {
    backupService.backup();
    alert('Backup criado com sucesso!');
  };

  const handleExport = () => {
    backupService.exportToFile();
  };

  const filteredClients = clients
    .filter(client => 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.address.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(client => 
      statusFilter === 'all' ? true : client.status === statusFilter
    );

  return (
    <div className="p-8">
      {/* Header */}
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Clientes</h2>
        <p className="text-gray-400">Gerencie seus clientes e mantenha seus dados atualizados</p>
      </header>

      {/* Ações */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="flex-1 glass-card gradient-blue rounded-xl p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Pesquisar clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <label htmlFor="statusFilter" className="sr-only">Filtrar por status</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">Todos</option>
              <option value="active">Ativos</option>
              <option value="inactive">Inativos</option>
            </select>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleBackup}
            className="px-4 py-2 glass-card gradient-green rounded-lg text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <FaSave /> Backup
          </button>
          <button
            onClick={() => {
              if (window.confirm('Restaurar último backup? Isso substituirá os dados atuais.')) {
                handleRestore();
                alert('Backup restaurado com sucesso!');
              }
            }}
            className="px-4 py-2 glass-card gradient-purple rounded-lg text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <FaUpload /> Restaurar
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 glass-card gradient-blue rounded-lg text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <FaDownload /> Exportar
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 glass-card gradient-green rounded-lg text-white hover:bg-white/5 transition-all flex items-center gap-2"
          >
            <FaUserPlus /> Novo
          </button>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="glass-card rounded-xl p-6">
        <div className="space-y-4">
          {filteredClients.map(client => (
            <div 
              key={client.id} 
              className="flex items-center gap-4 p-4 rounded-lg hover:bg-white/5 border border-white/5"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-white">
                {client.name[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">{client.name}</p>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${
                    client.status === 'active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-gray-500/20 text-gray-300'
                  }`}>
                    {client.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <p className="text-sm text-gray-400 truncate">{client.address}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(client)}
                  className="p-2 text-blue-300 hover:text-blue-200 transition-colors"
                >
                  Editar
                </button>
                {showDeleteConfirm === client.id ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="p-2 text-red-300 hover:text-red-200 transition-colors"
                    >
                      Confirmar
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(null)}
                      className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(client.id)}
                    className="p-2 text-red-300 hover:text-red-200 transition-colors"
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal de Formulário */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
              </h3>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Nome
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Telefone
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Endereço
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Empresa
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Notas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full p-2 bg-white/5 border border-white/10 rounded-lg text-white focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 text-gray-300 hover:text-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 glass-card gradient-blue rounded-lg text-white hover:bg-white/5 transition-all"
                >
                  {editingClient ? 'Salvar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
