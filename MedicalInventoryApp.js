import React, { useState, useEffect } from "react";
import { ref, set, onValue } from "firebase/database";
import database from "./firebaseConfig";
import "./styles.css";

const MedicalInventoryApp = () => {
    const [medications, setMedications] = useState([]);
    const [newMed, setNewMed] = useState({ name: "", quantity: "", dailyUsage: "" });
    const [lowStockAlerts, setLowStockAlerts] = useState([]);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        const medicationsRef = ref(database, "medications");
        onValue(medicationsRef, (snapshot) => {
            if (snapshot.exists()) {
                setMedications(snapshot.val());
            }
        });
    }, []);

    const addMedication = () => {
        if (!newMed.name || !newMed.quantity || !newMed.dailyUsage) {
            alert("נא למלא את כל השדות");
            return;
        }
        const updatedMeds = [...medications, newMed];
        setMedications(updatedMeds);
        set(ref(database, "medications"), updatedMeds);
        setNewMed({ name: "", quantity: "", dailyUsage: "" });
        setShowForm(false);
    };

    const updateQuantity = (index, newQuantity) => {
        const updatedMeds = [...medications];
        updatedMeds[index].quantity = newQuantity;
        setMedications(updatedMeds);
        set(ref(database, "medications"), updatedMeds);
    };

    return (
        <div className="container">
            <h1>📋 ניהול מלאי תרופות</h1>
            <button className="add-button" onClick={() => setShowForm(true)}>➕ הוסף תרופה</button>
            
            {showForm && (
                <div className="form-box">
                    <input
                        type="text"
                        placeholder="שם התרופה"
                        value={newMed.name}
                        onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="כמות נוכחית"
                        value={newMed.quantity}
                        onChange={(e) => setNewMed({ ...newMed, quantity: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="צריכה יומית"
                        value={newMed.dailyUsage}
                        onChange={(e) => setNewMed({ ...newMed, dailyUsage: e.target.value })}
                    />
                    <button className="save-button" onClick={addMedication}>✔ שמור</button>
                </div>
            )}
            
            {lowStockAlerts.length > 0 && (
                <div className="alert-box">
                    ⚠️ התרופות הבאות עומדות להיגמר בקרוב:
                    <ul>
                        {lowStockAlerts.map((med, index) => (
                            <li key={index}>🔴 {med.name} (נותרו {med.quantity} יחידות)</li>
                        ))}
                    </ul>
                </div>
            )}

            <table>
                <thead>
                    <tr>
                        <th>שם התרופה</th>
                        <th>כמות נוכחית</th>
                        <th>צריכה יומית</th>
                        <th>עדכון כמות</th>
                    </tr>
                </thead>
                <tbody>
                    {medications.map((med, index) => (
                        <tr key={index} className={med.quantity / med.dailyUsage <= 14 ? "low-stock" : ""}>
                            <td>{med.name}</td>
                            <td>{med.quantity}</td>
                            <td>{med.dailyUsage}</td>
                            <td>
                                <input
                                    type="number"
                                    value={med.quantity}
                                    onChange={(e) => updateQuantity(index, Number(e.target.value))}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default MedicalInventoryApp;

