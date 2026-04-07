import React, { useState, useEffect } from "react";
import { Header, Footer } from "./Homepage";
/* import flavors from "./data/flavours"; */
import { useNavigate } from "react-router-dom";

function FlavorItem({ flavor, addToOrder }) {
    const [showDescription, setShowDescription] = useState(false);
    const { name, price, image, description } = flavor;

    return (
        <div
            className="flavor-card"
            onMouseLeave={() => setShowDescription(false)}
            onMouseEnter={() => setShowDescription(true)}
        >
            <img src={image} alt={name} />
            <h3>{name}</h3>
            <p>${price}</p>
            {showDescription && <p>{description}</p>}
            <button onClick={() => addToOrder(flavor)}>Add to Order</button>
        </div>
    );
}

/* function FlavourCatalog({ addToOrder }) {
    return (
        <div className="flavor-grid">
            {flavors.map((flavor) => (
                <FlavorItem
                    key={flavor.id}
                    flavor={flavor}
                    addToOrder={addToOrder}
                />
            ))}
        </div>
    );
} */

function OrderItem({ item, remove }) {
    const { name, price, quantity, flavorId } = item; 

    return (
        <div className="order-item">
            <h4>{name}</h4>
            <p>Quantity: {quantity}</p>
            <p>Price: ${(price * quantity).toFixed(2)}</p>
            <button className="remove" onClick={() => remove(item)}>
                Remove Item
            </button>
        </div>
    );
}

function OrderList({ order, removeFromOrder }) {
    let total = 0;
    order.forEach((element) => {
        total += element.price * element.quantity;
    });

    return (
        <div className="order-list">
            <h2>Your Order</h2>
            {order.length === 0 ? (
                <p>No items added yet.</p>
            ) : (
                order.map((item) => (
                    <OrderItem
                        key={item.flavorId}
                        item={item}
                        remove={removeFromOrder}
                    />
                ))
            )}
            <h3>Total: ${total.toFixed(2)}</h3>
        </div>
    );
}

export default function Flavors({isLoggedIn, setIsLoggedIn}) {

    

    
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate("/login"); 
        }
    }, [isLoggedIn, navigate]);




    const [order, setOrder] = useState([]);
    const [catalog, setCatalog] = useState([]);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        
        fetch("http://127.0.0.1:5000/flavours").then(res => res.json())
            .then(data => setCatalog(data.flavours));
        
        
        fetch(`http://127.0.0.1:5000/cart?userId=${userId}`).then(res => res.json())
            .then(data => { if(data.success) setOrder(data.cart); });
    }, [userId]);

    function addToOrder(flavor) {
        const existing = order.find(item => item.flavorId === flavor.id);
        const method = existing ? "PUT" : "POST"; 
        const body = { userId: parseInt(userId), flavorId: flavor.id };
        if (existing) body.quantity = existing.quantity + 1;

        fetch("http://127.0.0.1:5000/cart", {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        }).then(res => res.json()).then(data => setOrder(data.cart));
    }

    function removeFromOrder(item) {
        fetch("http://127.0.0.1:5000/cart", {
            method: "DELETE", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: parseInt(userId), flavorId: item.flavorId })
        }).then(res => res.json()).then(data => setOrder(data.cart));
    }

    function handlePlaceOrder() {
        fetch("http://127.0.0.1:5000/orders", {
            method: "POST", 
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: parseInt(userId) })
        }).then(res => res.json()).then(data => {
            alert(data.message);
            setOrder([]); 
        });
    }

    return (
        <div className="flavors-page">
            <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn}/>
            <div className="content">
                <div className="flavor-grid">
                    {catalog.map(f => <FlavorItem key={f.id} flavor={f} addToOrder={addToOrder}/>)}
                </div>
                <OrderList order={order} removeFromOrder={removeFromOrder} />
                <button onClick={handlePlaceOrder}>Place Order</button>
            </div>
            <Footer />
        </div>
    );
}