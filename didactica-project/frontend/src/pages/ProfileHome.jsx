import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLoggedInUser } from '../utils/auth';
import ProfileContent from '../components/ProfileContent';
import SimpleChatbot from '../components/SimpleChatbot';
import { motion } from 'framer-motion';
import './ProfileHome.css';
import TestComponent from "../components/TestComponent";

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
      className="profile-page-wrapper"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-grow-1 bg-light overflow-auto">
        {user && <ProfileContent user={user} />}
        <SimpleChatbot />
        <TestComponent />
      </div>
    </motion.div>
  );
};

export default ProfileHome;
