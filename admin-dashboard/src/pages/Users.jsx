import React from 'react';
import { FiSearch, FiUserPlus, FiMoreVertical } from 'react-icons/fi';

const users = [
  { id: 1, name: 'Budi Santoso', email: 'budi@example.com', role: 'User', status: 'Active', joined: '12 Jan 2024' },
  { id: 2, name: 'Siti Aminah', email: 'siti@example.com', role: 'User', status: 'Active', joined: '15 Jan 2024' },
  { id: 3, name: 'Andi Wijaya', email: 'andi@example.com', role: 'User', status: 'Banned', joined: '05 Jan 2024' },
  { id: 4, name: 'Rina Putri', email: 'rina@example.com', role: 'User', status: 'Active', joined: '20 Jan 2024' },
  { id: 5, name: 'Eko Prasetyo', email: 'eko@example.com', role: 'User', status: 'Active', joined: '22 Jan 2024' },
];

const Users = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-500 mt-1">Kelola seluruh pengguna aplikasi SkillSwap.</p>
        </div>
        <button className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          <FiUserPlus />
          <span>Tambah User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-96">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari nama atau email..." 
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
            />
          </div>
          <div className="flex space-x-2">
            <select className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              <option>Semua Status</option>
              <option>Active</option>
              <option>Banned</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                <th className="px-6 py-4">Nama Pengguna</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Tanggal Gabung</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.joined}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">
                    <button className="hover:text-gray-600 transition-colors">
                      <FiMoreVertical />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-gray-100 bg-gray-50/30 flex justify-between items-center">
          <p className="text-xs text-gray-500 font-medium">Menampilkan 5 dari 1,248 pengguna</p>
          <div className="flex space-x-1">
            {[1, 2, 3].map(n => (
              <button key={n} className={`w-8 h-8 text-xs font-bold rounded-lg transition-all ${n === 1 ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;
