import React, { useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Calendar.css';

const generateProjects = () => {
    return Array.from({ length: 5 }, (_, index) => ({
        id: index + 1,
        name: `Project ${index + 1}`,
        hours: Array(7 * 7).fill(0), // 7 veckor = 49 dagar
    }));
};

const daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

const generateDates = (startDate, weeks = 7) => {
    const dates = [];
    const current = new Date(startDate);

    // Justera så att vi alltid börjar på måndag
    const dayOffset = (current.getDay() + 6) % 7; // Söndag (0) blir sista dagen
    current.setDate(current.getDate() - dayOffset);

    for (let i = 0; i < weeks * 7; i++) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1);
    }
    return dates;
};

const getWeekNumber = (date) => {
    const targetDate = new Date(date.valueOf());
    const firstDayOfYear = new Date(targetDate.getFullYear(), 0, 1);
    const pastDaysOfYear = (targetDate - firstDayOfYear + 86400000) / 86400000; // 86400000 = ms per dag
    return Math.ceil((pastDaysOfYear + (firstDayOfYear.getDay() + 6) % 7) / 7);
};

const isWeekend = (date) => {
    const day = date.getDay();
    return day === 6 || day === 0; // Lördag (6) och Söndag (0)
};

function Calendar() {
    const [projects, setProjects] = useState(generateProjects());
    const [startDate, setStartDate] = useState(new Date());
    const [isResourceFormVisible, setIsResourceFormVisible] = useState(false);
    const [isProjectFormVisible, setIsProjectFormVisible] = useState(false);
    const [resourceCard, setResourceCard] = useState({ title: '', description: '', from: '', to: '' });
    const [newProjectName, setNewProjectName] = useState('');

    const dates = generateDates(startDate, 7);

    const handleWeekChange = (direction) => {
        const newStartDate = new Date(startDate);
        newStartDate.setDate(startDate.getDate() + direction * 7 * 7); // Hoppa 7 veckor fram/bakåt
        setStartDate(newStartDate);
    };

    const handleAddProject = (e) => {
        e.preventDefault();
        const newProject = {
            id: projects.length + 1,
            name: newProjectName,
            hours: Array(7 * 7).fill(0),
        };
        console.log(""+e);
        setProjects([...projects, newProject]);
        setNewProjectName('');
        setIsProjectFormVisible(false); // Stänger popup
    };

    const handleResourceFormSubmit = (e) => {
        e.preventDefault();
        console.log(resourceCard);
        setIsResourceFormVisible(false); // Stänger formuläret när det är skickat
    };

    return (
        <div className="calendar">
            <h2 className="planner-title">Schedule</h2>
            <div className="controls">
                <button onClick={() => handleWeekChange(-1)}>Previous 7 Weeks</button>
                <button onClick={() => handleWeekChange(1)}>Next 7 Weeks</button>
            </div>

            <div className="calendar-grid">
                {/* Övre raden: Datum och veckonummer */}
                <div className="date-row">
                    <div className="project-header">
                        <div className="header-content">
                            {/* Plus-ikon för att lägga till projekt */}
                            <i
                                className="fa-solid fa-plus"
                                onClick={() => setIsProjectFormVisible(true)}
                                title="Add Project"
                            ></i>
                        </div>
                        <button className="sort-button">
                            <i className="fas fa-sort"></i> {/* Sorteringsikon */}
                        </button>
                        <div className="header-content">
                            {/* Plus-ikon för att lägga till resource cards */}
                            <i
                                className="fa-solid fa-user-plus"
                                onClick={() => setIsResourceFormVisible(true)}
                                title="Add Resource"
                            ></i>
                        </div>
                    </div>

                    {dates.map((date, index) => (
                        <div
                            key={index}
                            className={`date-header ${isWeekend(date) ? 'weekend' : 'weekday'}`}
                        >
                            <div className="week-number">
                                {index % 7 === 0 && `W ${getWeekNumber(date)}`} {/* Veckonummer varje måndag */}
                            </div>
                            <div className="month">
                                {index % 7 === 0 &&
                                    date.toLocaleString('default', { month: 'short' })}{' '}
                            </div>
                            <div className="day">
                                {daysOfWeek[(date.getDay() + 6) % 7]} {date.getDate()}{' '}
                            </div>
                        </div>
                    ))}
                </div>
                {/* Projektrader och tomma dagceller */}
                {projects.map((project) => (
                    <div key={project.id} className="project-row">
                        <div className="project-name">{project.name}</div>
                        {dates.map((date, dayIndex) => (
                            <div
                                key={dayIndex}
                                className={`day-cell ${isWeekend(date) ? 'weekend' : 'weekday'}`}
                                onClick={() => {
                                    setResourceCard({
                                        ...resourceCard,
                                        from: date.toISOString().split('T')[0],
                                        to: date.toISOString().split('T')[0],
                                    });
                                    setIsResourceFormVisible(true); // Visar formuläret för resource card
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Formulär för att skapa resurskort */}
            {isResourceFormVisible && (
                <div className="resource-form">
                    <form onSubmit={handleResourceFormSubmit}>
                        <label>
                            Name:
                            <input
                                type="text"
                                value={resourceCard.title}
                                onChange={(e) =>
                                    setResourceCard({ ...resourceCard, title: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            Description:
                            <textarea
                                value={resourceCard.description}
                                onChange={(e) =>
                                    setResourceCard({ ...resourceCard, description: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            From:
                            <input
                                type="date"
                                value={resourceCard.from}
                                onChange={(e) =>
                                    setResourceCard({ ...resourceCard, from: e.target.value })
                                }
                            />
                        </label>
                        <label>
                            To:
                            <input
                                type="date"
                                value={resourceCard.to}
                                onChange={(e) =>
                                    setResourceCard({ ...resourceCard, to: e.target.value })
                                }
                            />
                        </label>
                        <button type="submit">Add Resource</button>
                    </form>
                </div>
            )}

            {/* Formulär för att lägga till projekt */}
            {isProjectFormVisible && (
    <div className="project-modal">
        <div className="modal-overlay" onClick={() => setIsProjectFormVisible(false)}></div>
        <div className="modal-content">
            <h3>Add New Project</h3>
            <form onSubmit={handleAddProject}>
                <label>
                    Project Name:
                    <input
                        type="text"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        required
                    />
                </label>
                <div className="form-buttons">
                    <button type="submit">Add Project</button>
                    <button
                        type="button"
                        onClick={() => setIsProjectFormVisible(false)}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

        </div>
    );
}

export default Calendar;




