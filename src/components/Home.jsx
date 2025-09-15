import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="home">
      <h2>Home</h2>
      <p>Welcome, {user?.name || 'User'}!</p>
    </div>
  );
};

export default Home;


