import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, AreaChart, Area } from 'recharts';
import { ArrowLeft, Calendar, Smartphone, Globe, Activity, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';
import { toast } from 'react-hot-toast';

const AnalyticsPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const { data } = await api.get(`/analytics/${id}`);
      setData(data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <div className="text-center py-20">No data found</div>;

  const deviceData = Object.entries(data.deviceStats || {}).map(([name, value]) => ({ name, value }));
  const browserData = Object.entries(data.browserStats || {}).map(([name, value]) => ({ name, value }));
  
  const timelineData = data.timeline?.reduce((acc, click) => {
    const date = format(new Date(click.timestamp), 'MMM d');
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.clicks += 1;
    } else {
      acc.push({ date, clicks: 1 });
    }
    return acc;
  }, []) || [];

  const COLORS = ['#2563eb', '#7c3aed', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="min-h-screen bg-white dark:bg-black p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex flex-col md:flex-row justify-between gap-4">
            <div>
              <h1 className="text-xl font-bold mb-1">Analytics</h1>
              <a href={data.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-blue-600 font-bold hover:underline break-all">
                {data.url.replace(/^https?:\/\//, '')} <ExternalLink size={14} />
              </a>
              <p className="text-gray-500 text-xs mt-2 flex items-center gap-2">
                <LinkIcon size={12} /> <span className="truncate max-w-[300px]">{data.originalUrl}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[100px]">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Clicks</p>
                <p className="text-2xl font-bold leading-tight"><AnimatedCounter to={data.totalClicks} /></p>
              </div>
              <div className="text-center px-4 py-2 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 min-w-[100px]">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Created</p>
                <p className="text-sm font-bold mt-1">{format(new Date(data.createdAt), 'MMM d, yy')}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-500 uppercase tracking-wider"><Smartphone size={14} /> Devices</h3>
            <div className="h-48 w-full flex flex-col items-center">
              {deviceData.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height="80%">
                    <PieChart>
                      <Pie data={deviceData} cx="50%" cy="50%" innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="value">
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
                    {deviceData.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-[10px] font-medium text-gray-500 capitalize">{item.name}</span>
                        <span className="text-[10px] font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : <p className="text-center text-gray-400 py-16 text-sm">No data yet</p>}
            </div>
          </div>

          <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl p-5 shadow-sm">
            <h3 className="text-sm font-bold mb-4 flex items-center gap-2 text-gray-500 uppercase tracking-wider"><Globe size={14} /> Browsers</h3>
            <div className="h-48 w-full">
              {browserData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={browserData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {browserData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-center text-gray-400 py-16 text-sm">No data yet</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
