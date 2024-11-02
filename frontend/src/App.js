import React, { useState, useEffect } from 'react';
import './styles.css';

//const BACKEND_URL = 'ab2b86ce1a9c049afb646a2e8c5b2dd8-335801688.us-east-1.elb.amazonaws.com';

function App() {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ patientName: '', doctorName: '', date: '' });

    useEffect(() => {
        fetch('http://ab2b86ce1a9c049afb646a2e8c5b2dd8-335801688.us-east-1.elb.amazonaws.com/appointments')
            .then(res => res.json())
            .then(data => setAppointments(data));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://ab2b86ce1a9c049afb646a2e8c5b2dd8-335801688.us-east-1.elb.amazonaws.com/appointments', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(form),
        })
            .then(res => res.json())
            .then(newAppointment => setAppointments([...appointments, newAppointment]));
    };

    const handleDelete = (id) => {
        fetch(`http://ab2b86ce1a9c049afb646a2e8c5b2dd8-335801688.us-east-1.elb.amazonaws.com/appointments/${id}`, {
            method: 'DELETE',
        })
            .then(res => res.json())
            .then(data => {
                setAppointments(appointments.filter(appt => appt.id !== id));
            });
    };

    return (
        <div className="container">
            <h1>Doctor's Office Appointments</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Patient Name"
                    value={form.patientName}
                    onChange={e => setForm({ ...form, patientName: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Doctor Name"
                    value={form.doctorName}
                    onChange={e => setForm({ ...form, doctorName: e.target.value })}
                />
                <input
                    type="date"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                />
                <button type="submit">Book Appointment</button>
            </form>
            <div className="appointment-list">
                {appointments.map(appt => (
                    <div className="appointment-item" key={appt.id}>
                        <h3>{appt.patientName}</h3>
                        <p className="appointment-date">Date: {new Date(appt.date).toLocaleDateString()}</p>
                        <p className="appointment-doctor">Doctor: {appt.doctorName}</p>
                        <button onClick={() => handleDelete(appt.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
