import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Mail, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react'

function App() {
  const [articles, setArticles] = useState([])
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState({ type: '', message: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would be an API call. 
    // Here we fetch the JSON file which will be updated by the researcher.
    const fetchArticles = async () => {
      try {
        const response = await fetch('/content/articles.json');
        const data = await response.json();
        setArticles(data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles()
  }, [])

  const handleSubscribe = async (e) => {
    e.preventDefault()
    setStatus({ type: 'loading', message: 'Subscribing...' })
    try {
      await axios.post('/api/subscribe', { email })
      setStatus({ type: 'success', message: 'Thank you for subscribing!' })
      setEmail('')
    } catch (error) {
      const msg = error.response?.data?.error || 'Something went wrong.'
      setStatus({ type: 'error', message: msg })
    }
  }

  return (
    <div className="App">
      <header>
        <div className="container">
          <nav>
            <a href="/" className="logo">The Energeia Lab</a>
            <div className="nav-links">
              <a href="#articles">Research</a>
              <a href="#newsletter">Newsletter</a>
            </div>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <h1>Evidence-Based Spiritual Energy</h1>
            <p>
              A curated digest of the latest academic papers, clinical trials, 
              and lab studies on biofields, prana, chi, and quantum consciousness.
            </p>
            <a href="#articles" className="btn">Explore Research</a>
          </div>
        </section>

        <section id="articles" className="container">
          <h2>Latest Research Summaries</h2>
          {loading ? (
            <p>Loading research...</p>
          ) : (
            <div className="article-list">
              {articles.map(article => (
                <div key={article.id} className="card article-card">
                  <div className="article-meta">{article.date} | By {article.author}</div>
                  <h3>{article.title}</h3>
                  <p>{article.summary}</p>
                  <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn" style={{background: 'var(--secondary)'}}>
                    Read Full Paper <ExternalLink size={16} style={{verticalAlign: 'middle', marginLeft: '4px'}} />
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        <section id="newsletter" className="container">
          <div className="newsletter-box">
            <Mail size={48} style={{marginBottom: '1rem'}} />
            <h2>Stay at the Frontier</h2>
            <p>Get a weekly digest of new research delivered to your inbox. No fluff, just science.</p>
            <form className="newsletter-form" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="your@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" disabled={status.type === 'loading'}>
                Subscribe
              </button>
            </form>
            {status.message && (
              <p style={{marginTop: '1rem', color: status.type === 'error' ? '#ff8a80' : '#b9f6ca'}}>
                {status.message}
              </p>
            )}
            <div style={{marginTop: '1.5rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8}}>
              <ShieldCheck size={14} style={{marginRight: '4px'}} />
              Your privacy is respected. Unsubscribe at any time.
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>&copy; {new Date().getFullYear()} The Energeia Lab. All rights reserved.</p>
          <p>Advancing the scientific understanding of spiritual energy.</p>
        </div>
      </footer>
    </div>
  )
}

export default App
