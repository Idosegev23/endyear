'use client';

import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';

interface ChartDataPoint {
  name: string;
  value: number;
}

interface MiniChartProps {
  data: ChartDataPoint[];
  title: string;
  color?: string;
  valueLabel?: string;
  chartType?: 'bar' | 'pie' | 'line';
}

export function MiniChart({ 
  data, 
  title, 
  color = '#DDB258',
  valueLabel,
  chartType = 'bar'
}: MiniChartProps) {
  const maxValue = Math.max(...data.map(d => d.value));

  const getOption = () => {
    if (chartType === 'pie') {
      return {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: { color: '#333' }
        },
        series: [{
          type: 'pie',
          radius: ['45%', '75%'],
          center: ['50%', '50%'],
          avoidLabelOverlap: true,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 3
          },
          label: {
            show: true,
            formatter: '{b}',
            fontSize: 12
          },
          labelLine: { show: true, length: 10, length2: 15 },
          emphasis: {
            itemStyle: {
              shadowBlur: 20,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.3)'
            },
            scale: true,
            scaleSize: 10
          },
          data: data.map((item, index) => ({
            name: item.name,
            value: item.value,
            itemStyle: {
              color: index === 0 ? color : 
                index === 1 ? '#175933' : 
                index === 2 ? '#AB8492' : 
                `${color}${Math.max(30, 80 - index * 15).toString(16)}`
            }
          }))
        }]
      };
    }

    if (chartType === 'line') {
      return {
        grid: { top: 40, right: 30, bottom: 40, left: 60 },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255,255,255,0.95)',
          borderColor: '#eee',
          borderWidth: 1,
          textStyle: { color: '#333' }
        },
        xAxis: {
          type: 'category',
          data: data.map(d => d.name),
          axisLine: { lineStyle: { color: '#ddd' } },
          axisLabel: { color: '#666', fontSize: 12 }
        },
        yAxis: {
          type: 'value',
          axisLine: { show: false },
          axisLabel: { color: '#666', fontSize: 12 },
          splitLine: { lineStyle: { color: '#f0f0f0' } }
        },
        series: [{
          data: data.map(d => d.value),
          type: 'line',
          smooth: true,
          symbol: 'circle',
          symbolSize: 10,
          lineStyle: { color, width: 4 },
          itemStyle: { color },
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
      };
    }

    // Default: Bar chart
    return {
      grid: { top: 30, right: 80, bottom: 30, left: 100 },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#eee',
        borderWidth: 1,
        textStyle: { color: '#333' },
        formatter: (params: Array<{name: string; value: number}>) => {
          const p = params[0];
          return `<strong>${p.name}</strong><br/>${valueLabel || 'ערך'}: ${p.value.toLocaleString('he-IL')}`;
        }
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisLabel: { show: false },
        splitLine: { show: false }
      },
      yAxis: {
        type: 'category',
        data: data.map(d => d.name),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { 
          color: '#333', 
          fontSize: 14, 
          fontWeight: 500,
          margin: 15
        }
      },
      series: [{
        type: 'bar',
        data: data.map((d, index) => ({
          value: d.value,
          itemStyle: {
            color: d.value === maxValue ? color : `${color}60`,
            borderRadius: [0, 8, 8, 0]
          }
        })),
        barWidth: 28,
        label: {
          show: true,
          position: 'right',
          formatter: (params: {value: number}) => params.value.toLocaleString('he-IL'),
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        },
        animationDuration: 1500,
        animationEasing: 'elasticOut'
      }]
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col p-8"
    >
      {/* Title - slides from left */}
      <motion.h3
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.5, ease: 'easeOut' }}
        className="text-2xl font-bold text-center mb-6"
      >
        {title}
      </motion.h3>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex-1 min-h-[300px]"
      >
        <ReactECharts 
          option={getOption()} 
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </motion.div>

      {/* Legend dots */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.4 }}
        className="flex justify-center gap-6 mt-4"
      >
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-md"
            style={{ backgroundColor: color }}
          />
          <span className="text-sm text-gray-600">הכי גבוה</span>
        </div>
        <div className="flex items-center gap-2">
          <div 
            className="w-4 h-4 rounded-md"
            style={{ backgroundColor: `${color}60` }}
          />
          <span className="text-sm text-gray-600">אחרים</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
