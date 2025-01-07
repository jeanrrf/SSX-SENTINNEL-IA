import React, { useEffect, useState } from 'react';
import { openDatabase } from '../utils/database';

interface DatabaseViewerProps {
    data: Record<string, unknown>;
    columns: Array<{ key: string; label: string }>;
}

const DatabaseViewer: React.FC<DatabaseViewerProps> = () => {
    const [events, setEvents] = useState<any[]>([]);
    const [errors, setErrors] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const db = await openDatabase();
            const eventsResult = db.exec('SELECT * FROM analytics_events');
            const errorsResult = db.exec('SELECT * FROM error_logs');
            const events = eventsResult[0]?.values || [];
            const errors = errorsResult[0]?.values || [];
            setEvents(events);
            setErrors(errors);
        };

        fetchData();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Analytics Events</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">ID</th>
                        <th className="py-2">Category</th>
                        <th className="py-2">Action</th>
                        <th className="py-2">Label</th>
                        <th className="py-2">Value</th>
                        <th className="py-2">Metadata</th>
                        <th className="py-2">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map(event => (
                        <tr key={event[0]}>
                            <td className="py-2">{event[0]}</td>
                            <td className="py-2">{event[1]}</td>
                            <td className="py-2">{event[2]}</td>
                            <td className="py-2">{event[3]}</td>
                            <td className="py-2">{event[4]}</td>
                            <td className="py-2">{event[5]}</td>
                            <td className="py-2">{new Date(event[6]).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <h2 className="text-xl font-bold mt-8 mb-4">Error Logs</h2>
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        <th className="py-2">ID</th>
                        <th className="py-2">Message</th>
                        <th className="py-2">Stack</th>
                        <th className="py-2">Context</th>
                        <th className="py-2">Severity</th>
                        <th className="py-2">Code</th>
                        <th className="py-2">Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    {errors.map(error => (
                        <tr key={error[0]}>
                            <td className="py-2">{error[0]}</td>
                            <td className="py-2">{error[1]}</td>
                            <td className="py-2">{error[2]}</td>
                            <td className="py-2">{error[3]}</td>
                            <td className="py-2">{error[4]}</td>
                            <td className="py-2">{error[5]}</td>
                            <td className="py-2">{new Date(error[6]).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default DatabaseViewer;
