import React from "react"
import {useState, useEffect} from "react"
import {useNavigate, Link} from "react-router-dom"
import {Header, Footer} from "./Homepage"
import {DisplayStatus} from "./LoginPage"

function SignUpForm(){
    const nav = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("")

    function handleSignup(){
        if(confirmPassword !== password){
            setMessage("Passwords do not match.")
            setMessageType("failiure")
            return;
        }
    
        fetch("http://127.0.0.1:5000/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body : JSON.stringify({
                    username: username,
                    email: email,
                    password: password
                })
            }
        ).then(res => res.json())
        .then((data) => {
            if(data.success){
                setMessage(data.message)
                setMessageType("success") 
            }
            else{
                setMessage(data.message)
                setMessageType("failiure")
            }
        }).catch(() =>{
            setMessage("Server failiure")
            setMessageType("failiure")
        })
    }

    useEffect(()=>{
        if(messageType === "success"){
            setTimeout(() =>{
                nav("/login")
            }, 2000)
        }
        
    }, [message, messageType])

    return(
            <div className="main-section">
            <h2>SignUp</h2>
            <form>
                <label>Username</label>
                <br />
                <input type="text" value={username} onChange={event => setUsername(event.target.value)} />
                <br />
                <br />
                <label>Email</label>
                <br />
                <input type="text" value={email} onChange={event => setEmail(event.target.value)} />
                <br />
                <br />
                <label>Password</label>
                <br />
                <input type="text" value={password} onChange={event => setPassword(event.target.value)} />
                <br />
                <br /> 
                <label>Confirm Password</label>
                <br />
                <input type="text" value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} />
                <br /> 

                 {message !== "" && <DisplayStatus type={messageType} message={message} />}

                <button type="button" onClick={handleSignup}>Signup</button>
                <br />
                <br />
                <Link to='/login'>Already have an account? Log in!</Link>
            </form>
        </div>
    );

}

function SignupPage({isLoggedIn, setIsLoggedIn}){
    return(
        <div>
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <SignUpForm/>
            <Footer/>
        </div>
    );
}

export default SignupPage