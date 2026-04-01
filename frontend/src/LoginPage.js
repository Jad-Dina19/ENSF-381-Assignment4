import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer } from "./Homepage";

function DisplayStatus(props) {
    const statusColor = props.type === "success" ? "green" : "red";
    return (
        <div style={{ color: statusColor, fontWeight: "bold" }}>
            {props.message}
        </div>
    );
}

function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [msgType, setMsgType] = useState("");
    
    const navigate = useNavigate();

    function handleLogin() {
        if (username === "" || password === "") {
            setMsg("Username and password cannot be empty.");
            setMsgType("error");
            return;
        }
        if (password.length < 8) {
            setMsg("Password must be at least 8 characters.");
            setMsgType("error");
            return;
        }

        fetch("https://jsonplaceholder.typicode.com/users")
            .then(res => res.json())
            .then(data => {
                let found = false;
        for (let i = 0; i < data.length; i++) {
            if (data[i].username === username && data[i].email === password) {
                found = true;
            }
        }

        if (found) {
            setMsg("Login successful");
            setMsgType("success");
        } else {
            setMsg("Invalid credentials.");
            setMsgType("error");
        }
            });
    }

    useEffect(() => {
        if (msgType === "success") {
            setTimeout(() => {
                navigate("/FlavoursPage");
            }, 2000);
        }
    }, [msgType, navigate]);

    return (
        <div className="main-section">
            <h2>Login</h2>
            <form>
                <label>Username: </label>
                <input type="text" value={username} onChange={event => setUsername(event.target.value)} />
                <br />
                <label>Password: </label>
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
                <br />
                
                {msg !== "" && <DisplayStatus type={msgType} message={msg} />}
                
                <button type="button" onClick={handleLogin}>Login</button>
                <br />
                <a href="#">Forgot Password?</a>
            </form>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div>
            <Header />
            <LoginForm />
            <Footer />
        </div>
    );
}