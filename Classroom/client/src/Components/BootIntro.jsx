// src/Components/BootIntro.jsx
import React from 'react';
import { motion } from 'framer-motion';

const BootIntro = ({ onComplete }) => {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white overflow-hidden" // Increased z-index to 100
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 1, delay: 4 }}
      onAnimationComplete={() => {
        document.body.style.overflow = 'auto';
        onComplete();
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: [0, 1, 1, 0],
          scale: [0.8, 1, 1, 0.8],
        }}
        transition={{
          duration: 4,
          times: [0, 0.2, 0.8, 1],
          ease: 'easeInOut',
        }}
        className="relative text-center"
      >
        <motion.span
          className="text-5xl md:text-7xl font-bold text-gray-900 relative z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Welcome
        </motion.span>

        {/* Enhanced Glow Effects */}
        <div className="absolute inset-0 -z-10">
          <motion.div
            className="absolute inset-0 bg-blue-300 rounded-full blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <motion.div
            className="absolute inset-0 bg-blue-200 rounded-full blur-2xl"
            animate={{
              scale: [0.8, 1.1, 0.8],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute inset-0 bg-purple-200 rounded-full blur-3xl opacity-10"
            animate={{
              scale: [1.2, 1.5, 1.2],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          />
          <motion.div
            className="absolute inset-0 bg-gray-100 rounded-full blur-3xl opacity-10"
            animate={{
              scale: [0.9, 1.2, 0.9],
              opacity: [0.1, 0.15, 0.1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-75" />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BootIntro;