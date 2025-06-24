import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    gitcode: "",
  });
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setEvaluation(null);

    try {
      const res = await axios.post("/api/evaluate", formData);
      setEvaluation(res.data);
    } catch (err) {
      setError("Failed to get evaluation. Please try again.");
      console.error(err);
    }

    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="form-container">
          <h1>Project Completion AI Evaluator</h1>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Project Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Project Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>GitHub Codebase</label>
              <textarea
                name="gitcode"
                value={formData.gitcode}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <button type="submit" disabled={loading}>
              {loading ? "Evaluating..." : "Evaluate Project"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}

          {evaluation && (
            <div className="evaluation-result">
              <h2>Evaluation Result</h2>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${evaluation.completionPct}%` }}
                >
                  {evaluation.completionPct}%
                </div>
              </div>
              <p>
                <strong>Feedback:</strong> {evaluation.feedback}
              </p>
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
