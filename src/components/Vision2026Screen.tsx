'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import dataPack from '@/data/leaders-2025.json';

const visionBullets = dataPack.vision_2026.bullets;
const targets = dataPack.vision_2026.targets;
const scenarios = dataPack.vision_2026.growth_scenarios;

export function Vision2026Screen() {
  const { setScene } = useAppStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTargets, setShowTargets] = useState(false);
  const [showScenarios, setShowScenarios] = useState(false);

  const totalBullets = visionBullets.length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (currentStep < totalBullets - 1) {
          setCurrentStep(prev => prev + 1);
        } else if (!showTargets) {
          setShowTargets(true);
        } else if (!showScenarios) {
          setShowScenarios(true);
        }
      } else if (e.key === 'ArrowLeft') {
        if (showScenarios) {
          setShowScenarios(false);
        } else if (showTargets) {
          setShowTargets(false);
        } else if (currentStep > 0) {
          setCurrentStep(prev => prev - 1);
        }
      } else if (e.key === 'Escape') {
        setScene('chat');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStep, showTargets, showScenarios, totalBullets, setScene]);

  return (
    <div className="min-h-screen bg-deep-black flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-8 py-4 flex items-center justify-between z-10">
        <button 
          onClick={() => setScene('chat')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>חזרה לצאט</span>
        </button>
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="LEADERS" className="h-6 w-auto" />
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 pb-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-black text-gold-main mb-4">Welcome 2026</h1>
          <p className="text-xl text-gray-400">LEADERS - הדור הבא</p>
        </motion.div>

        {/* Bullets Section */}
        {!showTargets && !showScenarios && (
          <div className="w-full max-w-4xl">
            <AnimatePresence mode="wait">
              {visionBullets.slice(0, currentStep + 1).map((bullet, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 12 }}
                  className={`flex items-start gap-4 mb-6 ${
                    index === currentStep ? 'opacity-100' : 'opacity-50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gold-main flex items-center justify-center shrink-0">
                    <span className="text-near-black font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1 bg-gray-900 rounded-xl p-5 border-r-4 border-gold-main">
                    <p className="text-xl text-white leading-relaxed">{bullet}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Progress */}
            <div className="flex justify-center gap-2 mt-8">
              {visionBullets.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-gold-main' : 'bg-gray-700'
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Targets Section */}
        {showTargets && !showScenarios && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full max-w-5xl"
          >
            <h2 className="text-3xl font-bold text-gold-main text-center mb-8">יעדים ל-2026</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {targets.map((target, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gold-main transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-main/20 flex items-center justify-center mb-4">
                    <span className="text-gold-main font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="text-lg text-white">{target}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Scenarios Section */}
        {showScenarios && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-5xl"
          >
            <h2 className="text-3xl font-bold text-gold-main text-center mb-8">תרחישי צמיחה</h2>
            <div className="grid grid-cols-2 gap-8">
              {/* Scenario 1 */}
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gray-900 rounded-xl p-8 border border-gray-700"
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{scenarios.scenario_1.name}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">עובדים</span>
                    <span className="text-white font-semibold">{scenarios.scenario_1.employees_growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">הכנסות</span>
                    <span className="text-white font-semibold">{scenarios.scenario_1.revenue_growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">מכפיל</span>
                    <span className="text-white font-semibold">{scenarios.scenario_1.multiplier}</span>
                  </div>
                  <p className="text-sm text-gray-500 pt-4 border-t border-gray-700">
                    {scenarios.scenario_1.notes}
                  </p>
                </div>
              </motion.div>

              {/* Scenario 2 */}
              <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-gold-main/20 to-gold-main/5 rounded-xl p-8 border-2 border-gold-main relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gold-main text-near-black px-4 py-1 rounded-full text-sm font-bold">
                    מומלץ
                  </span>
                </div>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-gold-main flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-near-black">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-gold-main">{scenarios.scenario_2.name}</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">עובדים</span>
                    <span className="text-gold-main font-semibold">{scenarios.scenario_2.employees_growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">הכנסות</span>
                    <span className="text-gold-main font-semibold">{scenarios.scenario_2.revenue_growth}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">מכפיל</span>
                    <span className="text-gold-main font-semibold">{scenarios.scenario_2.multiplier}</span>
                  </div>
                  <p className="text-sm text-gray-300 pt-4 border-t border-gold-main/30">
                    {scenarios.scenario_2.notes}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="px-8 py-4 text-center">
        <p className="text-gray-500 text-sm">
          לחץ על מקש הרווח או חץ ימינה להמשך | Escape לחזרה
        </p>
      </footer>
    </div>
  );
}
