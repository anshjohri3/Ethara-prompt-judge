import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, PlusCircle, Clock, CheckCircle, AlertCircle, FileText, ArrowRight, User } from 'lucide-react';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchParams] = useSearchParams();
  const { api, user } = useAuth();

  useEffect(() => {
    const status = searchParams.get('status');
    if (status) setStatusFilter(status);
    fetchTasks();
  }, [searchParams]);

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);

      const res = await api.get(`/tasks?${params.toString()}`);
      setTasks(res.data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTasks();
    }, 300);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  const getStatusBadge = (task) => {
    if (task.status === 'completed') {
      return <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-medium text-xs rounded-full flex items-center gap-1.5 w-fit">
        <CheckCircle size={14} /> Completed
      </span>;
    }
    if (task.deadline && new Date(task.deadline) < new Date()) {
      return <span className="px-3 py-1 bg-rose-100 text-rose-700 font-medium text-xs rounded-full flex items-center gap-1.5 w-fit">
        <AlertCircle size={14} /> Overdue
      </span>;
    }
    return <span className="px-3 py-1 bg-amber-100 text-amber-700 font-medium text-xs rounded-full flex items-center gap-1.5 w-fit">
      <Clock size={14} /> Pending
    </span>;
  };

  const formatDate = (date) => {
    if (!date) return 'No deadline';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Task Directory</h1>
          <p className="text-slate-500 mt-1">Manage and evaluate all your assigned AI prompts.</p>
        </div>
        {user?.role === 'admin' && (
          <Link
            to="/create"
            className="px-5 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2 font-medium"
          >
            <PlusCircle size={18} /> Create Task
          </Link>
        )}
      </div>

      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700 placeholder-slate-400 transition"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium cursor-pointer min-w-[160px]"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {tasks.length === 0 ? (
        <div className="bg-white p-16 rounded-3xl shadow-sm border border-slate-200 text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="text-slate-300" size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No tasks found</h3>
          <p className="text-slate-500 max-w-md mx-auto">We couldn't find any tasks matching your current filters. Try adjusting your search or create a new one.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Link
              key={task._id}
              to={`/tasks/${task._id}`}
              className="group bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
              <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {getStatusBadge(task)}
                    <span className="text-sm font-medium text-slate-400 flex items-center gap-1">
                      <Clock size={14} /> Due {formatDate(task.deadline)}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{task.title}</h3>
                  {task.description && (
                    <p className="text-slate-600 line-clamp-2">{task.description}</p>
                  )}
                </div>
                
                <div className="flex flex-col items-start md:items-end gap-3 md:min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6">
                  {task.assignedTo && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg">
                      <User size={14} className="text-slate-400" /> 
                      <span className="font-medium">{task.assignedTo.name}</span>
                    </div>
                  )}
                  {task.finalScore ? (
                    <div className="text-right w-full">
                      <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Final Score</span>
                      <div className="text-2xl font-black text-slate-900">{task.finalScore.toFixed(1)}<span className="text-lg text-slate-400">/5</span></div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform mt-auto">
                      View Details <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;