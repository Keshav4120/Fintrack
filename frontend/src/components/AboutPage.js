import React, { useState, useEffect } from 'react';
import './About.css';
import staticImage from '../assets/fintrack.png';
import usStocksImage from '../assets/us.jpg';
import indianStocksImage from '../assets/ind1.png';
import bondsImage from '../assets/bonds.png';
import fdsImage from '../assets/fd.jpg';
import loansImage from '../assets/loans.jpg';
import FinTrackImage from '../assets/FinTrackApp.png';

const AboutPage = () => {
  const [currentImage, setCurrentImage] = useState(staticImage);

  const images = [
    staticImage,
    FinTrackImage
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollableDiv = document.querySelector('.scroll-content');
      const scrollHeight = scrollableDiv.scrollHeight - scrollableDiv.clientHeight;
      const scrollTop = scrollableDiv.scrollTop;

      const scrollFraction = scrollTop / scrollHeight;

      if (scrollFraction < 0.4) {
        setCurrentImage(images[0]);
      } else if (scrollFraction < 1.5) {
        setCurrentImage(images[1]);
      }
    };

    const scrollableDiv = document.querySelector('.scroll-content');
    scrollableDiv.addEventListener('scroll', handleScroll);

    return () => {
      scrollableDiv.removeEventListener('scroll', handleScroll);
    };
  }, [images]);

  useEffect(() => {
    const sections = document.querySelectorAll('.feature-section');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
          } else {
            entry.target.classList.remove('fade-in');
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="about-us-container">
      <div className="static-image">
        <img src={currentImage} alt="Dynamic Display" className="transition-image" />
      </div>
      <div className="scroll-content">
        <h1>About Us.</h1>
        <p>FinTrack is your one-stop solution for managing investments and finances. Track your US and Indian stocks, purchase FDs and bonds, and access loans with ease.</p>
        <p>With a commitment to excellence, FinTrack simplifies financial management, ensuring a user-friendly experience for all your financial needs.</p>
        <p>At FinTrack, our goal is to empower you with tools to make informed financial decisions and achieve your investment objectives efficiently.</p>

        <section className="feature-section">
          <h2>Track US Stocks</h2>
          <img src={usStocksImage} alt="US Stocks" />
          <p>Stay updated with real-time tracking of US stocks. Make informed decisions based on live market data and trends to maximize your investments.</p>
        </section>

        <section className="feature-section">
          <h2>Track Indian Stocks</h2>
          <img src={indianStocksImage} alt="Indian Stocks" />
          <p>Monitor the Indian stock market seamlessly. Get detailed insights and analytics to stay ahead in the dynamic financial landscape.</p>
        </section>

        <section className="feature-section">
          <h2>Buy Bonds</h2>
          <img src={bondsImage} alt="Bonds" />
          <p>Invest in a variety of bonds tailored to meet your financial goals. Secure stable returns with trusted bond options.</p>
        </section>

        <section className="feature-section">
          <h2>Buy Fixed Deposits</h2>
          <img src={fdsImage} alt="Fixed Deposits" />
          <p>Explore high-interest fixed deposit schemes. Ensure the safety of your capital while enjoying guaranteed returns.</p>
        </section>

        <section className="feature-section">
          <h2>Get Loans</h2>
          <img src={loansImage} alt="Loans" />
          <p>Access hassle-free loans with competitive interest rates. Fulfill your financial needs with our easy and transparent loan process.</p>
        </section>

        <div className="signup-button-container">
          <a href="/signup" className="signup-button">Sign Up</a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;