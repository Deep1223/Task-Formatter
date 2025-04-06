import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const TaskFormatter = () => {
    const [devName, setDevName] = useState('');
    const [taskText, setTaskText] = useState('');
    const navigate = useNavigate();

    // Load devName from localStorage on first render
    useEffect(() => {
        const storedName = localStorage.getItem('devName');
        if (storedName) {
            setDevName(storedName);
        }
    }, []);

    // Save devName to localStorage whenever it changes
    useEffect(() => {
        if (devName.trim() !== '') {
            localStorage.setItem('devName', devName);
        }
    }, [devName]);

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
            }
        }

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
