import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../utils/auth';
import Sidebar from '../components/Sidebar';
import ProfileContent from '../components/ProfileContent';
import SimpleChatbot from '../components/SimpleChatbot';
import { motion } from 'framer-motion';
import './ProfileHome.css';

const ProfileHome = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = getLoggedInUser();
    if (!currentUser) {
      navigate('/');
    } else {
      setUser(currentUser);
    }
  }, [navigate]);

  return (
    <motion.div
      className="d-flex profile-container"
      style={{ height: '100vh' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Sidebar />
      <div className="flex-grow-1 bg-light overflow-auto">
        {user && <ProfileContent user={user} />}
        <SimpleChatbot />
      </div>
    </motion.div>
  );
};

export default ProfileHome;
