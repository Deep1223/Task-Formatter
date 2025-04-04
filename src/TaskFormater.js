import React, { useState } from 'react';

const TaskFormatter = () => {
    const [devName, setDevName] = useState('Deep Dungarani');
    const [taskText, setTaskText] = useState('');
    const [output, setOutput] = useState('');
    const [copySuccess, setCopySuccess] = useState('');

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
                const workedStr = formatToDayHourMin(wh, wm);
                const estStr = formatToDayHourMin(eh, em);
                formatted += `${taskId} - ${title.trim()} - [${workedStr}] - [${estStr}]\n`;
            }
        }

        setOutput(formatted.trim());
        setCopySuccess('');
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000); // Clear after 2 seconds
        } catch (err) {
            setCopySuccess('Failed to copy');
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h3>Task Formatter</h3>
            <input
                type="text"
                value={devName}
                onChange={(e) => setDevName(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
                placeholder="Developer Name"
            />
            <textarea
                rows={15}
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                style={{ width: '100%', marginBottom: '10px' }}
                placeholder="Paste your task list here"
            />
            <button onClick={generateFormattedText}>Generate</button>

            {output && (
                <>
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={handleCopy}>Copy to Clipboard</button>
                        <span style={{ marginLeft: '10px', color: 'green' }}>{copySuccess}</span>
                    </div>
                    <pre style={{ marginTop: '10px', fontWeight: 'bold', whiteSpace: 'pre-wrap' }}>
                        {output}
                    </pre>
                </>
            )}
        </div>
    );
};

export default TaskFormatter;
