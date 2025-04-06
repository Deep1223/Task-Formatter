// TaskFormatter.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskFormatter = () => {
    const [devName, setDevName] = useState('');
    const [taskText, setTaskText] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedName = localStorage.getItem('devName');
        if (storedName) {
            setDevName(storedName);
        }
    }, []);

    useEffect(() => {
        if (devName.trim() !== '') {
            localStorage.setItem('devName', devName);
        }
    }, [devName]);

    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        const now = new Date();
        const reminderHour = 17;
        const delay = new Date().setHours(reminderHour, 0, 0, 0) - now;

        if (delay > 0) {
            const timer = setTimeout(() => {
                new Notification('🛠️ Reminder', {
                    body: 'Don’t forget to update today’s task list!',
                });
            }, delay);
            return () => clearTimeout(timer);
        }
    }, []);

    const formatToDayHourMin = (hours, minutes) => {
        let totalMin = (parseInt(hours) * 60) + parseInt(minutes);
        const days = Math.floor(totalMin / (24 * 60));
        totalMin %= (24 * 60);
        const hrs = Math.floor(totalMin / 60);
        const mins = totalMin % 60;

        let result = '';
        if (days > 0) result += `${days} days `;
        if (hrs > 0) result += `${hrs} hour${hrs > 1 ? 's' : ''} `;
        if (mins > 0 || result === '') result += `${mins} min`;
        return result.trim();
    };

    const generateFormattedText = () => {
        const lines = taskText.trim().split(/\n+/);
        const today = new Date().toLocaleDateString('en-GB').split('/').reverse().join('-');

        let formatted = `Update List (${today})\nDeveloper Name:- ${devName}\n\n`;

        let workedTotal = 0;
        let estTotal = 0;

        for (let line of lines) {
            const match = line.match(/\(?\s*(IIS\/TSK-\d+)\)?\s*[-:)]?\s*(.*?)\s*-\s*Worked Time:\s*(\d{1,2}):(\d{1,2}):\d{1,2}\s*\/\s*Est\. Time:\s*(\d{1,2}):(\d{1,2})/i);

            if (match) {
                const [, taskId, title, wh, wm, eh, em] = match;
                const workedMin = parseInt(wh) * 60 + parseInt(wm);
                const estMin = parseInt(eh) * 60 + parseInt(em);

                const workedStr = formatToDayHourMin(wh, wm);
                const estStr = formatToDayHourMin(eh, em);

                formatted += `${taskId} - ${title.trim()} - [${workedStr}] - [${estStr}] - \n`;

                if (workedMin > estMin * 1.1) {
                    formatted += `Reason:- \n`;
                }

                workedTotal += workedMin;
                estTotal += estMin;
            }
        }

        const workedStr = formatToDayHourMin(Math.floor(workedTotal / 60), workedTotal % 60);
        const estStr = formatToDayHourMin(Math.floor(estTotal / 60), estTotal % 60);

        formatted += `\nTotal Worked Time: ${workedStr}\nTotal Estimated Time: ${estStr}`;

        // Save analytics summary
        const analytics = JSON.parse(localStorage.getItem('analytics') || '{}');
        analytics[today] = {
            workedMin: workedTotal,
            estMin: estTotal,
            tasks: lines.length
        };
        localStorage.setItem('analytics', JSON.stringify(analytics));

        localStorage.setItem('taskOutput', formatted.trim());
        navigate('/preview');
    };

    return (
        <div className="container mt-4 task-formatter">
            <div className="card shadow-lg">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">🛠️ Task Formatter</h4>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <label className="form-label fw-bold">Developer Name</label>
                        <input
                            type="text"
                            value={devName}
                            onChange={(e) => setDevName(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label fw-bold">Task List</label>
                        <textarea
                            rows={8}
                            value={taskText}
                            onChange={(e) => setTaskText(e.target.value)}
                            className="form-control"
                        />
                    </div>
                    <button onClick={generateFormattedText} className="btn btn-success w-100">
                        Generate & Open Preview
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TaskFormatter;
