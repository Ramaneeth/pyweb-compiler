
import React from 'react';

interface SidebarProps {
  onSelectSnippet: (code: string) => void;
}

const SNIPPETS = [
  {
    name: "Hello World",
    code: "print('Hello, Python World!')\n\nname = input('What is your name? ') if False else 'User'\nprint(f'Greetings, {name}!')"
  },
  {
    name: "Lists & Loops",
    code: "fruits = ['apple', 'banana', 'cherry']\n\nfor index, fruit in enumerate(fruits):\n    print(f\"{index + 1}: {fruit.capitalize()}\")\n\n# List comprehension\nsquares = [x**2 for x in range(10)]\nprint('Squares:', squares)"
  },
  {
    name: "Data Structures",
    code: "person = {\n    'name': 'Alice',\n    'age': 30,\n    'skills': ['Python', 'Data Science', 'React']\n}\n\nprint(f\"Name: {person['name']}\")\nprint(f\"Top Skill: {person['skills'][0]}\")"
  },
  {
    name: "Fibonacci Sequence",
    code: "def fibonacci(n):\n    a, b = 0, 1\n    result = []\n    while a < n:\n        result.append(a)\n        a, b = b, a + b\n    return result\n\nprint(fibonacci(100))"
  },
  {
    name: "Error Handling",
    code: "try:\n    x = 10 / 0\nexcept ZeroDivisionError as e:\n    print(f\"Caught error: {e}\")\nfinally:\n    print(\"Execution completed.\")"
  }
];

const Sidebar: React.FC<SidebarProps> = ({ onSelectSnippet }) => {
  return (
    <div className="w-64 bg-[#161b22] border-r border-gray-700 flex flex-col h-full overflow-hidden shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2 text-blue-400">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.25.46-.4.38-.55.31-.66.21-.74.13-.81.04H7.87l-.1.03-.26.12-.22.23-.1.32v1.1l.03.26.12.25.22.22.31.09h5.07l.73.11.66.23.55.31.43.37.3.42.22.45.13.46.06.43v3.1l-.02.24-.05.28-.11.31-.17.34-.26.34-.35.33-.45.31-.59.3-.73.25-.88.2-1.05.03-1.05-.03-.88-.2-.73-.25-.59-.3-.45-.31-.34-.33-.26-.34-.17-.34-.11-.31-.05-.28-.02-.24v-1.15l.03-.26.12-.25.23-.22.31-.09H7.88l-.73-.11-.66-.23-.54-.31-.44-.37-.3-.42-.22-.45-.13-.46-.06-.43V11.5l.02-.24.05-.28.11-.31.17-.34.26-.34.35-.33.45-.31.59-.3.73-.25.88-.2 1.05-.03h5.08l.1-.03.27-.12.22-.23.1-.33V8.1l-.03-.26-.12-.25-.22-.22-.31-.09H7.87l-.73-.11-.66-.23-.55-.31-.43-.37-.3-.42-.22-.45-.13-.46-.06-.43V4.5l.02-.24.05-.28.11-.31.17-.34.26-.34.35-.33.45-.31.59-.3.73-.25.88-.2 1.05-.03 1.05.03zM9.5 3.5a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5zM14.5 19a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5z" />
          </svg>
          PyWeb
        </h1>
        <p className="text-xs text-gray-500 mt-1">Python Web Compiler</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <h2 className="px-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">Examples</h2>
        <nav className="space-y-1">
          {SNIPPETS.map((snippet) => (
            <button
              key={snippet.name}
              onClick={() => onSelectSnippet(snippet.code)}
              className="w-full text-left px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-all flex items-center gap-3"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 opacity-50"></span>
              {snippet.name}
            </button>
          ))}
        </nav>

        <div className="mt-8 px-4">
          <h2 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">AI Assistant</h2>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
            <p className="text-xs text-blue-200/80 leading-relaxed">
              Use the "Explain Error" button after a crash to get intelligent help from Gemini.
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700 bg-[#0d1117]">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          Environment Ready
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
