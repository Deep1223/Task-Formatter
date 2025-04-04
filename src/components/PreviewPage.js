import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreviewPage = () => {
    const [output, setOutput] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const savedOutput = localStorage.getItem('taskOutput') || '';
        setOutput(savedOutput);
    }, []);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(output);
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        } catch {
            setCopySuccess('Failed to copy');
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-lg">
                <div className="card-header bg-dark text-white d-flex justify-content-between">
                    <h4 className="mb-0">📋 Formatted Output</h4>
                    <button className="btn btn-light btn-sm" onClick={() => navigate('/')}>Back</button>
                </div>
                <div className="card-body">
                    <div className="mb-3">
                        <button className="btn btn-primary me-2" onClick={handleCopy}>Copy</button>
                        <button className="btn btn-secondary" onClick={() => setEditMode(!editMode)}>
                            {editMode ? 'Save' : 'Edit'}
                        </button>
                        {copySuccess && <span className="ms-3 text-success">{copySuccess}</span>}
                    </div>
                    {editMode ? (
                        <textarea
                            className="form-control"
                            rows={12}
                            value={output}
                            onChange={(e) => setOutput(e.target.value)}
                        />
                    ) : (
                        <pre className="formatted-output p-3">{output}</pre>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PreviewPage;
