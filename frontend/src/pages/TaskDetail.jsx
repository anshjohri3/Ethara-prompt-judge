import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Clock, User, CheckCircle, Star, BarChart3, Award, MessageSquare, Loader2 } from 'lucide-react';

const RatingSlider = ({ label, value, onChange, color = 'blue' }) => {
  const colors = {
    blue: 'accent-blue-600',
    purple: 'accent-purple-600',
    green: 'accent-green-600'
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className={`text-lg font-bold text-${color}-600`}>{value}/5</span>
      </div>
      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${colors[color]}`}
        style={{ backgroundSize: `${((value - 1) / 4) * 100}% 100%` }}
      />
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>Poor</span>
        <span>Excellent</span>
      </div>
    </div>
  );
};

const RatingCard = ({ title, type, ratings, onRatingsChange, color = 'blue' }) => {
  return (
    <div className={`p-4 rounded-lg border-2 ${color === 'blue' ? 'border-blue-200 bg-blue-50' : 'border-purple-200 bg-purple-50'}`}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-3 py-1 ${color === 'blue' ? 'bg-blue-600' : 'bg-purple-600'} text-white text-sm rounded-full font-bold`}>
          {type}
        </span>
        <span className={`font-semibold ${color === 'blue' ? 'text-blue-800' : 'text-purple-800'}`}>
          {title}
        </span>
      </div>

      <RatingSlider
        label="Instruction Following"
        value={ratings.instructionFollowing}
        onChange={(v) => onRatingsChange({ ...ratings, instructionFollowing: v })}
        color={color}
      />
      <RatingSlider
        label="Truthfulness"
        value={ratings.truthfulness}
        onChange={(v) => onRatingsChange({ ...ratings, truthfulness: v })}
        color={color}
      />
      <RatingSlider
        label="Writing Style"
        value={ratings.writingStyle}
        onChange={(v) => onRatingsChange({ ...ratings, writingStyle: v })}
        color={color}
      />
      <RatingSlider
        label="Verbosity"
        value={ratings.verbosity}
        onChange={(v) => onRatingsChange({ ...ratings, verbosity: v })}
        color={color}
      />

      <div className={`mt-4 p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : 'bg-purple-100'}`}>
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${color === 'blue' ? 'text-blue-700' : 'text-purple-700'}`}>
            Score
          </span>
          <span className={`text-xl font-bold ${color === 'blue' ? 'text-blue-600' : 'text-purple-600'}`}>
            {(
              ratings.instructionFollowing * 0.3 +
              ratings.truthfulness * 0.3 +
              ratings.writingStyle * 0.2 +
              ratings.verbosity * 0.2
            ).toFixed(1)}/5
          </span>
        </div>
      </div>
    </div>
  );
};

const TaskDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { api, user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  // Rating states
  const [ratingA, setRatingA] = useState({
    instructionFollowing: 3,
    truthfulness: 3,
    writingStyle: 3,
    verbosity: 3
  });
  const [ratingB, setRatingB] = useState({
    instructionFollowing: 3,
    truthfulness: 3,
    writingStyle: 3,
    verbosity: 3
  });
  const [preferredResponse, setPreferredResponse] = useState('');
  const [userSummary, setUserSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [generatingResponses, setGeneratingResponses] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualResponseA, setManualResponseA] = useState('');
  const [manualResponseB, setManualResponseB] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const res = await api.get(`/tasks/${id}`);
      setTask(res.data);
    } catch (err) {
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!preferredResponse) {
      setError('Please select a preferred response');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post(`/tasks/${id}/evaluate`, {
        ratingA,
        ratingB,
        preferredResponse,
        userSummary
      });
      fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || 'Error submitting evaluation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateResponses = async () => {
    setGeneratingResponses(true);
    setError('');
    setShowManualInput(false);
    try {
      await api.post(`/tasks/${id}/generate`);
      fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || 'Error generating responses. Please enter them manually.');
      setShowManualInput(true);
    } finally {
      setGeneratingResponses(false);
    }
  };

  const handleSaveManualResponses = async () => {
    if (!manualResponseA || !manualResponseB) {
      setError('Both Response A and Response B are required');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await api.put(`/tasks/${id}/responses`, {
        responseA: manualResponseA,
        responseB: manualResponseB
      });
      setShowManualInput(false);
      fetchTask();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving responses');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      fetchTask();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const isAssignedUser = user && (
    task?.assignedTo?._id?.toString() === user.id ||
    task?.assignedTo === user.id
  );
  const canEvaluate = isAssignedUser && task?.status === 'pending';

  const getScoreColor = (score) => {
    if (score >= 4) return 'text-green-600';
    if (score >= 3) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Task not found</p>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">{task.title}</h1>
              {task.description && (
                <p className="text-gray-600 mb-4">{task.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  Deadline: {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No deadline'}
                </span>
                {task.assignedTo && (
                  <span className="flex items-center gap-1">
                    <User size={14} />
                    {task.assignedTo.name || 'Assigned User'}
                  </span>
                )}
                {task.status === 'completed' && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle size={14} />
                    Completed
                  </span>
                )}
              </div>
            </div>
            {isAssignedUser && task.status === 'pending' && (
              <button
                onClick={() => handleStatusUpdate('completed')}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Mark Complete
              </button>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50">
          <h2 className="font-semibold text-gray-800 mb-3">Prompt</h2>
          <p className="text-gray-600 bg-white p-4 rounded-lg border">{task.prompt}</p>
          
          {canEvaluate && (!task.responseA || !task.responseB) && !showManualInput && (
            <div className="mt-4">
              <div className="flex gap-4">
                <button
                  onClick={handleGenerateResponses}
                  disabled={generatingResponses}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2 disabled:opacity-50"
                >
                  {generatingResponses ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Generating Responses...
                    </>
                  ) : (
                    'Generate Responses'
                  )}
                </button>
                <button
                  onClick={() => setShowManualInput(true)}
                  disabled={generatingResponses}
                  className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition"
                >
                  Enter Manually
                </button>
              </div>
              <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex gap-3 items-start">
                <div className="text-amber-600 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
                </div>
                <p className="text-sm text-amber-800">
                  <strong className="font-semibold">Important:</strong> If the "Generate Responses" button fails or takes too long, click <strong>"Enter Manually"</strong> to paste the responses yourself (Response A from ChatGPT, Response B from Gemini).
                </p>
              </div>
            </div>
          )}

          {showManualInput && (
            <div className="mt-6 p-6 bg-white border rounded-xl shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Manual Response Entry</h3>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response A (ChatGPT - More Accurate)
                  </label>
                  <textarea
                    value={manualResponseA}
                    onChange={(e) => setManualResponseA(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Paste the response from ChatGPT here..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Response B (Gemini - More Creative)
                  </label>
                  <textarea
                    value={manualResponseB}
                    onChange={(e) => setManualResponseB(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Paste the response from Gemini here..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleSaveManualResponses}
                    disabled={submitting}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Responses'}
                  </button>
                  <button
                    onClick={() => setShowManualInput(false)}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Responses Display */}
        {task.responseA && task.responseB && (
          <div className="p-6 grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">A</span>
                  <span className="font-semibold text-blue-800">More Accurate</span>
                </div>
                {task.ratingA && (
                  <span className={`text-lg font-bold ${getScoreColor(task.ratingA.instructionFollowing * 0.3 + task.ratingA.truthfulness * 0.3 + task.ratingA.writingStyle * 0.2 + task.ratingA.verbosity * 0.2)}`}>
                    {(task.ratingA.instructionFollowing * 0.3 + task.ratingA.truthfulness * 0.3 + task.ratingA.writingStyle * 0.2 + task.ratingA.verbosity * 0.2).toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{task.responseA}</p>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full">B</span>
                  <span className="font-semibold text-purple-800">More Creative</span>
                </div>
                {task.ratingB && (
                  <span className={`text-lg font-bold ${getScoreColor(task.ratingB.instructionFollowing * 0.3 + task.ratingB.truthfulness * 0.3 + task.ratingB.writingStyle * 0.2 + task.ratingB.verbosity * 0.2)}`}>
                    {(task.ratingB.instructionFollowing * 0.3 + task.ratingB.truthfulness * 0.3 + task.ratingB.writingStyle * 0.2 + task.ratingB.verbosity * 0.2).toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-gray-700 whitespace-pre-wrap">{task.responseB}</p>
            </div>
          </div>
        )}

        {/* Evaluation Results */}
        {task.status === 'completed' && (
          <>
            <div className="p-6 border-t">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-gray-600" size={20} />
                <h2 className="font-semibold text-gray-800">Detailed Evaluation Results</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Response A Scores */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-bold">A</span>
                    <span className="font-semibold text-blue-800">More Accurate</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Instruction Following</span>
                      <span className="font-medium text-blue-600">{task.ratingA?.instructionFollowing}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Truthfulness</span>
                      <span className="font-medium text-blue-600">{task.ratingA?.truthfulness}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Writing Style</span>
                      <span className="font-medium text-blue-600">{task.ratingA?.writingStyle}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verbosity</span>
                      <span className="font-medium text-blue-600">{task.ratingA?.verbosity}/5</span>
                    </div>
                    <div className="pt-2 border-t border-blue-200 flex justify-between">
                      <span className="text-sm font-semibold text-blue-800">Final Score</span>
                      <span className="font-bold text-blue-600">
                        {(task.ratingA.instructionFollowing * 0.3 + task.ratingA.truthfulness * 0.3 + task.ratingA.writingStyle * 0.2 + task.ratingA.verbosity * 0.2).toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>

                {/* Response B Scores */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded-full font-bold">B</span>
                    <span className="font-semibold text-purple-800">More Creative</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Instruction Following</span>
                      <span className="font-medium text-purple-600">{task.ratingB?.instructionFollowing}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Truthfulness</span>
                      <span className="font-medium text-purple-600">{task.ratingB?.truthfulness}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Writing Style</span>
                      <span className="font-medium text-purple-600">{task.ratingB?.writingStyle}/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Verbosity</span>
                      <span className="font-medium text-purple-600">{task.ratingB?.verbosity}/5</span>
                    </div>
                    <div className="pt-2 border-t border-purple-200 flex justify-between">
                      <span className="text-sm font-semibold text-purple-800">Final Score</span>
                      <span className="font-bold text-purple-600">
                        {(task.ratingB.instructionFollowing * 0.3 + task.ratingB.truthfulness * 0.3 + task.ratingB.writingStyle * 0.2 + task.ratingB.verbosity * 0.2).toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            {task.summary && (
              <div className="p-6 border-t bg-gradient-to-r from-green-50 to-blue-50">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="text-green-600" size={20} />
                  <h2 className="font-semibold text-gray-800">AI Comparison Summary</h2>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-100">
                  <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{task.summary}</p>
                </div>
                <div className="mt-4 flex items-center justify-center gap-4">
                  <div className="text-center">
                    <span className={`text-3xl font-bold ${task.preferredResponse === 'A' ? 'text-blue-600' : 'text-gray-400'}`}>
                      A
                    </span>
                    {task.preferredResponse === 'A' && (
                      <span className="block text-xs text-blue-600 font-medium">Preferred</span>
                    )}
                  </div>
                  <span className="text-gray-400">vs</span>
                  <div className="text-center">
                    <span className={`text-3xl font-bold ${task.preferredResponse === 'B' ? 'text-purple-600' : 'text-gray-400'}`}>
                      B
                    </span>
                    {task.preferredResponse === 'B' && (
                      <span className="block text-xs text-purple-600 font-medium">Preferred</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Evaluation Form */}
        {canEvaluate && task.responseA && task.responseB && (
          <div className="p-6 border-t">
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-gray-600" size={20} />
              <h2 className="font-semibold text-gray-800">Rate Both Responses</h2>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleEvaluate} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <RatingCard
                  title="More Accurate"
                  type="A"
                  ratings={ratingA}
                  onRatingsChange={setRatingA}
                  color="blue"
                />
                <RatingCard
                  title="More Creative"
                  type="B"
                  ratings={ratingB}
                  onRatingsChange={setRatingB}
                  color="purple"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Which response do you prefer overall?
                </label>
                <div className="flex gap-4">
                  <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition text-center ${preferredResponse === 'A' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}>
                    <input
                      type="radio"
                      name="preferred"
                      value="A"
                      checked={preferredResponse === 'A'}
                      onChange={(e) => setPreferredResponse(e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-medium">A - More Accurate</span>
                  </label>
                  <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition text-center ${preferredResponse === 'B' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300'}`}>
                    <input
                      type="radio"
                      name="preferred"
                      value="B"
                      checked={preferredResponse === 'B'}
                      onChange={(e) => setPreferredResponse(e.target.value)}
                      className="sr-only"
                    />
                    <span className="font-medium">B - More Creative</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="inline mr-2" size={16} />
                  Why is your selected response better? (Optional)
                </label>
                <textarea
                  value={userSummary}
                  onChange={(e) => setUserSummary(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Explain why this response is better - what makes it stand out?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !preferredResponse}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Generating Summary...
                  </span>
                ) : (
                  'Submit Evaluation'
                )}
              </button>
            </form>
          </div>
        )}

        {task.status === 'completed' && task.userSummary && (
          <div className="p-6 border-t bg-amber-50">
            <div className="flex items-center gap-2 mb-3">
              <MessageSquare className="text-amber-600" size={20} />
              <h3 className="font-semibold text-amber-800">Evaluator's Explanation</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap italic">"{task.userSummary}"</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default TaskDetail;