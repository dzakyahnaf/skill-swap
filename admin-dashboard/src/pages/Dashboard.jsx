import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { FiUsers, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

const data = [
  { name: 'Senin', users: 400, sessions: 240 },
  { name: 'Selasa', users: 300, sessions: 139 },
  { name: 'Rabu', users: 200, sessions: 980 },
  { name: 'Kamis', users: 278, sessions: 390 },
  { name: 'Jumat', users: 189, sessions: 480 },
  { name: 'Sabtu', users: 239, sessions: 380 },
  { name: 'Minggu', users: 349, sessions: 430 },
];

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-5">
    <div className={`p-4 rounded-xl ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium mb-1">{title}</p>
      <h4 className="text-2xl font-bold text-gray-800">{value}</h4>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-500 mt-2">Pantau metrik aplikasi SkillSwap hari ini.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Pengguna" 
          value="1,248" 
          icon={<FiUsers className="w-6 h-6 text-primary" />} 
          color="bg-primary/10" 
        />
        <StatCard 
          title="Sesi Aktif" 
          value="342" 
          icon={<FiClock className="w-6 h-6 text-blue-500" />} 
          color="bg-blue-50" 
        />
        <StatCard 
          title="Sesi Selesai" 
          value="8,924" 
          icon={<FiCheckCircle className="w-6 h-6 text-green-500" />} 
          color="bg-green-50" 
        />
        <StatCard 
          title="Laporan Pending" 
          value="15" 
          icon={<FiAlertTriangle className="w-6 h-6 text-orange-500" />} 
          color="bg-orange-50" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Aktivitas Mingguan</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280' }} />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="users" name="Pendaftaran" fill="#6C63FF" radius={[4, 4, 0, 0]} barSize={30} />
                <Bar dataKey="sessions" name="Sesi Swap" fill="#03DAC6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">User Terbaru</h3>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <img 
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=User${i}`} 
                  alt="User" 
                  className="w-10 h-10 rounded-full bg-slate-100"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-gray-800">User_Name_{i}</h4>
                  <p className="text-xs text-gray-500">Mendaftar {i} jam yang lalu</p>
                </div>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-lg">Aktif</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
