import React from 'react';
import { FiAlertCircle, FiShield, FiXCircle, FiCheck } from 'react-icons/fi';

const reports = [
  { id: 1, reporter: 'Siti Aminah', reported: 'Andi Wijaya', reason: 'Spam pesan tidak pantas', date: '6 jam yang lalu', level: 'High' },
  { id: 2, reporter: 'Rina Putri', reported: 'Unkown_User', reason: 'Tawaran skill palsu / Penipuan', date: '1 hari yang lalu', level: 'Medium' },
  { id: 3, reporter: 'Eko Prasetyo', reported: 'Budi Santoso', reason: 'Konten profil melanggar ketentuan', date: '2 hari yang lalu', level: 'Low' },
];

const Reports = () => {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Laporan & Aduan</h1>
        <p className="text-gray-500 mt-1">Review laporan dari komunitas untuk menjaga keamanan SkillSwap.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-red-100 rounded-xl text-red-600">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Laporan Aktif</p>
            <p className="text-2xl font-black text-gray-800">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-xl text-green-600">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Diselesaikan</p>
            <p className="text-2xl font-black text-gray-800">148</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Rata-rata Respon</p>
            <p className="text-2xl font-black text-gray-800">2.4 Jm</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className={`p-2 rounded-lg mt-1 ${
                report.level === 'High' ? 'text-red-600 bg-red-50' : 
                report.level === 'Medium' ? 'text-orange-600 bg-orange-50' : 'text-blue-600 bg-blue-50'
              }`}>
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                  <span>Laporan: {report.reported}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                     report.level === 'High' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>{report.level}</span>
                </h4>
                <p className="text-sm text-gray-600 font-medium">"{report.reason}"</p>
                <p className="text-xs text-gray-400">Dilaporkan oleh <span className="underline italic">{report.reporter}</span> • {report.date}</p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 text-sm font-bold transition-colors">
                <FiCheck className="w-4 h-4" />
                <span>Valid</span>
              </button>
              <button className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-sm font-bold transition-colors">
                <FiXCircle className="w-4 h-4" />
                <span>Blokir</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
