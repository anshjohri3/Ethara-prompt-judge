import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, Users, Brain, Code, LineChart, 
  CheckCircle2, ChevronRight, Zap, Target, BookOpen, Layers
} from 'lucide-react';

const Welcome = () => {
  const [typedText, setTypedText] = useState('');
  const fullText = 'Insights.';

  useEffect(() => {
    let timeout;
    let isDeleting = false;
    let currentIndex = 0;

    const type = () => {
      if (!isDeleting && currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex++;
        timeout = setTimeout(type, 150);
      } else if (isDeleting && currentIndex >= 0) {
        setTypedText(fullText.slice(0, currentIndex));
        currentIndex--;
        timeout = setTimeout(type, 100);
      } else if (currentIndex > fullText.length) {
        isDeleting = true;
        currentIndex--; 
        timeout = setTimeout(type, 2500); // Pause when fully typed
      } else if (currentIndex < 0) {
        isDeleting = false;
        currentIndex = 0;
        timeout = setTimeout(type, 800); // Pause when fully deleted
      }
    };

    timeout = setTimeout(type, 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 -mt-6">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <img src="/logo.svg" alt="Logo" className="h-10" />
          <span className="text-2xl font-bold text-slate-900 tracking-tight">PromptJudge</span>
        </Link>
        <div className="hidden sm:flex gap-4 items-center">
          <Link to="/login?role=admin" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition flex items-center gap-2">
            <ShieldAlert size={16} />
            Admin Portal
          </Link>
          <Link to="/login?role=member" className="px-5 py-2.5 text-sm font-semibold bg-blue-600 text-white rounded-full hover:bg-blue-700 transition shadow-lg shadow-blue-200 flex items-center gap-2">
            <Users size={16} />
            Tasker Portal
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/50 to-transparent rounded-full blur-3xl -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-medium mb-8">
            <SparkleIcon /> Evaluate AI. Smarter. Faster. Better.
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight animate-fade-in-up min-h-[140px] md:min-h-[180px] flex flex-col justify-center items-center">
            <span className="block mb-2">Turn AI Responses into</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-gradient-x h-[1.2em]">
              {typedText}<span className="text-blue-600 animate-pulse">|</span>
            </span>
          </h1>
          <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Compare, analyze, and evaluate multiple AI-generated responses with precision. Build better decisions using structured evaluation, not guesswork.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login?role=member" className="px-8 py-4 text-base font-bold bg-slate-900 text-white rounded-full hover:bg-slate-800 transition flex items-center justify-center gap-2">
              <Users size={20} /> Tasker Portal <ChevronRight size={20} />
            </Link>
            <Link to="/login?role=admin" className="px-8 py-4 text-base font-bold bg-white text-slate-900 border border-slate-200 rounded-full hover:border-slate-300 hover:bg-slate-50 transition flex items-center justify-center gap-2">
              <ShieldAlert size={20} /> Admin Portal
            </Link>
          </div>
        </div>
      </section>

      {/* What is PromptJudge */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">What is PromptJudge?</h2>
            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
              PromptJudge is an intelligent platform designed to help teams <strong>evaluate AI-generated responses</strong> using structured metrics like accuracy, clarity, and quality.
            </p>
            <p className="text-lg text-slate-600 leading-relaxed">
              Whether you're testing models, reviewing outputs, or building smarter systems, PromptJudge gives you the tools to measure what matters.
            </p>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-purple-50 rounded-3xl transform rotate-3 scale-105 -z-10"></div>
            <div className="bg-white border border-slate-100 rounded-3xl p-8 shadow-xl">
              <div className="space-y-6">
                <FeatureCard icon={<Target className="text-blue-500" />} title="Detect Quality Differences" />
                <FeatureCard icon={<Code className="text-purple-500" />} title="Improve Prompt Engineering" />
                <FeatureCard icon={<Layers className="text-green-500" />} title="Build Reliable AI Systems" />
                <FeatureCard icon={<LineChart className="text-orange-500" />} title="Make Confident Decisions" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How It Works</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">Four simple steps to structured, reliable AI evaluation.</p>
        </div>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <StepCard 
            number="1" 
            title="Enter a Prompt" 
            desc="Provide any question or instruction you want to test." 
          />
          <StepCard 
            number="2" 
            title="Generate Responses" 
            desc="Automatically generate multiple responses using advanced AI." 
          />
          <StepCard 
            number="3" 
            title="Evaluate & Compare" 
            desc="Rate responses across key parameters like Truthfulness and Style." 
          />
          <StepCard 
            number="4" 
            title="Get Insights" 
            desc="Identify the better response and make data-driven decisions." 
          />
        </div>
      </section>

      {/* Key Features & Who is it for */}
      <section className="py-24 bg-slate-900 text-white px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Key Features</h2>
            <ul className="space-y-4">
              <CheckListItem text="Dual AI Response Comparison" />
              <CheckListItem text="Multi-Parameter Rating System" />
              <CheckListItem text="Smart Scoring Algorithm" />
              <CheckListItem text="Role-Based Task Management" />
              <CheckListItem text="Clean Dashboard & Analytics" />
              <CheckListItem text="Real-time Evaluation Workflow" />
            </ul>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 text-white">Who Is It For?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <WhoCard icon={<Code />} title="AI/ML Developers" />
              <WhoCard icon={<Users />} title="Product Teams" />
              <WhoCard icon={<Brain />} title="Researchers" />
              <WhoCard icon={<BookOpen />} title="Students & Evaluators" />
              <WhoCard icon={<Target />} title="Anyone testing AI" className="sm:col-span-2" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 bg-gradient-to-b from-white to-blue-50 text-center">
        <div className="max-w-3xl mx-auto">
          <Brain size={48} className="mx-auto text-blue-600 mb-6" />
          <h2 className="text-4xl font-bold text-slate-900 mb-6">Built for the Future of AI</h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            As AI grows, evaluation becomes critical. PromptJudge ensures you're not just using AI, you're understanding it.
          </p>
          <Link to="/login?role=member" className="inline-flex items-center gap-2 px-10 py-5 text-lg font-bold bg-blue-600 text-white rounded-full hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-200 transition-all transform hover:-translate-y-1">
            Get Started Today <Zap size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12 px-6 text-center">
        <p className="text-slate-600 font-medium mb-2">Made with ❤️ for smarter AI evaluation</p>
        <p className="text-slate-400 text-sm">© 2026 PromptJudge. All rights reserved.</p>
      </footer>
    </div>
  );
};

/* Helper Components */

const SparkleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
  </svg>
);

const FeatureCard = ({ icon, title }) => (
  <div className="flex items-center gap-4">
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
      {icon}
    </div>
    <span className="font-semibold text-slate-800 text-lg">{title}</span>
  </div>
);

const StepCard = ({ number, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition">
    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">
      {number}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{desc}</p>
  </div>
);

const CheckListItem = ({ text }) => (
  <li className="flex items-center gap-3">
    <CheckCircle2 className="text-blue-500" size={24} />
    <span className="text-lg text-slate-300">{text}</span>
  </li>
);

const WhoCard = ({ icon, title, className = '' }) => (
  <div className={`flex items-center gap-3 p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-slate-600 transition ${className}`}>
    <div className="text-blue-400">{icon}</div>
    <span className="font-medium text-slate-200">{title}</span>
  </div>
);

export default Welcome;
