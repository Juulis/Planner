// App.js
import React from 'react';
import './App.css'; // Din globala CSS
import Calendar from './components/Calendar'; // Kalender-komponenten
import ResourceCards from './components/ResourceCards'; // ResourceCards-komponenten

function App() {
  return (
    <div className="App">
      <h1>Welcome to the Project Planner</h1>
      <div className="App-Content">
        <div className="Calendar-Section">
          <Calendar /> {/* Din kalender visas här */}
        </div>
        <div className="ResourceCards-Section">
          <ResourceCards /> {/* Dina Resource Cards visas här */}
        </div>
      </div>
    </div>
  );
}

export default App;
