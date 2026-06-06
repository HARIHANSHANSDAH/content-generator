'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function Home() {
  const [form, setForm] = useState({
    topic: '',
    type: 'News Article',
    language: 'Assamese',
    tone: 'Formal',
    length: 'Medium',
  });
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!form.topic) {
      setError('Please enter a topic');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.content);
      }
    } catch (err) {
      setError('Failed to connect. Make sure n8n is running.');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.header}>
          <h1 className={styles.title}>🌏 Regional Content Generator</h1>
          <p className={styles.subtitle}>Generate AI content in Assamese, Hindi, Bengali & more</p>
        </div>

        <div className={styles.card}>
          <div className={styles.formGroup}>
            <label>Topic</label>
            <input
              type="text"
              name="topic"
              placeholder="e.g. Assam floods 2024"
              value={form.topic}
              onChange={handleChange}
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Language</label>
              <select name="language" value={form.language} onChange={handleChange}>
                <option>Assamese</option>
                <option>Hindi</option>
                <option>Bengali</option>
                <option>Odia</option>
                <option>Punjabi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Content Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option>News Article</option>
                <option>Blog Post</option>
                <option>Social Media Post</option>
                <option>WhatsApp Message</option>
                <option>Script</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Tone</label>
              <select name="tone" value={form.tone} onChange={handleChange}>
                <option>Formal</option>
                <option>Casual</option>
                <option>Breaking News</option>
                <option>Informative</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Length</label>
              <select name="length" value={form.length} onChange={handleChange}>
                <option>Short</option>
                <option>Medium</option>
                <option>Long</option>
              </select>
            </div>
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button
            className={styles.btnGenerate}
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? '⏳ Generating...' : '⚡ Generate Content'}
          </button>
        </div>

        {result && (
          <div className={styles.resultCard}>
            <div className={styles.resultHeader}>
              <h3>Generated Content</h3>
              <button className={styles.btnCopy} onClick={handleCopy}>
                {copied ? '✅ Copied!' : 'Copy'}
              </button>
            </div>
            <pre className={styles.resultText}>{result}</pre>
          </div>
        )}

      </div>
    </main>
  );
}