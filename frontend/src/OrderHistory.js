import React, { useState, useEffect } from "react";
import { Header, Footer } from "./Homepage";
import { useNavigate } from "react-router-dom";


export default function OrderHistory({ isLoggedIn, setIsLoggedIn }) {
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn, navigate]);
    
    
    const [history, setHistory] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetch(`http://127.0.0.1:5000/orders?userId=${userId}`) 
            .then(res => res.json())
            .then(data => { if(data.success) setHistory(data.orders); });
    }, [userId]);

    return (
        <div>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            <div className="main-section">
                <h2>Order History</h2>
                {history.length === 0 ? <p>No orders yet.</p> : history.map(o => (
                    <div key={o.orderId} style={{border: "1px solid pink", padding: "10px", margin: "10px"}}>
                        <p>Order #{o.orderId} - {o.timestamp}</p>
                        <p>Total: ${o.total}</p>
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
}