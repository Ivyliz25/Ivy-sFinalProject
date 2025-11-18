import React from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Header />
      <main style={{ minHeight: '80vh', padding: '20px' }}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
