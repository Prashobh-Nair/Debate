import { useState } from 'react';

function App() {
  const [subject, setSubject] = useState('Technology');
  const [difficulty, setDifficulty] = useState('Medium');
  const [debate, setDebate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateDebate = async () => {
    setLoading(true);
    setError(null);
    setDebate(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject, difficulty }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate debate topic');
      }

      const data = await response.json();
      setDebate(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          AI Debate Generator
        </h1>
        <p className="text-slate-400 text-lg">
          Challenge your perspective with AI-generated debate topics and balanced arguments.
        </p>
      </header>

      <div className="glass-card p-6 md:p-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Subject</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
            >
              <option>Technology</option>
              <option>Education</option>
              <option>Politics</option>
              <option>Environment</option>
              <option>Social Media</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-2">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="input-field"
            >
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <button
          onClick={generateDebate}
          disabled={loading}
          className="btn-primary w-full md:w-auto"
        >
          {loading ? 'Generating...' : 'Generate Debate Topic'}
        </button>
      </div>

      {loading && (
        <div className="space-y-6">
          <div className="loading-shimmer h-24 w-full"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="loading-shimmer h-64 w-full"></div>
            <div className="loading-shimmer h-64 w-full"></div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center">
          {error}
        </div>
      )}

      {debate && (
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="glass-card p-6 md:p-8 border-l-4 border-l-indigo-500">
            <h2 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-2">Debate Topic</h2>
            <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
              {debate.topic}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 md:p-8 bg-green-500/5 border-green-500/10">
              <h3 className="text-xl font-bold text-green-400 mb-6 flex items-center">
                <span className="mr-2">👍</span> Points FOR
              </h3>
              <ul className="space-y-4">
                {debate.pointsFor.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-green-500 mr-3 mt-1">•</span>
                    <span className="text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-card p-6 md:p-8 bg-red-500/5 border-red-500/10">
              <h3 className="text-xl font-bold text-red-400 mb-6 flex items-center">
                <span className="mr-2">👎</span> Points AGAINST
              </h3>
              <ul className="space-y-4">
                {debate.pointsAgainst.map((point, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-3 mt-1">•</span>
                    <span className="text-slate-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
