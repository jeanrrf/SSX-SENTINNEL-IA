import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { Client } from '../../types';

type ClientFormData = Omit<Client, 'id' | 'createdAt' | 'updatedAt'>;

interface ClientModalProps {
    client?: Client;
    onClose: () => void;
    onSave: (client: ClientFormData) => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ client, onClose, onSave }) => {
    const [formData, setFormData] = useState<ClientFormData>({
        name: client?.name || '',
        email: client?.email || '',
        phone: client?.phone || '',
        address: client?.address || '',
        company: client?.company || '',
        status: client?.status || 'active',
        notes: client?.notes || ''
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-white">
                        {client ? 'Editar Cliente' : 'Novo Cliente'}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        title="Fechar"
                    >
                        <FaTimes className="text-gray-400 hover:text-white" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nome */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Nome
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="Digite o nome do cliente"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="cliente@exemplo.com"
                        />
                    </div>

                    {/* Telefone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Telefone
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="(00) 00000-0000"
                        />
                    </div>

                    {/* Empresa */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Empresa
                        </label>
                        <input
                            type="text"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="Nome da empresa"
                        />
                    </div>

                    {/* Endereço */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Endereço
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="Rua, número, bairro, cidade - UF"
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                            Status
                        </label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                        >
                            <option value="active" className="bg-gray-900">Ativo</option>
                            <option value="inactive" className="bg-gray-900">Inativo</option>
                        </select>
                    </div>

                    {/* Observações */}
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            Observações
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={4}
                            className="w-full bg-gray-900 text-gray-100 rounded-lg px-3 py-2
                                border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                                hover:border-gray-600 transition-colors duration-300"
                            placeholder="Observações adicionais sobre o cliente"
                        />
                    </div>

                    {/* Botões */}
                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                        >
                            {client ? 'Salvar Alterações' : 'Criar Cliente'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ClientModal;
