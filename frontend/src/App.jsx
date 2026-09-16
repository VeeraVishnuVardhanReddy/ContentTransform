import { useState } from 'react'
import './App.css'

function App() {
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState('General')
  const [tone, setTone] = useState('Professional')
  const [outputType, setOutputType] = useState('LinkedIn Post')

  const [mode, setMode] = useState('Transform')
  const [file, setFile] = useState(null)

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)


  /* =========================
     TRANSFORM / GENERATE
  ========================= */

  const handleTransform = async () => {
    if (!content.trim() && !file) {
      alert('Please enter some content or upload a file first.')
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const endpoint =
        mode === 'Generate'
          ? 'http://localhost:5000/generate'
          : 'http://localhost:5000/analyze'

      let response

      /*
        TRANSFORM + FILE

        Send the actual file to the backend.
        Backend will extract the content from the file.
      */

      if (mode === 'Transform' && file) {
        const formData = new FormData()

        formData.append('file', file)
        formData.append('content', content)
        formData.append('audience', audience)
        formData.append('tone', tone)
        formData.append('outputType', outputType)

        response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
        })
      }

      /*
        GENERATE or TRANSFORM WITHOUT FILE

        Send normal JSON.
      */

      else {
        response = await fetch(endpoint, {
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
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong')
      }

      setResult(data.analysis)

    } catch (error) {
      console.error('Error:', error)

      alert(
        error.message ||
          'Failed to process the content. Please make sure your backend is running on port 5000.'
      )
    } finally {
      setLoading(false)
    }
  }


  /* =========================
     COPY RESULT
  ========================= */

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

          {/* MODE SWITCH */}

          <div className="mode-switch">

            <button
              type="button"
              className={
                mode === 'Transform'
                  ? 'mode-button active'
                  : 'mode-button'
              }
              onClick={() => setMode('Transform')}
            >
              Transform
            </button>

            <button
              type="button"
              className={
                mode === 'Generate'
                  ? 'mode-button active'
                  : 'mode-button'
              }
              onClick={() => setMode('Generate')}
            >
              Generate
            </button>

          </div>


          {/* INPUT CARD */}

          <div className="card input-card">

            <div className="card-header">

              <div>

                <h2>Your Content</h2>

                <p>
                  {mode === 'Generate'
                    ? 'Describe what you want to generate.'
                    : 'Paste the content you want to transform.'}
                </p>

              </div>

              <span className="character-count">
                {content.length} characters
              </span>

            </div>


            {/* FILE UPLOAD */}

            <div className="file-upload">

              <input
                type="file"
                id="content-file"
                accept=".pdf,.ppt,.pptx,.txt,.png,.jpg,.jpeg,.mp3,.wav,.mp4,.mov"
                onChange={(e) => {
                  const selectedFile = e.target.files?.[0]

                  setFile(selectedFile || null)
                }}
              />

              <label
                htmlFor="content-file"
                className="file-upload-box"
              >

                <span className="upload-icon">
                  📁
                </span>

                <div>

                  <strong>
                    {file
                      ? file.name
                      : 'Upload your content'}
                  </strong>

                  <p>
                    {file
                      ? `${(
                          file.size /
                          1024 /
                          1024
                        ).toFixed(2)} MB`
                      : 'PDF, PPT, Image, Audio, Video or Text'}
                  </p>

                </div>

              </label>

            </div>


            {/* TEXTAREA */}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={
                mode === 'Generate'
                  ? 'Describe what you want to generate...'
                  : 'Paste your content here...'
              }
            />


            {/* OPTIONS */}

            <div className="options">

              {/* AUDIENCE */}

              <div className="option">

                <label>
                  Audience
                </label>

                <select
                  value={audience}
                  onChange={(e) =>
                    setAudience(e.target.value)
                  }
                >

                  <option>
                    General
                  </option>

                  <option>
                    Students
                  </option>

                  <option>
                    Developers
                  </option>

                  <option>
                    Business Professionals
                  </option>

                  <option>
                    Executives
                  </option>

                </select>

              </div>


              {/* TONE */}

              <div className="option">

                <label>
                  Tone
                </label>

                <select
                  value={tone}
                  onChange={(e) =>
                    setTone(e.target.value)
                  }
                >

                  <option>
                    Professional
                  </option>

                  <option>
                    Casual
                  </option>

                  <option>
                    Friendly
                  </option>

                  <option>
                    Persuasive
                  </option>

                  <option>
                    Technical
                  </option>

                </select>

              </div>

            </div>


            {/* OUTPUT FORMAT */}

            <div className="output-section">

              <label>
                Output Format
              </label>

              <div className="output-options">

                {[
                  'LinkedIn Post',
                  'Advisory',
                  'Executive Summary',
                  'Presentation',
                  'PDF',
                ].map((type) => (

                  <button
                    key={type}
                    type="button"
                    className={
                      outputType === type
                        ? 'output-button active'
                        : 'output-button'
                    }
                    onClick={() =>
                      setOutputType(type)
                    }
                  >
                    {type}
                  </button>

                ))}

              </div>

            </div>


            {/* TRANSFORM / GENERATE BUTTON */}

            <button
              type="button"
              className="transform-button"
              onClick={handleTransform}
              disabled={loading}
            >

              {loading ? (

                <>

                  <span className="spinner"></span>

                  {mode === 'Generate'
                    ? 'Generating...'
                    : 'Analyzing...'}

                </>

              ) : (

                <>

                  {mode === 'Generate'
                    ? 'Generate Content'
                    : 'Transform Content'}

                  <span>
                    →
                  </span>

                </>

              )}

            </button>

          </div>


          {/* RESULT CARD */}

          <div className="card result-card">

            <div className="card-header">

              <div>

                <h2>
                  Generated Content
                </h2>

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
                    {mode === 'Generate'
                      ? 'Generating your content...'
                      : 'Analyzing your content...'}
                  </h3>

                  <p>
                    Gemini is processing your content.
                  </p>

                </div>

              ) : result ? (

                /* RESULT */

                <div className="transformed-content">

                  {/* RESULT HEADER */}

                  <div className="transformed-header">

                    <div>

                      <span className="result-label">
                        ✦{' '}
                        {mode === 'Generate'
                          ? 'GENERATED CONTENT'
                          : 'TRANSFORMED CONTENT'}
                      </span>

                      <h3>
                        {result.topic ||
                          'Generated Content'}
                      </h3>

                    </div>

                    <span className="audience-badge">
                      {audience}
                    </span>

                  </div>


                  {/* PRESENTATION RESULT */}

                  {outputType === 'Presentation' &&
                  result.slides?.length > 0 ? (

                    <div className="transformed-text">

                      {result.slides.map(
                        (slide, index) => (

                          <div
                            key={index}
                            style={{
                              marginBottom: '24px',
                            }}
                          >

                            <strong>
                              Slide {index + 1}:{' '}
                              {slide.title}
                            </strong>

                            <div
                              style={{
                                marginTop: '8px',
                              }}
                            >

                              {slide.content?.map(
                                (item, itemIndex) => (

                                  <div
                                    key={itemIndex}
                                  >
                                    • {item}
                                  </div>

                                )
                              )}

                            </div>

                            {slide.speakerNotes && (

                              <div
                                style={{
                                  marginTop: '10px',
                                  fontSize: '13px',
                                }}
                              >

                                <strong>
                                  Speaker Notes:
                                </strong>

                                <div>
                                  {slide.speakerNotes}
                                </div>

                              </div>

                            )}

                          </div>

                        )
                      )}

                    </div>

                  ) : (

                    /* NORMAL RESULT */

                    <div className="transformed-text">

                      {outputType === 'LinkedIn Post' && (

                        <>

                          <strong>
                            {result.summary}
                          </strong>

                          {result.keyFacts?.length > 0 && (

                            <>

                              {'\n\n'}

                              {result.keyFacts.map(
                                (fact, index) => (

                                  <span key={index}>
                                    • {fact}
                                    {'\n'}
                                  </span>

                                )
                              )}

                            </>

                          )}


                          {result.impact?.length > 0 && (

                            <>

                              {'\n'}

                              <strong>
                                Impact
                              </strong>

                              {'\n'}

                              {result.impact.map(
                                (item, index) => (

                                  <span key={index}>
                                    • {item}
                                    {'\n'}
                                  </span>

                                )
                              )}

                            </>

                          )}


                          {result.recommendations?.length > 0 && (

                            <>

                              {'\n'}

                              <strong>
                                Recommendations
                              </strong>

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

                          <strong>
                            Advisory
                          </strong>

                          {'\n\n'}

                          {result.summary}

                          {result.impact?.length > 0 && (

                            <>

                              {'\n\n'}

                              <strong>
                                Key Considerations
                              </strong>

                              {'\n'}

                              {result.impact.map(
                                (item, index) => (

                                  <span key={index}>
                                    • {item}
                                    {'\n'}
                                  </span>

                                )
                              )}

                            </>

                          )}

                          {result.recommendations?.length > 0 && (

                            <>

                              {'\n'}

                              <strong>
                                Recommended Actions
                              </strong>

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

                          <strong>
                            Executive Summary
                          </strong>

                          {'\n\n'}

                          {result.summary}

                          {result.keyFacts?.length > 0 && (

                            <>

                              {'\n\n'}

                              <strong>
                                Key Points
                              </strong>

                              {'\n'}

                              {result.keyFacts.map(
                                (fact, index) => (

                                  <span key={index}>
                                    • {fact}
                                    {'\n'}
                                  </span>

                                )
                              )}

                            </>

                          )}

                          {result.impact?.length > 0 && (

                            <>

                              {'\n'}

                              <strong>
                                Business Impact
                              </strong>

                              {'\n'}

                              {result.impact.map(
                                (item, index) => (

                                  <span key={index}>
                                    • {item}
                                    {'\n'}
                                  </span>

                                )
                              )}

                            </>

                          )}

                        </>

                      )}


                      {outputType === 'PDF' && (

                        <>

                          <strong>
                            PDF Content
                          </strong>

                          {'\n\n'}

                          {result.transformedContent ||
                            result.summary}

                        </>

                      )}

                    </div>

                  )}

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
                    <strong>
                      {' '}
                      {mode === 'Generate'
                        ? 'Generate Content'
                        : 'Transform Content'}{' '}
                    </strong>
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