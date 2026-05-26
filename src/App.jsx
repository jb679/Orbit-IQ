import './App.css'
import { useEffect, useMemo, useState } from 'react'


const QUIZ_PROGRESS_STORAGE_KEY = 'orbitiq_progress_local'

const quizQuestionsByTopic = {
  1: [
    {
      id: 'bio-1',
      question: 'What is the basic unit of life?',
      options: ['Atom', 'Cell', 'Molecule', 'Tissue'],
      answer: 'Cell'
    },
    {
      id: 'bio-2',
      question: 'Which process do plants use to make food?',
      options: ['Respiration', 'Digestion', 'Photosynthesis', 'Fermentation'],
      answer: 'Photosynthesis'
    }
  ],
  2: [
    {
      id: 'astro-1',
      question: 'What is the name of our galaxy?',
      options: ['Andromeda', 'Milky Way', 'Sombrero', 'Whirlpool'],
      answer: 'Milky Way'
    },
    {
      id: 'astro-2',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Saturn', 'Mars', 'Mercury'],
      answer: 'Mars'
    }
  ],
  3: [
    {
      id: 'earth-1',
      question: 'Which layer of Earth is liquid and generates the magnetic field?',
      options: ['Inner core', 'Outer core', 'Mantle', 'Crust'],
      answer: 'Outer core'
    },
    {
      id: 'earth-2',
      question: 'What type of rock forms from cooled lava?',
      options: ['Sedimentary', 'Metamorphic', 'Igneous', 'Fossil'],
      answer: 'Igneous'
    }
  ],
  4: [
    {
      id: 'physics-1',
      question: 'Which force keeps planets in orbit around the Sun?',
      options: ['Magnetism', 'Friction', 'Gravity', 'Tension'],
      answer: 'Gravity'
    },
    {
      id: 'physics-2',
      question: 'What is the unit of electrical resistance?',
      options: ['Volt', 'Watt', 'Ohm', 'Ampere'],
      answer: 'Ohm'
    }
  ],
  5: [
    {
      id: 'chem-1',
      question: 'What is H2O commonly called?',
      options: ['Hydrogen peroxide', 'Water', 'Salt', 'Oxygen'],
      answer: 'Water'
    },
    {
      id: 'chem-2',
      question: 'What is the pH of a neutral solution?',
      options: ['0', '3', '7', '14'],
      answer: '7'
    }
  ],
  6: [
    {
      id: 'quantum-1',
      question: 'In quantum physics, energy is often transferred in discrete packets called?',
      options: ['Waves', 'Fields', 'Quanta', 'Ions'],
      answer: 'Quanta'
    },
    {
      id: 'quantum-2',
      question: 'The principle that limits simultaneous precision of position and momentum is?',
      options: [
        'Relativity principle',
        'Heisenberg uncertainty principle',
        'Conservation law',
        'Pauli exclusion principle'
      ],
      answer: 'Heisenberg uncertainty principle'
    }
  ]
}

