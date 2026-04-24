import React, { useState, useEffect } from 'react';
import { FiRefreshCw, FiZap, FiCheckCircle, FiActivity } from 'react-icons/fi';
import api from '../api/axios';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'completed': return <div className="bg-green-100 p-2 rounded-full"><FiCheckCircle className="text-green-600 w-4 h-4" /></div>;
    case 'active': return <div className="bg-blue-100 p-2 rounded-full"><FiRefreshCw className="text-blue-600 w-4 h-4" /></div>;
    default: return <div className="bg-orange-100 p-2 rounded-full"><FiZap className="text-orange-600 w-4 h-4" /></div>;
  }
};

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await api.get('/admin/sessions');
        setActivities(response.data || []);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Aktivitas Swap</h1>
          <p className="text-gray-500 mt-1">Monitoring seluruh proses pertukaran skill secara real-time.</p>
        </div>
        <div className="flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl text-gray-600 text-sm font-medium">
          <FiActivity className="animate-pulse text-green-500" />
          <span>Live Feed</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6">
        <div className="space-y-8 relative">
          {/* Vertical line for the timeline */}
          <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-gray-100 hidden md:block"></div>

          {loading ? (
             <p className="text-center text-gray-500">Memuat data aktivitas...</p>
          ) : activities.length === 0 ? (
             <p className="text-center text-gray-500">Belum ada aktivitas pertukaran skill.</p>
          ) : (
            activities.map((act) => (
              <div key={act.id} className="relative flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-8">
                {/* Icon / Marker */}
                <div className="z-10 bg-white p-1 ml-1.5 md:ml-0">
                  <StatusIcon status={act.status} />
                </div>

                {/* Content */}
                <div className="flex-1 bg-gray-50/50 p-5 rounded-2xl border border-gray-50 hover:border-primary/20 transition-all hover:shadow-sm">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-800">{act.user1_name}</span>
                      <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-white border border-gray-100 rounded-lg">menukar</span>
                      <span className="font-bold text-primary">{act.skill1_name}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-gray-300">
                      <div className="w-8 h-px bg-current"></div>
                      <FiRefreshCw className="w-3 h-3 rotate-45" />
                      <div className="w-8 h-px bg-current"></div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-800">{act.user2_name}</span>
                      <span className="text-xs text-gray-400 font-medium px-2 py-0.5 bg-white border border-gray-100 rounded-lg">dengan</span>
                      <span className="font-bold text-secondary text-cyan-600">{act.skill2_name}</span>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <FiZap className="w-3 h-3 text-orange-400" />
                      <span>Status: <span className="font-bold uppercase">{act.status}</span></span>
                    </div>
                    <span className="text-xs text-gray-400 italic">{new Date(act.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Activities;
