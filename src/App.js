import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchCategory, setSearchCategory] = useState('');
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [productsByCategory, setProductsByCategory] = useState({});

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('https://api-ekart.netlify.app/api/getCategory');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.category);
          fetchProducts(data.category);
        } else {
          console.error("Erreur lors de la récupération des catégories.");
        }
      } catch (error) {
        console.error("Erreur de réseau :", error);
      }
    };
    fetchCategories();
  }, []);
  
  const fetchProducts = async (categories) => {
    const allProducts = {};
    for (const cat of categories) {
      try {
        const response = await fetch(`https://api-ekart.netlify.app/api/getProduct/${encodeURIComponent(cat)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          allProducts[cat] = data.products.map(product => product.title);
        } else {
          console.error(`Erreur API pour la catégorie ${cat}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Erreur de réseau pour la catégorie ${cat} :`, error);
      }
    }
    setProductsByCategory(allProducts);
  };

  const handleFileChange = (e) => {
    const selectedFiles = e.target.files;
    setFiles(selectedFiles);

    const newPreviews = Array.from(selectedFiles).map((file) => {
      return URL.createObjectURL(file);
    });
    setPreviews(newPreviews);
  };

  const handleRemovePreview = (indexToRemove) => {
    setPreviews(previews.filter((_, index) => index !== indexToRemove));

    const newFiles = Array.from(files).filter((_, index) => index !== indexToRemove);
    setFiles(newFiles.length > 0 ? newFiles : null);
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
      const response = await fetch('https://api-ekart.netlify.app/api/createProduct', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Produit créé avec succès');
        setMessageType('success');
        console.log(result);
        setPreviews([]);
        setTitle("");
        setCategory("");
        setFiles("");
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
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button className="btn btn-link nav-link">E-Kart</button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <button className="btn btn-link nav-link">Accueil</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link">Produit</button>
              </li>
              <li className="nav-item">
                <button className="btn btn-link nav-link">Contact</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <h2 className="text-center mb-4">Créer un produit</h2>
        <form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">Nom du produit</label>
            <input
              type="text"
              className="form-control"
              id="title"
              placeholder="Titre"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="category" className="form-label">Nom de la catégorie</label>
            <input
              list="categories"
              className="form-control"
              id="category"
              placeholder="Catégorie"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="categories">
              {categories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>
          <div className="mb-3">
            <label htmlFor="file" className="form-label">Images du produit</label>
            <input
              type="file"
              className="form-control"
              id="file"
              multiple
              onChange={handleFileChange}
            />
          </div>
          <div className="mb-3 d-flex flex-wrap gap-3">
          {previews.map((src, index) => (
              <div
                key={index}
                className="position-relative"
                style={{ display: 'inline-block', width: '100px', height: '100px' }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  src={src}
                  alt={`preview-${index}`}
                  className="img-thumbnail"
                  style={{ width: '100px', height: '100px' }}
                />
                <div
                  className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    opacity: hoveredIndex === index ? 1 : 0,
                    transition: 'opacity 0.3s',
                    cursor: 'pointer',
                  }}
                  onClick={() => handleRemovePreview(index)}
                >
                  <i className="bi bi-file-earmark-x text-danger fs-4"></i>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary w-100">Créer le Produit</button>
        </form>
        {message && (
          <div className={`mt-3 alert ${messageType === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
            {message}
          </div>
        )}
      </div>
      <div className="container mt-5">
        <h2 className="text-center mb-4">Produits Existant</h2>
        <div className="mb-4">
          <input
            list="categories"
            className="form-control"
            placeholder="Rechercher une catégorie"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
          <datalist id="categories">
            {categories.map((cat, index) => (
              <option key={index} value={cat} />
            ))}
          </datalist>
        </div>

        {Object.keys(productsByCategory).length === 0 ? (
          <p className="text-center">Aucun produit disponible.</p>
        ) : (
          Object.keys(productsByCategory)
            .filter((cat) => !searchCategory || cat.toLowerCase().includes(searchCategory.toLowerCase()))
            .map((cat) => (
              <div key={cat} className="mb-4">
                <h3>{cat}</h3>
                <ul>
                  {productsByCategory[cat].map((title, index) => (
                    <li key={index}>{title}</li>
                  ))}
                </ul>
              </div>
            ))
        )}
      </div>
      </div>
  );
};

export default App;