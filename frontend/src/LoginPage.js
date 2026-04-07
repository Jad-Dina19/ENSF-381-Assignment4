import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Header, Footer } from "./Homepage";

export function DisplayStatus(props) {
    const statusColor = props.type === "success" ? "green" : "red";
    return (
        <div style={{ color: statusColor, fontWeight: "bold" }}>
            {props.message}
        </div>
    );
}

function LoginForm({setIsLoggedIn}) {
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

        fetch("http://127.0.0.1:5000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(res => res.json())
            .then(data => {
                if(data.success){
                    setMsg(data.message)
                    setMsgType("success")
                    setIsLoggedIn(true)
                    localStorage.setItem("isLoggedIn", "true");
                    localStorage.setItem("userId", data.userId); 
                    localStorage.setItem("username", data.username);
                }else{
                    setMsg(data.message || "Invalid credentials.")
                    setMsgType("error")
                }
            }).catch(() => {
            setMsg("Server error.");
            setMsgType("error");
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
                <br />
                <input type="text" value={username} onChange={event => setUsername(event.target.value)} />
                <br />
                <br />
                <label>Password: </label>
                <br />
                <input type="password" value={password} onChange={event => setPassword(event.target.value)} />
                <br />
                
        
                {msg !== "" && <DisplayStatus type={msgType} message={msg} />}
                
                <button type="button" onClick={handleLogin}>Login</button>
                <br />
                <br />
                <a href="#">Forgot Password?</a>
                <br />
                <Link to="/signup">Need and Account? Sign Up</Link>
            </form>
        </div>
    );
}

export default function LoginPage({isLoggedIn, setIsLoggedIn }) {
    return (
        <div>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <LoginForm setIsLoggedIn={setIsLoggedIn}/>
            <Footer />
        </div>
    );
}