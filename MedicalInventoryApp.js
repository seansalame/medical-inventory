import React, { useState, useEffect } from "react";

const MedicalInventoryApp = () => {
    const [medications, setMedications] = useState([]);
    const [newMed, setNewMed] = useState({ name: "", quantity: "", dailyUsage: "" });
    const [lowStockAlerts, setLowStockAlerts] = useState([]);

    useEffect(() => {
        checkLowStock();
    }, [medications]);

    const addMedication = () => {
        if (!newMed.name || !newMed.quantity || !newMed.dailyUsage) {
            alert("נא למלא את כל השדות");
            return;
        }
        setMedications([...medications, { ...newMed, quantity: Number(newMed.quantity), dailyUsage: Number(newMed.dailyUsage) }]);
        setNewMed({ name: "", quantity: "", dailyUsage: "" });
    };

    const updateQuantity = (index, newQuantity) => {
        const updatedMeds = [...medications];
        updatedMeds[index].quantity = newQuantity;
        setMedications(updatedMeds);
    };

    const checkLowStock = () => {
        const alerts = medications.filter(med => med.quantity / med.dailyUsage <= 14);
        setLowStockAlerts(alerts);
    };

    return (
        <div style={{ direction: "rtl", textAlign: "right", padding: "20px", maxWidth: "500px", margin: "auto" }}>
            <h1>📋 ניהול מלאי תרופות</h1>
            <button onClick={addMedication}>➕ הוסף תרופה</button>

            {lowStockAlerts.length > 0 && (
                <div style={{ backgroundColor: "red", color: "white", padding: "10px", marginTop: "10px" }}>
                    ⚠️ התרופות הבאות עומדות להיגמר בקרוב:
                    <ul>
                        {lowStockAlerts.map((med, index) => (
                            <li key={index}>🔴 {med.name} (נותרו {med.quantity} יחידות)</li>
                        ))}
                    </ul>
                </div>
            )}

            <table border="1" style={{ width: "100%", marginTop: "10px" }}>
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
                        <tr key={index} style={{ backgroundColor: med.quantity / med.dailyUsage <= 14 ? "yellow" : "white" }}>
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
