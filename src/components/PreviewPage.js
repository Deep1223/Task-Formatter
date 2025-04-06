import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const PreviewPage = () => {
    const [output, setOutput] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [copySuccess, setCopySuccess] = useState('');
    const [showChart, setShowChart] = useState(false);
    const [chartData, setChartData] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedOutput = localStorage.getItem('taskOutput') || '';
        setOutput(savedOutput);
        generateChartData(savedOutput);
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

    const generateChartData = (text) => {
        const lines = text.split('\n');
        const taskLines = lines.filter(line => line.includes('IIS/TSK-') && line.includes('['));
        const data = [];

        taskLines.forEach((line) => {
            const match = line.match(/(IIS\/TSK-\d+).*?\[(.*?)\]/);
            if (match) {
                const taskId = match[1];
                const workedTimeStr = match[2];
                const [val, unit] = workedTimeStr.split(' ');

                let minutes = 0;
                if (unit.includes('day')) minutes = parseInt(val) * 1440;
                else if (unit.includes('hour')) minutes = parseInt(val) * 60;
                else if (unit.includes('min')) minutes = parseInt(val);

                data.push({ name: taskId, y: minutes });
            }
        });

        setChartData(data);
    };

    const chartOptions = {
        chart: {
            type: 'pie',
        },
        title: {
            text: 'Worked Time by Task',
        },
        tooltip: {
            pointFormat: '<b>{point.percentage:.1f}%</b> ({point.y} min)',
        },
        accessibility: {
            point: {
                valueSuffix: '%',
            },
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                },
                showInLegend: true,
            },
        },
        series: [
            {
                name: 'Tasks',
                colorByPoint: true,
                data: chartData,
            },
        ],
        credits: {
            enabled: false, 
        },
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
                        <button className="btn btn-secondary me-2" onClick={() => setEditMode(!editMode)}>
                            {editMode ? 'Save' : 'Edit'}
                        </button>
                        <button className="btn btn-info" onClick={() => setShowChart(true)}>
                            📊 View Task Time Chart
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

            {/* Chart Modal */}
            <Modal show={showChart} onHide={() => setShowChart(false)} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>📊 Worked Time by Task</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {chartData.length > 0 ? (
                        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
                    ) : (
                        <p className="text-center">No task data found for chart.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowChart(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default PreviewPage;
