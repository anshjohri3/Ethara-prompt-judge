import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ListTodo, CheckCircle, AlertCircle, TrendingUp, ArrowRight, Activity, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState({ totalTasks: 0, completedTasks: 0, overdueTasks: 0 });
  const [loading, setLoading] = useState(true);
  const { api, user } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/tasks/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total Tasks',
      value: stats.totalTasks,
      icon: ListTodo,
      color: 'bg-blue-50 text-blue-600 border-blue-100',
      iconBg: 'bg-blue-100',
      link: '/tasks'
    },
    {
      title: 'Completed',
      value: stats.completedTasks,
      icon: CheckCircle,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      iconBg: 'bg-emerald-100',
      link: '/tasks?status=completed'
    },
    {
      title: 'Overdue / Pending',
      value: stats.overdueTasks,
      icon: AlertCircle,
      color: 'bg-rose-50 text-rose-600 border-rose-100',
      iconBg: 'bg-rose-100',
      link: '/tasks?status=pending'
    },
    {
      title: 'Completion Rate',
      value: stats.totalTasks > 0
        ? `${Math.round((stats.completedTasks / stats.totalTasks) * 100)}%`
        : '0%',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600 border-purple-100',
      iconBg: 'bg-purple-100',
      link: '/tasks'
    }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome back, {user?.name}</h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2">
            <Activity size={16} /> Here is an overview of your evaluation pipeline.
          </p>
        </div>
        {user?.role === 'admin' && (
          <Link
            to="/create"
            className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition shadow-lg flex items-center gap-2 font-medium"
          >
            <PlusCircle size={18} /> Create New Task
          </Link>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {statCards.map((stat) => (
          <Link
            key={stat.title}
            to={stat.link}
            className={`p-6 rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white border-slate-200 group`}
          >
            <div className="flex items-center justify-between mb-6">
              <div className={`p-3 rounded-xl ${stat.iconBg} ${stat.color.split(' ')[1]}`}>
                <stat.icon size={24} />
              </div>
              <ArrowRight size={20} className="text-slate-300 group-hover:text-slate-600 transition-colors transform group-hover:translate-x-1" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">{stat.title}</p>
              <h3 className="text-4xl font-extrabold text-slate-900 tracking-tight">{stat.value}</h3>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions / Activity Area */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl -z-10 translate-x-1/2 -translate-y-1/2"></div>
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ListTodo className="text-blue-600" /> Recent Activity
          </h2>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
              <ListTodo size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Ready to evaluate?</h3>
            <p className="text-slate-500 mb-6 max-w-sm mx-auto">Access the task list to view pending items and start generating insights.</p>
            <Link
              to="/tasks"
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition font-medium shadow-md flex items-center gap-2"
            >
              Browse All Tasks <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 shadow-lg text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl"></div>
          <h2 className="text-xl font-bold mb-4">Quick Guide</h2>
          <ul className="space-y-4 text-slate-300 text-sm">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
              <p>Navigate to <strong className="text-white">Tasks</strong> to see your assigned queue.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
              <p>Click on a task to generate AI responses via the Gemini API.</p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
              <p>Compare responses, submit evaluations, and finalize the score.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;