import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './Slider.css';

const images = [
  {
    src: 'https://passionateaboutfood.net/wp-content/uploads/2022/07/healthy-dairy-products-1536x1024.jpg',
    title: 'DAIRY DELIGHTS',
    topic: 'HEALTHY DAIRY',
    description:
      'Discover the goodness of fresh and healthy dairy products. Packed with essential nutrients, our dairy range ensures quality and taste in every bite. From creamy milk to delicious cheese, indulge in the best dairy has to offer! ',
  },
  {
    src: 'https://alighahary.ca/wp-content/uploads/2024/01/DASH-and-MIND-diets.png',
    title: 'GREEN GOODNESS',  
    topic: 'ORGANIC VEGETABLES',  
    description:  
      'Savor the freshness of nature with our organic vegetables. Handpicked for quality and taste, they are perfect for creating wholesome and nutritious meals. Bring home the goodness of farm-to-table produce today!',
  },
  {
    src: 'https://wallpapercave.com/wp/wp6557500.jpg',
    title: 'FRUITFUL HARVEST',
    topic: 'FRESH FRUITS',
    description:
      'Indulge in the sweet and refreshing taste of fresh fruits! Rich in vitamins and antioxidants, our fruits are perfect for a healthy snack or adding a burst of flavor to your dishes. Enjoy nature’s finest harvest every day!',
  },
  {
    src: 'https://www.privatetour.com/images/turkey/aydin/grand-bazaar-aydin-turkey.jpg',
    title: 'FLAVORS OF THE WORLD',
    topic: 'PREMIUM SPICES',
    description:
      'Transform ordinary meals into extraordinary feasts with our premium spices! Carefully sourced and packed with freshness, these spices add depth, color, and irresistible taste to your cooking. Unleash the chef in you!',
  },
];

function Slider() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleProductClick  = () => {
    console.log("Navigating to product"); 
    navigate("/product");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isTransitioning) {
        nextSlide();
      }
    }, 5000); 

    return () => clearInterval(interval);
  }, [isTransitioning]);

  const nextSlide = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handleTransitionEnd = () => {
    setIsTransitioning(false);
  };

  return (
    <div className={`slider-container ${isTransitioning ? 'next' : ''}`}>
      <div className="list">
        {images.map((image, index) => (
          <div
            key={index}
            className={`item ${index === currentIndex ? 'active' : ''}`}
            onTransitionEnd={handleTransitionEnd}
          >
            <img src={image.src} alt={image.title} />
            <div className="content">
              <div className="title" >{image.title}</div>
              <div className="topic">{image.topic}</div>
              <div className="des">{image.description}</div>
              <div className="buttons" >
                <button onClick={handleProductClick}>SEE MORE</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
