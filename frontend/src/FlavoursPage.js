import React, { useState, useEffect } from "react";
import { Header, Footer } from "./Homepage";
import flavors from "./data/flavours";

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

function FlavourCatalog({ addToOrder }) {
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
}

function OrderItem({ item, remove }) {
    const { name, price, quantity } = item;

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
                        key={item.id}
                        item={item}
                        remove={removeFromOrder}
                    />
                ))
            )}
            <h3>Total: ${total.toFixed(2)}</h3>
        </div>
    );
}

export default function Flavors() {
    const [order, setOrder] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedOrder = localStorage.getItem("sweetScoopOrder");
        if (savedOrder) {
            setOrder(JSON.parse(savedOrder));
        }
        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem("sweetScoopOrder", JSON.stringify(order));
        }
    }, [order, isLoaded]);

    function addToOrder(flavor) {
        setOrder((prevOrder) => {
            const existingItem = prevOrder.find((item) => item.id === flavor.id);

            if (existingItem) {
                return prevOrder.map((item) =>
                    item.id === flavor.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }

            return [...prevOrder, { ...flavor, quantity: 1 }];
        });
    }

    function removeFromOrder(flavor) {
        setOrder((prevOrder) =>
            prevOrder
                .map((item) =>
                    item.id === flavor.id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item
                )
                .filter((item) => item.quantity > 0)
        );
    }

    return (
        <div className="flavors-page">
            <Header />
            <div className="content">
                <FlavourCatalog addToOrder={addToOrder} />
                <OrderList order={order} removeFromOrder={removeFromOrder} />
            </div>
            <Footer />
        </div>
    );
}