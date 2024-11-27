import React, { useState, useEffect } from 'react';

const App = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/getCategory');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.category);
        } else {
          console.error("Erreur lors de la récupération des catégories.");
        }
      } catch (error) {
        console.error("Erreur de réseau :", error);
      }
    };
    fetchCategories();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    const newPreviews = Array.from(selectedFiles).map((file) => {
      return URL.createObjectURL(file);
    });
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    if (files) {
      for (let i = 0; i < files.length; i++) {
        formData.append('image', files[i]);
      }
    }

    try {
      const response = await fetch('http://localhost:3000/api/create_product', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Produit créé avec succès');
        setMessageType('success');
        console.log(result);
        setPreviews([]);
      } else {
        setMessage('Erreur lors de la création du produit');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Une erreur est survenue');
      setMessageType('error');
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Titre"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <input
          list="categories"
          placeholder="Catégorie"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={styles.input}
        />
        <datalist id="categories">
          {categories.map((cat, index) => (
            <option key={index} value={cat} />
          ))}
        </datalist>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          style={styles.input}
        />
        <div style={styles.previewContainer}>
          {previews.map((src, index) => (
            <img key={index} src={src} alt={`preview-${index}`} style={styles.previewImage} />
          ))}
        </div>
        <button type="submit" style={styles.button}>
          Soumettre
        </button>
      </form>
      {message && (
        <div
          style={
            messageType === 'success' ? styles.successMessage : styles.errorMessage
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
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '300px',
  },
  input: {
    marginBottom: '10px',
    padding: '10px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  previewContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginBottom: '10px',
  },
  previewImage: {
    width: '100px',
    height: '100px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  successMessage: {
    marginTop: '20px',
    color: 'green',
  },
  errorMessage: {
    marginTop: '20px',
    color: 'red',
  },
};

export default App;
