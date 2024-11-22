import React, { useState } from 'react';

const App = () => {
  const [categoryName, setCategoryName] = useState('');
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/createCategory/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName }),
      });

      if (response.status === 201) {
        setMessage('Bien posté');
        setMessageType('success');
        setTimeout(() => setMessage(null), 3000);
      } else if (response.status === 400) {
        setMessage('Erreur : la requête a échoué.');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage('Erreur inattendue.');
        setMessageType('error');
        setTimeout(() => setMessage(null), 3000);
      }
    } catch (error) {
      setMessage('Une erreur est survenue.');
      setMessageType('error');
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Nom de la catégorie"
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleSubmit} style={styles.button}>
        Submit
      </button>
      {message && (
        <div
          style={
            messageType === 'success'
              ? styles.successMessage
              : styles.errorMessage
          }
        >
          {message}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
    position: 'relative',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    marginBottom: '10px',
    width: '300px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  successMessage: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'fadeInOut 3s ease',
  },
  errorMessage: {
    position: 'fixed',
    bottom: '20px',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#dc3545',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '4px',
    fontSize: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    animation: 'fadeInOut 3s ease',
  },
};

export default App;

