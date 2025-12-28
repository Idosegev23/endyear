'use client';

import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import ReactECharts from 'echarts-for-react';

interface KpiBigNumberProps {
  value: number | string;
  label: string;
  suffix?: string;
  prefix?: string;
  subtext?: string;
  color?: string;
  change?: number;
  sparklineData?: number[];
}

export function KpiBigNumber({ 
  value, 
  label, 
  suffix = '', 
  prefix = '',
  subtext,
  color = '#DDB258',
  change,
  sparklineData
}: KpiBigNumberProps) {
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  const isNumeric = !isNaN(numericValue);

  const sparklineOption = sparklineData ? {
    grid: { top: 0, right: 0, bottom: 0, left: 0 },
    xAxis: { type: 'category', show: false, data: sparklineData.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{
      data: sparklineData,
      type: 'line',
      smooth: true,
      symbol: 'none',
      lineStyle: { color, width: 3 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${color}40` },
            { offset: 1, color: `${color}05` }
          ]
        }
      }
    }]
  } : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="relative h-full flex flex-col items-center justify-center p-8 overflow-hidden"
    >
      {/* Animated background rings */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.2, 1], opacity: [0, 0.1, 0.05] }}
        transition={{ duration: 1.5, ease: 'easeOut' }}
        className="absolute w-[600px] h-[600px] rounded-full border-2"
        style={{ borderColor: color }}
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.3, 1], opacity: [0, 0.08, 0.03] }}
        transition={{ duration: 1.8, delay: 0.2, ease: 'easeOut' }}
        className="absolute w-[800px] h-[800px] rounded-full border"
        style={{ borderColor: color }}
      />

      {/* Glow effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="absolute w-64 h-64 rounded-full blur-3xl"
        style={{ backgroundColor: color }}
      />

      {/* Label - slides from top */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
        className="text-gray-500 text-xl mb-6 font-medium tracking-wide"
      >
        {label}
      </motion.div>

      {/* Big Number with CountUp */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8, type: 'spring', bounce: 0.3 }}
        className="relative z-10"
      >
        <span 
          className="text-8xl md:text-9xl lg:text-[10rem] font-black leading-none"
          style={{ color }}
        >
          {prefix}
          {isNumeric ? (
            <CountUp
              end={numericValue}
              duration={2.5}
              separator=","
              decimals={numericValue % 1 !== 0 ? 1 : 0}
            />
          ) : value}
          {suffix}
        </span>
      </motion.div>

      {/* Change indicator */}
      {change !== undefined && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className={`flex items-center gap-2 mt-4 px-4 py-2 rounded-full ${
            change >= 0 ? 'bg-green-accent/10 text-green-accent' : 'bg-gray-200 text-gray-600'
          }`}
        >
          <span className="text-lg font-bold">
            {change >= 0 ? '+' : ''}{change}%
          </span>
          <span className="text-sm">מ-2024</span>
        </motion.div>
      )}

      {/* Subtext */}
      {subtext && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-gray-600 text-xl mt-6 text-center max-w-md"
        >
          {subtext}
        </motion.div>
      )}

      {/* Sparkline */}
      {sparklineData && sparklineOption && (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="w-full max-w-md h-20 mt-8"
        >
          <ReactECharts 
            option={sparklineOption} 
            style={{ height: '100%', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </motion.div>
      )}

      {/* Decorative accent line */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: 100 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="h-1 mt-8 rounded-full"
        style={{ backgroundColor: color }}
      />
    </motion.div>
  );
}
