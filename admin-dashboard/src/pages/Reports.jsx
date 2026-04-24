import React, { useState, useEffect } from 'react';
import { FiAlertCircle, FiShield, FiXCircle, FiCheck } from 'react-icons/fi';
import api from '../api/axios';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/admin/reports');
      setReports(response.data || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (reportedId, action) => {
    if (action === 'block') {
      const confirm = window.confirm('Anda yakin ingin memblokir user ini?');
      if (confirm) {
        try {
          await api.put(`/admin/users/${reportedId}/ban`, { reason: 'Melanggar ketentuan (Dari Laporan)' });
          alert('User berhasil diblokir');
          fetchReports();
        } catch (e) {
          alert('Gagal memblokir user');
        }
      }
    } else {
      alert('Tindakan ini akan menandai laporan sebagai diselesaikan (Implementasi API status pending/resolved menyusul).');
    }
  };

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
            <p className="text-xs text-gray-400 font-bold uppercase">Laporan Total</p>
            <p className="text-2xl font-black text-gray-800">{reports.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-100 rounded-xl text-green-600">
            <FiShield className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Diselesaikan</p>
            <p className="text-2xl font-black text-gray-800">0</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-100 rounded-xl text-blue-600">
            <FiAlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-400 font-bold uppercase">Sistem</p>
            <p className="text-2xl font-black text-gray-800">Aktif</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <p className="text-center py-4">Memuat laporan...</p>
        ) : reports.length === 0 ? (
          <p className="text-center py-4 text-gray-500">Tidak ada laporan yang perlu di-review.</p>
        ) : reports.map((report) => (
          <div key={report.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg mt-1 text-red-600 bg-red-50">
                <FiAlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-800 flex items-center space-x-2">
                  <span>Laporan terhadap User: {report.reported_name}</span>
                </h4>
                <p className="text-sm text-gray-600 font-medium">"{report.reason}"</p>
                <p className="text-xs text-gray-400 mb-1">{report.description}</p>
                <p className="text-xs text-gray-400">Dilaporkan oleh <span className="underline italic">{report.reporter_name}</span> • {new Date(report.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button onClick={() => handleAction(report.reported_id, 'valid')} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-xl hover:bg-gray-100 text-sm font-bold transition-colors">
                <FiCheck className="w-4 h-4" />
                <span>Tandai Selesai</span>
              </button>
              <button onClick={() => handleAction(report.reported_id, 'block')} className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 text-sm font-bold transition-colors">
                <FiXCircle className="w-4 h-4" />
                <span>Blokir User</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
