import React, { useEffect, useState } from 'react';
import { getResourceCards, createResourceCard, updateResourceCard, deleteResourceCard } from '../Api';
import './Calendar.css';
import Calendar from './Calendar';


const ResourceCards = () => {
    const [cards, setCards] = useState([]);
    const [newCard, setNewCard] = useState({ title: '', description: '', from: '', to: '' });
    const [errorMessage, setErrorMessage] = useState(null); // Felhantering

    // Hämta Resource Cards vid komponentens laddning
    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await getResourceCards();
                console.log('Fetched cards:', response.data); // Debug-logg
                setCards(response.data);
            } catch (error) {
                console.error('Error fetching resource cards:', error);
                setErrorMessage('Failed to load resource cards. Please try again later.');
            }
        };

        fetchCards();
    }, []);

    // Skapa ett nytt Resource Card
    const handleCreateCard = async () => {
        try {
            const formattedCard = {
                ...newCard,
                from: new Date(newCard.from).toISOString(),
                to: new Date(newCard.to).toISOString(),
            };

            console.log('Creating card:', formattedCard); // Debug-logg
            const response = await createResourceCard(formattedCard);
            console.log('Card created:', response.data); // Debug-logg

            setCards([...cards, response.data]); // Uppdatera state
            setNewCard({ title: '', description: '', from: '', to: '' }); // Återställ formuläret
        } catch (error) {
            console.error('Error creating resource card:', error);
            setErrorMessage('Failed to create resource card. Please check your input and try again.');
        }
    };

    // Uppdatera ett Resource Card
    const handleUpdateCard = async (id) => {
        try {
            const cardToUpdate = cards.find((card) => card.id === id);
            if (!cardToUpdate) {
                console.error('Card not found for update');
                return;
            }

            const updatedCard = { ...cardToUpdate, title: 'Updated Title' }; // Exempel
            console.log('Updating card:', updatedCard); // Debug-logg

            const response = await updateResourceCard(id, updatedCard);
            console.log('Card updated:', response.data); // Debug-logg

            setCards(cards.map((card) => (card.id === id ? response.data : card)));
        } catch (error) {
            console.error('Error updating resource card:', error);
            setErrorMessage('Failed to update resource card. Please try again.');
        }
    };

    // Ta bort ett Resource Card
    const handleDeleteCard = async (id) => {
        try {
            console.log('Deleting card with ID:', id); // Debug-logg
            await deleteResourceCard(id);
            setCards(cards.filter((card) => card.id !== id));
        } catch (error) {
            console.error('Error deleting resource card:', error);
            setErrorMessage('Failed to delete resource card. Please try again.');
        }
    };

    return (
        <div>
            <h1>Resource Cards</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Visa felmeddelande */}
            
            <div>
                <input
                    type="text"
                    placeholder="Title"
                    value={newCard.title}
                    onChange={(e) => setNewCard({ ...newCard, title: e.target.value })}
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={newCard.description}
                    onChange={(e) => setNewCard({ ...newCard, description: e.target.value })}
                />
                <input
                    type="date"
                    value={newCard.from}
                    onChange={(e) => setNewCard({ ...newCard, from: e.target.value })}
                />
                <input
                    type="date"
                    value={newCard.to}
                    onChange={(e) => setNewCard({ ...newCard, to: e.target.value })}
                />
                <button onClick={handleCreateCard}>Add Card</button>
            </div>

            <ul>
                {cards.map((card) => (
                    <li key={card.id}>
                        <h2>{card.title}</h2>
                        <p>{card.description}</p>
                        <p>From: {new Date(card.from).toLocaleDateString()}</p>
                        <p>To: {new Date(card.to).toLocaleDateString()}</p>
                        <button onClick={() => handleUpdateCard(card.id)}>Update</button>
                        <button onClick={() => handleDeleteCard(card.id)}>Delete</button>
                    </li>
                ))}
            </ul>

            {/* Kalender för att visa resource cards */}
            <h2>Calendar View</h2>
            <Calendar
                events={cards.map((card) => ({
                    title: card.title,
                    start: new Date(card.from),
                    end: new Date(card.to),
                }))}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: '50px 0' }}
            />
        </div>
    );
};

export default ResourceCards;
