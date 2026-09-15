
import { useState } from 'react'
import './App.css'

function App() {
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState('General')
  const [tone, setTone] = useState('Professional')
  const [outputType, setOutputType] = useState('LinkedIn Post')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleTransform = async () => {
    if (!content.trim()) {
      alert('Please enter some content first.')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content,
          audience: audience,
          tone: tone,
          outputType: outputType,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setResult(data.analysis)

    } catch (error) {
      console.error('Error:', error)

      alert(
        'Failed to analyze the content. Please make sure your backend is running on port 5000.'
      )

    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return

    try {
      const textToCopy = `
Topic:
${result.topic}

Summary:
${result.summary}

Key Facts:
${result.keyFacts?.map((fact, index) => `${index + 1}. ${fact}`).join('\n') || 'None'}

Impact:
${result.impact?.map((item, index) => `${index + 1}. ${item}`).join('\n') || 'None'}

Recommendations:
${result.recommendations?.map((item, index) => `${index + 1}. ${item}`).join('\n') || 'None'}
      `.trim()

      await navigator.clipboard.writeText(textToCopy)

      alert('Result copied!')

    } catch (error) {
      console.error('Copy failed:', error)
      alert('Failed to copy result.')
    }
  }

  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          <span className="logo-icon">✦</span>
          Content<span>Transform</span>
        </div>

        <div className="nav-links">
          <a href="#transform">Transform</a>
          <a href="#about">About</a>
        </div>

      </nav>


      <main>

        {/* HERO */}

        <section className="hero-section">

          <div className="badge">
            ✨ AI-Powered Content Transformation
          </div>

          <h1>
            Transform your content
            <br />
            <span>for any audience.</span>
          </h1>

          <p className="hero-description">
            Turn your existing content into clear, engaging and
            audience-specific communication in seconds.
          </p>

        </section>


        {/* TRANSFORMER */}

        <section className="transformer" id="transform">

          {/* INPUT CARD */}

          <div className="card input-card">

            <div className="card-header">

              <div>
                <h2>Your Content</h2>
                <p>Paste the content you want to transform.</p>
              </div>

              <span className="character-count">
                {content.length} characters
              </span>

            </div>


            {/* TEXTAREA */}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste your content here..."
            />


            {/* OPTIONS */}

            <div className="options">

              {/* AUDIENCE */}

              <div className="option">

                <label>Audience</label>

                <select
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                >
                  <option>General</option>
                  <option>Students</option>
                  <option>Developers</option>
                  <option>Business Professionals</option>
                  <option>Executives</option>
                </select>

              </div>


              {/* TONE */}

              <div className="option">

                <label>Tone</label>

                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  <option>Professional</option>
                  <option>Casual</option>
                  <option>Friendly</option>
                  <option>Persuasive</option>
                  <option>Technical</option>
                </select>

              </div>

            </div>


            {/* OUTPUT FORMAT */}

            <div className="output-section">

              <label>Output Format</label>

              <div className="output-options">

                {[
                  'LinkedIn Post',
                  'Advisory',
                  'Executive Summary',
                ].map((type) => (

                  <button
                    key={type}
                    type="button"
                    className={
                      outputType === type
                        ? 'output-button active'
                        : 'output-button'
                    }
                    onClick={() => setOutputType(type)}
                  >
                    {type}
                  </button>

                ))}

              </div>

            </div>


            {/* TRANSFORM BUTTON */}

            <button
              type="button"
              className="transform-button"
              onClick={handleTransform}
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  Transform Content
                  <span>→</span>
                </>
              )}

            </button>

          </div>


          {/* RESULT CARD */}

          <div className="card result-card">

            <div className="card-header">

              <div>
                <h2>Generated Content</h2>

                <p>
                  Your transformed content will appear here.
                </p>
              </div>

            </div>


            {/* RESULT AREA */}

            <div className="result-area">

              {/* LOADING */}

              {loading ? (

                <div className="empty-result">

                  <div className="empty-icon loading-icon">
                    ✦
                  </div>

                  <h3>
                    Analyzing your content...
                  </h3>

                  <p>
                    Gemini is processing your content.
                  </p>

                </div>


              ) : result ? (

                /* TRANSFORMED CONTENT */

                <div className="transformed-content">

                  {/* RESULT HEADER */}

                  <div className="transformed-header">

                    <div>
                      <span className="result-label">
                        ✦ TRANSFORMED CONTENT
                      </span>

                      <h3>
                        {result.topic || 'Generated Content'}
                      </h3>
                    </div>

                    <span className="audience-badge">
                      {audience}
                    </span>

                  </div>


                  {/* MAIN TRANSFORMED TEXT */}

                  <div className="transformed-text">

                    {outputType === 'LinkedIn Post' && (
                      <>
                        <strong>{result.summary}</strong>

                        {result.keyFacts?.length > 0 && (
                          <>
                            {'\n\n'}
                            {result.keyFacts.map((fact, index) => (
                              <span key={index}>
                                • {fact}
                                {'\n'}
                              </span>
                            ))}
                          </>
                        )}

                        {result.impact?.length > 0 && (
                          <>
                            {'\n'}
                            <strong>Impact</strong>
                            {'\n'}
                            {result.impact.map((item, index) => (
                              <span key={index}>
                                • {item}
                                {'\n'}
                              </span>
                            ))}
                          </>
                        )}

                        {result.recommendations?.length > 0 && (
                          <>
                            {'\n'}
                            <strong>Recommendations</strong>
                            {'\n'}
                            {result.recommendations.map(
                              (recommendation, index) => (
                                <span key={index}>
                                  {index + 1}. {recommendation}
                                  {'\n'}
                                </span>
                              )
                            )}
                          </>
                        )}
                      </>
                    )}


                    {outputType === 'Advisory' && (
                      <>
                        <strong>Advisory</strong>

                        {'\n\n'}

                        {result.summary}

                        {result.impact?.length > 0 && (
                          <>
                            {'\n\n'}
                            <strong>Key Considerations</strong>
                            {'\n'}
                            {result.impact.map((item, index) => (
                              <span key={index}>
                                • {item}
                                {'\n'}
                              </span>
                            ))}
                          </>
                        )}

                        {result.recommendations?.length > 0 && (
                          <>
                            {'\n'}
                            <strong>Recommended Actions</strong>
                            {'\n'}
                            {result.recommendations.map(
                              (recommendation, index) => (
                                <span key={index}>
                                  {index + 1}. {recommendation}
                                  {'\n'}
                                </span>
                              )
                            )}
                          </>
                        )}
                      </>
                    )}


                    {outputType === 'Executive Summary' && (
                      <>
                        <strong>Executive Summary</strong>

                        {'\n\n'}

                        {result.summary}

                        {result.keyFacts?.length > 0 && (
                          <>
                            {'\n\n'}
                            <strong>Key Points</strong>
                            {'\n'}
                            {result.keyFacts.map((fact, index) => (
                              <span key={index}>
                                • {fact}
                                {'\n'}
                              </span>
                            ))}
                          </>
                        )}

                        {result.impact?.length > 0 && (
                          <>
                            {'\n'}
                            <strong>Business Impact</strong>
                            {'\n'}
                            {result.impact.map((item, index) => (
                              <span key={index}>
                                • {item}
                                {'\n'}
                              </span>
                            ))}
                          </>
                        )}
                      </>
                    )}

                  </div>

                </div>


              ) : (

                /* EMPTY RESULT */

                <div className="empty-result">

                  <div className="empty-icon">
                    ✦
                  </div>

                  <h3>
                    Nothing here yet
                  </h3>

                  <p>
                    Enter your content and click
                    <strong> Transform Content </strong>
                    to generate your result.
                  </p>

                </div>

              )}

            </div>


            {/* COPY BUTTON */}

            {result && !loading && (

              <button
                type="button"
                className="copy-button"
                onClick={handleCopy}
              >
                📋 Copy Result
              </button>

            )}

          </div>

        </section>

      </main>


      {/* FOOTER */}

      <footer id="about">

        <p>
          Built with React + Gemini
        </p>

      </footer>

    </div>
  )
}

export default App

