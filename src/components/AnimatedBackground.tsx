/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';

interface AnimatedBackgroundProps {
  isDarkMode: boolean;
}

export default function AnimatedBackground({ isDarkMode }: AnimatedBackgroundProps) {
  return (
    <div id="animated-bg" className="fixed inset-0 -z-50 overflow-hidden pointer-events-none select-none transition-colors duration-1000">
      {/* Base theme color */}
      <div className={`absolute inset-0 transition-colors duration-1000 ${isDarkMode ? 'bg-[#020617]' : 'bg-[#f8fafc]'}`} />

      {/* Decorative background grid pattern */}
      <div 
        className={`absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]`}
      />

      {/* Dynamic colorful blur spheres */}
      <motion.div
        animate={{
          x: [0, 40, -20, 0],
          y: [0, -50, 30, 0],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{
          duration: 35,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
        className={`absolute top-[10%] left-[5%] w-[40vw] h-[40vw] max-w-[500px] rounded-full blur-[100px] transition-all duration-1000 ${
          isDarkMode 
            ? 'opacity-35 mix-blend-screen bg-[#1d4ed8]' 
            : 'opacity-15 mix-blend-multiply bg-[#3b82f6]'
        }`}
      />

      <motion.div
        animate={{
          x: [0, -60, 40, 0],
          y: [0, 30, -40, 0],
          scale: [1, 0.85, 1.1, 1],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
        className={`absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] max-w-[600px] rounded-full blur-[120px] transition-all duration-1000 ${
          isDarkMode 
            ? 'opacity-35 mix-blend-screen bg-[#701a75]' 
            : 'opacity-15 mix-blend-multiply bg-[#ec4899]'
        }`}
      />

      <motion.div
        animate={{
          x: [0, 30, -30, 0],
          y: [0, 40, -50, 0],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ willChange: 'transform' }}
        className={`absolute top-[40%] left-[40%] w-[35vw] h-[35vw] max-w-[450px] rounded-full blur-[110px] transition-all duration-1000 ${
          isDarkMode 
            ? 'opacity-20 mix-blend-screen bg-[#047857]' 
            : 'opacity-10 mix-blend-multiply bg-[#10b981]'
        }`}
      />
    </div>
  );
}
