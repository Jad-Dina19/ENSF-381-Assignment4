import React from "react";
import flavours from "./data/flavours";
import { useEffect, useState } from "react";
import reviews from "./data/reviews"
import { Link} from "react-router-dom";


export function Header({isLoggedIn, setIsLoggedIn}) {
    return (
        <div>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <img src="/images/logo.webp" alt="Sweet Scoop logo" />
                    <h1>Sweet Scoop Ice Cream</h1>
                </div>
                
                
                <div className="auth-controls">
                    {isLoggedIn ? (
                        <Link onClick={() => {
                            localStorage.clear();
                            setIsLoggedIn(false);
                        }} to="/">Logout</Link>
                    ) : (
                        <Link to="/login">Login</Link>
                    )}
                </div>
            </header>
            <div className="navbar">
                <Link to="/">Home</Link>
                <Link to="/FlavoursPage">Flavors</Link>
                
                {isLoggedIn && <Link to="/OrderHistory">Order History</Link>}
            </div>
        </div>
    );
}

function IceCreamCard({flavour}){
    const {name, price, description, image} = flavour;

   return(
    <div className="flavor-card">
        <h3>{name}</h3>
        <p>{description}</p>
        <p>Price: ${price}</p>
        <img src={image} alt={name}/>
    </div>
   )
}

function ReviewCard({review}){
    const {customerName, review: comment, rating} = review
    return(
        <div>
            <h3>{customerName}</h3>
            <p>Rating: {"★".repeat(rating)}{"☆".repeat(5 - rating)}</p>
            <p>{comment}</p>
        </div>
    );


}


function MainSection(){
    const [reviewList, setReviewList] = useState([]);
    const [featuredFlavours, setFeaturedFlavours] = useState([]); // Added state

    useEffect(() => {
        
        fetch("http://127.0.0.1:5000/flavours")
            .then(res => res.json())
            .then(data => {
                if(data.success) {
                    const shuffled = [...data.flavours].sort(() => 0.5 - Math.random());
                    setFeaturedFlavours(shuffled.slice(0, 3));
                }
            });

        
        fetch("http://127.0.0.1:5000/reviews")
            .then(res => res.json())
            .then(data => {
                if(data.success) setReviewList(data.reviews);
            });
    }, []);

    return(
       <div className="main-section">
            <h2>About Sweet Scoop Ice Cream</h2>
            <p>Sweet Scoop Ice Cream is where every scoop is made with love and a sprinkle of happiness. Since day one, we’ve been serving up smiles with our rich, creamy flavors crafted from the finest ingredients. Whether you’re craving a timeless classic like vanilla or feeling adventurous with something bold and exciting, there’s a perfect scoop waiting just for you. Stop by, treat yourself, and make every day a little sweeter!</p>
            <br/>
            <h2>Featured Flavours</h2>
            <div className="flavor-grid">
                {featuredFlavours.map((flavour) =>{
                    return <IceCreamCard flavour={flavour}/>;
                })}
            </div>
            <h2>Customer Reviews</h2>
            <div>
                {reviewList.map((review, index) => (
                    <ReviewCard key={index} review={review}/>
                ))}
            </div>
        </div>
    );
}

export function Footer(){
    return(
        <footer>
            © 2026 Sweet Scoop Ice Cream Shop. All rights reserved.
        </footer>
    )
}

export default function Home({isLoggedIn, setIsLoggedIn}){
    return(
        <div> 
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <MainSection/>
            <Footer/>
        </div>
    )   
}
