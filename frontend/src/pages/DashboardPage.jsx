import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Trash2, BarChart2, Search, Link as LinkIcon, Plus, QrCode, X, ExternalLink, Activity, Check } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import AnimatedCounter from '../components/AnimatedCounter';

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button 
      whileHover={{ scale: 1.1 }} 
      whileTap={{ scale: 0.9 }} 
      onClick={handleCopy} 
      className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground transition-colors relative" 
      title="Copy"
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="check"
            initial={{ rotateY: -180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 180, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Check size={16} className="text-emerald-500" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ rotateY: -180, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: 180, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <Copy size={16} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

const DashboardPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form state
  const [originalUrl, setOriginalUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  // QR Modal state
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrUrl, setActiveQrUrl] = useState('');

  const fetchUrls = async () => {
    try {
      const { data } = await api.get('/url/user/all');
      setUrls(data);
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const { data } = await api.post('/url/create', { originalUrl, customAlias });
      setUrls([data, ...urls]);
      setOriginalUrl('');
      setCustomAlias('');
      toast.success('URL shortened successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create URL');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this URL?')) return;
    try {
      await api.delete(`/url/${id}`);
      setUrls(urls.filter(url => url._id !== id));
      toast.success('URL deleted');
    } catch (error) {
      toast.error('Failed to delete URL');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const filteredUrls = urls.filter(url => 
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase()) || 
    url.shortCode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header & Create Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">Manage your links and view their performance.</p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm"
        >
          <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-grow w-full">
              <label className="block text-sm font-medium mb-1.5 text-foreground">Destination URL</label>
              <input
                type="url"
                required
                placeholder="https://example.com/long-url..."
                className="w-full px-3 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium mb-1.5 text-foreground">Custom Alias (Optional)</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm select-none">/</span>
                <input
                  type="text"
                  placeholder="my-link"
                  className="w-full pl-6 pr-3 py-2 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all"
                  value={customAlias}
                  onChange={(e) => setCustomAlias(e.target.value)}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isCreating}
              className="w-full md:w-auto bg-foreground text-background px-6 py-2 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-70 h-[42px]"
            >
              {isCreating ? 'Creating...' : <><Plus size={18} /> Shorten</>}
            </button>
          </form>
        </motion.div>
      </div>

      {/* Links List Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">Your Links</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search links..."
            className="w-full pl-9 pr-3 py-1.5 bg-transparent border border-gray-300 dark:border-gray-700 rounded-md focus:ring-1 focus:ring-primary focus:border-primary outline-none text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Links List */}
      <div className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-200 dark:divide-gray-800 overflow-hidden">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-6 flex justify-between relative overflow-hidden">
                {/* Shimmer overlay */}
                <motion.div
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear", delay: i * 0.1 }}
                  className="absolute inset-0 z-10 bg-gradient-to-r from-transparent via-white/40 dark:via-white/5 to-transparent w-1/2 skew-x-12"
                />
                <div className="space-y-3 w-1/2">
                  <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2 opacity-70"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-3/4 opacity-70"></div>
                </div>
                <div className="h-8 bg-gray-200 dark:bg-gray-800 rounded w-32 opacity-70"></div>
              </div>
            ))}
          </div>
        ) : filteredUrls.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-4"
          >
            <motion.div 
              animate={{ 
                boxShadow: ["0px 0px 0px 0px rgba(59,130,246,0)", "0px 0px 0px 15px rgba(59,130,246,0.1)", "0px 0px 0px 0px rgba(59,130,246,0)"] 
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="bg-blue-50 dark:bg-blue-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200 dark:border-blue-800/30"
            >
              <LinkIcon size={24} className="text-blue-500" />
            </motion.div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Ready to create your first link?</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Paste a long URL in the box above to generate your first short link and start tracking analytics.</p>
          </motion.div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-800 group/list">
            <AnimatePresence>
              {filteredUrls.map((url, index) => (
                <motion.div
                  layout
                  key={url._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05, type: "spring", stiffness: 200, damping: 20 }}
                  className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 dark:hover:bg-[#111] transition-all duration-300 group relative group-hover/list:opacity-50 hover:!opacity-100"
                >
                  <div className="flex-grow overflow-hidden pr-4 w-full sm:w-auto">
                    <div className="flex items-center gap-3 mb-1.5">
                      <a href={url.shortUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-base hover:underline flex items-center gap-1.5 text-foreground">
                        {url.shortUrl.replace(/^https?:\/\//, '')}
                        <ExternalLink size={14} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </div>
                    <p className="text-muted-foreground text-sm truncate max-w-[500px]" title={url.originalUrl}>
                      {url.originalUrl}
                    </p>
                    <div className="flex items-center gap-4 mt-2.5 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5"><Activity size={14} className="text-emerald-500" /> <AnimatedCounter to={url.clicks} /> clicks</span>
                      <span>{format(new Date(url.createdAt), 'MMM d, yyyy')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => { setActiveQrUrl(url.shortUrl); setQrModalOpen(true); }} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground transition-colors" title="QR Code">
                      <QrCode size={16} />
                    </motion.button>
                    <CopyButton text={url.shortUrl} />
                    <Link to={`/analytics/${url._id}`}>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 text-muted-foreground hover:text-foreground transition-colors" title="Analytics">
                        <BarChart2 size={16} />
                      </motion.div>
                    </Link>
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(url._id)} className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors" title="Delete">
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* QR Modal */}
      <AnimatePresence>
        {qrModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 p-8 rounded-xl relative max-w-sm w-full flex flex-col items-center shadow-lg"
            >
              <button onClick={() => setQrModalOpen(false)} className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors">
                <X size={18} />
              </button>
              <h3 className="text-lg font-semibold mb-6">QR Code</h3>
              <div className="bg-white p-3 rounded-lg mb-6 border border-gray-200">
                <QRCodeSVG value={activeQrUrl} size={200} />
              </div>
              <p className="text-center text-sm font-medium text-foreground mb-6 break-all bg-gray-50 dark:bg-gray-900 px-3 py-2 rounded-md border border-gray-200 dark:border-gray-800 w-full">
                {activeQrUrl.replace(/^https?:\/\//, '')}
              </p>
              <button 
                onClick={() => copyToClipboard(activeQrUrl)}
                className="w-full bg-foreground text-background py-2.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Copy Link
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