const TopicCard = ({ title, description, icon, difficulty, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`topic-card ${isHovered ? 'hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="topic-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      <span className={`difficulty ${difficulty}`}>{difficulty}</span>
    </div>
  )
}

function App() {

  
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [quizProgressByTopic, setQuizProgressByTopic] = useState(() => {
    const savedProgress = localStorage.getItem(QUIZ_PROGRESS_STORAGE_KEY)
    return savedProgress ? JSON.parse(savedProgress) : {}
  })

  const topics = [
    {
      id: 1,
      title: "Biology",
      description: "Learn about life, cells, and living organisms",
      icon: "🧬",
      difficulty: "beginner"
    },
    {
      id: 2,
      title: "Astronomy",
      description: "Journey through space, stars, and galaxies",
      icon: "🌌",
      difficulty: "beginner"
    },
    {
      id: 3,
      title: "Earth Science",
      description: "Understand our planet, climate, and geology",
      icon: "🌍",
      difficulty: "beginner"
    },
    {
      id: 4,
      title: "Physics",
      description: "Explore the laws of motion, energy, and the universe",
      icon: "⚛️",
      difficulty: "intermediate"
    },
    {
      id: 5,
      title: "Chemistry",
      description: "Discover elements, compounds, and chemical reactions",
      icon: "🧪",
      difficulty: "intermediate"
    },
    {
      id: 6,
      title: "Quantum Physics",
      description: "Dive into the mysterious world of quantum mechanics",
      icon: "🔬",
      difficulty: "advanced"
    }
  ];

  useEffect(() => {
    localStorage.setItem(QUIZ_PROGRESS_STORAGE_KEY, JSON.stringify(quizProgressByTopic))
  }, [quizProgressByTopic])

  const quizStats = useMemo(() => {
    const total = Object.values(quizQuestionsByTopic).reduce(
      (sum, topicQuestions) => sum + topicQuestions.length,
      0
    )

    const answeredSet = new Set()
    Object.values(quizProgressByTopic).forEach((topicProgress) => {
      if (!topicProgress?.answers) {
        return
      }

      Object.entries(topicProgress.answers).forEach(([questionId, answer]) => {
        if (answer) {
          answeredSet.add(questionId)
        }
      })
    })

    return {
      answered: answeredSet.size,
      total
    }
  }, [quizProgressByTopic])

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic)
  }

  const updateAnswer = (topicId, questionId, selectedOption) => {
    setQuizProgressByTopic((prev) => {
      const previousTopicProgress = prev[topicId] || { answers: {} }

      return {
        ...prev,
        [topicId]: {
          ...previousTopicProgress,
          answers: {
            ...previousTopicProgress.answers,
            [questionId]: selectedOption
          }
        }
      }
    })
  }

  return (
    
    <div className="app">
      
      <header className="app-header">
        <h1>OrbitIQ 🚀 </h1>
        <p className="tagline">Your Journey to Scientific Discovery</p>
      </header>
      

      <main className="main-content">
        {!selectedTopic ? (
          <>
            <section className="intro-section">
              <h2>Choose Your Science Adventure</h2>
              <p>Start exploring the fascinating world of science, one topic at a time.</p>
              <p>
                Quiz progress: {quizStats.answered}/{quizStats.total} answered
              </p>
            </section>

            <div className="topics-grid">
              {topics.map(topic => (
                <TopicCard 
                  key={topic.id}
                  {...topic}
                  onClick={() => handleTopicClick(topic)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="topic-detail">
            <button className="back-button" onClick={() => setSelectedTopic(null)}>
              ← Back to Topics
            </button>
            <div className="topic-header">
              <span className="detail-icon">{selectedTopic.icon}</span>
              <h2>{selectedTopic.title}</h2>
            </div>
            <p className="detail-description">{selectedTopic.description}</p>

            <div className="quiz-section">
              <h3>{selectedTopic.title} Quick Quiz</h3>
              <p className="quiz-subtitle">
                Answers are auto-saved locally in this browser.
              </p>

              <div className="quiz-list">
                {(quizQuestionsByTopic[selectedTopic.id] || []).map((question, index) => {
                  const selectedAnswer =
                    quizProgressByTopic[selectedTopic.id]?.answers?.[question.id] || ''

                  return (
                    <article className="quiz-question-card" key={question.id}>
                      <p className="question-number">Question {index + 1}</p>
                      <p className="question-text">{question.question}</p>

                      <div className="question-options">
                        {question.options.map((option) => (
                          <label className="option-item" key={option}>
                            <input
                              type="radio"
                              name={question.id}
                              checked={selectedAnswer === option}
                              onChange={() => updateAnswer(selectedTopic.id, question.id, option)}
                            />
                            <span>{option}</span>
                          </label>
                        ))}
                      </div>

                      {selectedAnswer && (
                        <p className="saved-answer">Saved answer: {selectedAnswer}</p>
                      )}
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>Made with 💜 for curious minds</p>
      </footer>
    </div>
  )
}

export default App
