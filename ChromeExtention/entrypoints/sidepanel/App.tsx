import { useMemo, useState } from 'react';
import './App.css';

// ✏️ EDIT THIS LIST: each course and the skills associated with it.
const COURSES: { name: string; skills: string[] }[] = [
  { name: 'React Bootcamp', skills: ['React', 'TypeScript'] },
  { name: 'Node.js API Course', skills: ['Node.js', 'Express', 'REST APIs'] },
  { name: 'Python Data Science', skills: ['Python', 'Pandas'] },
];

// ✏️ EDIT THIS MESSAGE: shown for the "Skill endorsed" message type.
const ENDORSED_MESSAGE =
  "Awesome! I've endorsed the skills for you, please leave a rating and your valuable feedback for the course to improve ourselves";

type MessageType = 'initial' | 'endorsed';

const MESSAGE_TYPES: { id: MessageType; label: string }[] = [
  { id: 'initial', label: 'Initial message' },
  { id: 'endorsed', label: 'Skill endorsed' },
];

function formatSkills(skills: string[]): string {
  if (skills.length === 0) return '<skills>';
  if (skills.length === 1) return skills[0] ?? '<skills>';
  const last = skills[skills.length - 1] ?? '';
  return `${skills.slice(0, -1).join(', ')} and ${last}`;
}

function App() {
  const [messageType, setMessageType] = useState<MessageType>('initial');
  const [name, setName] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<(typeof COURSES)[number] | null>(null);
  const [copied, setCopied] = useState(false);

  const initialMessage = useMemo(
    () =>
      `hey ${name.trim() || '<name>'}\n` +
      `thanks for connecting me on linkedin if you add ${formatSkills(
        selectedCourse?.skills ?? [],
      )} to your skills, i will be more happy to endorse those skills for you on linkedin profile`,
    [name, selectedCourse],
  );

  const message = messageType === 'initial' ? initialMessage : ENDORSED_MESSAGE;

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(message);
    } catch {
      // Fallback when the async clipboard API is unavailable
      const textarea = document.createElement('textarea');
      textarea.value = message;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="generator">
      <h1 className="title">LinkedIn Message Generator</h1>

      <div className="type-group" role="radiogroup" aria-label="Message type">
        {MESSAGE_TYPES.map((type) => (
          <label
            key={type.id}
            className={messageType === type.id ? 'type-option active' : 'type-option'}
          >
            <input
              type="radio"
              name="message-type"
              value={type.id}
              checked={messageType === type.id}
              onChange={() => setMessageType(type.id)}
            />
            {type.label}
          </label>
        ))}
      </div>

      {messageType === 'initial' && (
        <>
          <label className="field">
            <span className="field-label">Person's name</span>
            <input
              type="text"
              value={name}
              placeholder="e.g. Alex"
              onChange={(event) => setName(event.target.value)}
            />
          </label>

          <div className="field">
            <span className="field-label">Course they came from</span>
            <div className="course-list">
              {COURSES.map((course) => (
                <button
                  key={course.name}
                  type="button"
                  className={
                    course.name === selectedCourse?.name ? 'course-btn active' : 'course-btn'
                  }
                  onClick={() => setSelectedCourse(course)}
                >
                  {course.name}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="field">
        <span className="field-label">Generated message</span>
        <pre className="preview">{message}</pre>
      </div>

      <button type="button" className="copy-btn" onClick={copyMessage}>
        {copied ? 'Copied!' : 'Copy message'}
      </button>
    </main>
  );
}

export default App;
