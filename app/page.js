'use client';
import { useState } from 'react';
import styles from './page.module.css';

function parseContent(raw) {
  const sections = {
    title: '',
    content: '',
    meta: '',
    hashtags: '',
    whatsapp: '',
  };

  // Title
  sections.title = raw.match(/\*\*Title:\*\*\s*(.*?)(?=\n|$)/)?.[1]?.trim() || 
                   raw.match(/Title:\s*(.*?)(?=\n|$)/)?.[1]?.trim() || '';

  // Full Content
  sections.content = raw.match(/\*\*Full Content:\*\*\s*([\s\S]*?)(?=\*\*Meta Description:|Meta Description:|$)/)?.[1]?.trim() ||
                     raw.match(/Full Content:\s*([\s\S]*?)(?=Meta Description:|$)/)?.[1]?.trim() || '';

  // Meta Description
  sections.meta = raw.match(/\*\*Meta Description:\*\*\s*([\s\S]*?)(?=\*\*5 Hashtags:|\*\*Hashtags:|5 Hashtags:|Hashtags:|$)/)?.[1]?.trim() ||
                  raw.match(/Meta Description:\s*([\s\S]*?)(?=Hashtags:|$)/)?.[1]?.trim() || '';

  // Hashtags
  sections.hashtags = raw.match(/\*\*5 Hashtags:\*\*\s*([\s\S]*?)(?=\*\*WhatsApp|WhatsApp|$)/)?.[1]?.trim() ||
                      raw.match(/\*\*Hashtags:\*\*\s*([\s\S]*?)(?=\*\*WhatsApp|WhatsApp|$)/)?.[1]?.trim() ||
                      raw.match(/Hashtags:\s*([\s\S]*?)(?=WhatsApp|$)/)?.[1]?.trim() || '';

  // WhatsApp
  sections.whatsapp = raw.match(/\*\*WhatsApp Short Version:\*\*\s*([\s\S]*?)$/)?.[1]?.trim() ||
                      raw.match(/WhatsApp Short Version:\s*([\s\S]*?)$/)?.[1]?.trim() ||
                      raw.match(/\*\*WhatsApp.*?:\*\*\s*([\s\S]*?)$/)?.[1]?.trim() || '';

  // Clean ** from any field
  Object.keys(sections).forEach(key => {
    sections[key] = sections[key].replace(/\*\*/g, '').trim();
  });

  return sections;
}

export default function Home() {
  const [form, setForm] = useState({
    topic: '',
    type: 'News Article',
    language: 'Assamese',
    tone: 'Formal',
    length: 'Medium',
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGenerate = async () => {
    if (!form.topic) { setError('Please enter a topic'); return; }
    setError('');
    setLoading(true);
    setResult(null);
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
        setResult(parseContent(data.content));
      }
    } catch (err) {
      setError('Failed to connect. Make sure n8n is running.');
    }
    setLoading(false);
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <main className={styles.main}>
      <div className={styles.container}>

        <div className={styles.header}>
          <div className={styles.badge}>AI Powered</div>
          <h1 className={styles.title}>Regional Content Generator</h1>
          <p className={styles.subtitle}>Generate professional content in Assamese, Hindi, Bengali & more</p>
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
                <option>Bengali</option>
                <option>Hindi</option>
                <option>Odia</option>
                <option>Punjabi</option>
                <option>Santali</option>
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

          {error && <p className={styles.error}>⚠️ {error}</p>}

          <button className={styles.btnGenerate} onClick={handleGenerate} disabled={loading}>
            {loading ? <span className={styles.spinner}>Generating...</span> : '⚡ Generate Content'}
          </button>
        </div>

        {result && (
          <div className={styles.results}>

            {result.title && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>📰</span>
                  <span className={styles.sectionLabel}>Title</span>
                  <button className={styles.btnCopy} onClick={() => handleCopy(result.title, 'title')}>
                    {copied === 'title' ? '✅' : 'Copy'}
                  </button>
                </div>
                <h2 className={styles.titleText}>{result.title}</h2>
              </div>
            )}

            {result.content && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>📝</span>
                  <span className={styles.sectionLabel}>Full Content</span>
                  <button className={styles.btnCopy} onClick={() => handleCopy(result.content, 'content')}>
                    {copied === 'content' ? '✅' : 'Copy'}
                  </button>
                </div>
                <p className={styles.contentText}>{result.content}</p>
              </div>
            )}

            {result.meta && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>🔍</span>
                  <span className={styles.sectionLabel}>Meta Description</span>
                  <button className={styles.btnCopy} onClick={() => handleCopy(result.meta, 'meta')}>
                    {copied === 'meta' ? '✅' : 'Copy'}
                  </button>
                </div>
                <p className={styles.metaText}>{result.meta}</p>
              </div>
            )}

            {result.hashtags && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>#</span>
                  <span className={styles.sectionLabel}>Hashtags</span>
                  <button className={styles.btnCopy} onClick={() => handleCopy(result.hashtags, 'hashtags')}>
                    {copied === 'hashtags' ? '✅' : 'Copy'}
                  </button>
                </div>
                <div className={styles.hashtagsRow}>
                  {result.hashtags.split(' ').map((tag, i) => (
                    <span key={i} className={styles.hashtag}>{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {result.whatsapp && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <span className={styles.sectionIcon}>💬</span>
                  <span className={styles.sectionLabel}>WhatsApp Version</span>
                  <button className={styles.btnCopy} onClick={() => handleCopy(result.whatsapp, 'whatsapp')}>
                    {copied === 'whatsapp' ? '✅' : 'Copy'}
                  </button>
                </div>
                <p className={styles.whatsappText}>{result.whatsapp}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </main>
  );
}