import React from "react";
import flavours from "./data/flavours";
import { useEffect, useState } from "react";
import reviews from "./data/reviews"
import { Link } from "react-router-dom";


export function Header() {
    return (
        <div>
            <header>
                <img src="/images/logo.webp" alt="Sweet Scoop logo" />
                <h1>Sweet Scoop Ice Cream</h1>
                
            </header>
            <div className="navbar">
                <Link href="/">Home</Link>
                <Link href="/FlavoursPage">Flavors</Link>
                <Link to="/login">Login</Link>
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
        <p>Price: {price}</p>
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

    const shuffled = [...flavours].sort(() => 0.5 - Math.random());
    const featuredFlavours = shuffled.slice(0, 3);
    useEffect(() =>{
        const shuffleReviews = [...reviews].sort(() => 0.5 - Math.random());
        const featuredReviews = shuffleReviews.slice(0, 2);
        setReviewList(featuredReviews);
    }, [])
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
                {reviewList.map((review) =>{
                    return <ReviewCard review={review}/>
                })}
            </div>

        </div>
    )
}

export function Footer(){
    return(
        <footer>
            © 2026 Sweet Scoop Ice Cream Shop. All rights reserved.
        </footer>
    )
}

export default function Home(){
    return(
        <div> 
            <Header/>
            <MainSection/>
            <Footer/>
        </div>
    )   
}
