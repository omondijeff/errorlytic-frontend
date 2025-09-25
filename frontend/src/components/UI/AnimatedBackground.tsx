import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  variant?: 'mesh' | 'aurora' | 'particles' | 'blobs' | 'gradient';
  intensity?: 'subtle' | 'medium' | 'strong';
  className?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  variant = 'mesh', 
  intensity = 'medium',
  className = ''
}) => {
  const getIntensityClasses = () => {
    switch (intensity) {
      case 'subtle':
        return 'opacity-20';
      case 'medium':
        return 'opacity-40';
      case 'strong':
        return 'opacity-60';
      default:
        return 'opacity-40';
    }
  };

  const renderMeshBackground = () => (
    <div className={`absolute inset-0 overflow-hidden ${getIntensityClasses()}`}>
      <motion.div
        className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-tajilabs-primary/30 to-tajilabs-secondary/30 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-tajilabs-secondary/20 to-tajilabs-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-tajilabs-primary/15 to-tajilabs-secondary/15 rounded-full blur-2xl"
        animate={{
          x: [-50, 50, -50],
          y: [-30, 30, -30],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
      />
    </div>
  );

  const renderAuroraBackground = () => (
    <div className={`absolute inset-0 overflow-hidden ${getIntensityClasses()}`}>
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-tajilabs-primary/20 via-tajilabs-secondary/10 to-transparent"
        animate={{
          background: [
            'linear-gradient(45deg, rgba(224, 84, 38, 0.2), rgba(255, 171, 136, 0.1))',
            'linear-gradient(135deg, rgba(255, 171, 136, 0.2), rgba(224, 84, 38, 0.1))',
            'linear-gradient(225deg, rgba(224, 84, 38, 0.2), rgba(255, 171, 136, 0.1))',
            'linear-gradient(315deg, rgba(255, 171, 136, 0.2), rgba(224, 84, 38, 0.1))',
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );

  const renderParticleBackground = () => (
    <div className={`absolute inset-0 overflow-hidden ${getIntensityClasses()}`}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-tajilabs-primary/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            scale: [1, 1.5, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 5,
          }}
        />
      ))}
    </div>
  );

  const renderBlobBackground = () => (
    <div className={`absolute inset-0 overflow-hidden ${getIntensityClasses()}`}>
      <motion.div
        className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-r from-tajilabs-primary/20 to-tajilabs-secondary/20"
        animate={{
          borderRadius: [
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%"
          ],
          rotate: [0, 180, 360],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-l from-tajilabs-secondary/15 to-tajilabs-primary/15"
        animate={{
          borderRadius: [
            "30% 60% 70% 40% / 50% 60% 30% 60%",
            "60% 40% 30% 70% / 60% 30% 70% 40%",
            "30% 60% 70% 40% / 50% 60% 30% 60%"
          ],
          rotate: [0, -180, -360],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3
        }}
      />
    </div>
  );

  const renderGradientBackground = () => (
    <div className={`absolute inset-0 overflow-hidden ${getIntensityClasses()}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-tajilabs-primary/10 via-tajilabs-secondary/5 to-transparent"
        animate={{
          background: [
            "linear-gradient(45deg, rgba(224, 84, 38, 0.1), rgba(255, 171, 136, 0.05), transparent)",
            "linear-gradient(135deg, rgba(255, 171, 136, 0.1), rgba(224, 84, 38, 0.05), transparent)",
            "linear-gradient(225deg, rgba(224, 84, 38, 0.1), rgba(255, 171, 136, 0.05), transparent)",
            "linear-gradient(315deg, rgba(255, 171, 136, 0.1), rgba(224, 84, 38, 0.05), transparent)",
          ]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );

  const renderBackground = () => {
    switch (variant) {
      case 'mesh':
        return renderMeshBackground();
      case 'aurora':
        return renderAuroraBackground();
      case 'particles':
        return renderParticleBackground();
      case 'blobs':
        return renderBlobBackground();
      case 'gradient':
        return renderGradientBackground();
      default:
        return renderMeshBackground();
    }
  };

  return (
    <div className={`fixed inset-0 -z-10 ${className}`}>
      {renderBackground()}
    </div>
  );
};

export default AnimatedBackground;
