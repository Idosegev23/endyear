'use client';

import { motion } from 'framer-motion';

interface Scenario {
  name: string;
  employees_growth: string;
  revenue_growth: string;
  multiplier: string;
  notes: string;
}

interface ComparisonTableProps {
  title?: string;
  scenario_1: Scenario;
  scenario_2: Scenario;
}

export function ComparisonTable({ title, scenario_1, scenario_2 }: ComparisonTableProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-deep-black rounded-2xl overflow-hidden p-6"
    >
      {title && (
        <h3 className="text-2xl font-bold text-gold-main text-center mb-8">{title}</h3>
      )}
      
      <div className="grid grid-cols-2 gap-6">
        {/* Scenario 1 */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gray-900 rounded-xl p-6 border border-gray-700"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-white">1</span>
            </div>
            <h4 className="text-lg font-bold text-white">{scenario_1.name}</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">עובדים</span>
              <span className="text-white font-semibold">{scenario_1.employees_growth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">הכנסות</span>
              <span className="text-white font-semibold">{scenario_1.revenue_growth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">מכפיל</span>
              <span className="text-white font-semibold">{scenario_1.multiplier}</span>
            </div>
            <div className="pt-4 border-t border-gray-700">
              <p className="text-sm text-gray-400">{scenario_1.notes}</p>
            </div>
          </div>
        </motion.div>

        {/* Scenario 2 - Highlighted */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-gold-main/20 to-gold-main/5 rounded-xl p-6 border-2 border-gold-main relative"
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span className="bg-gold-main text-near-black px-3 py-1 rounded-full text-xs font-bold">
              מומלץ
            </span>
          </div>
          
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-main flex items-center justify-center mx-auto mb-3">
              <span className="text-xl font-bold text-near-black">2</span>
            </div>
            <h4 className="text-lg font-bold text-gold-main">{scenario_2.name}</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">עובדים</span>
              <span className="text-gold-main font-semibold">{scenario_2.employees_growth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">הכנסות</span>
              <span className="text-gold-main font-semibold">{scenario_2.revenue_growth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">מכפיל</span>
              <span className="text-gold-main font-semibold">{scenario_2.multiplier}</span>
            </div>
            <div className="pt-4 border-t border-gold-main/30">
              <p className="text-sm text-gray-300">{scenario_2.notes}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}



