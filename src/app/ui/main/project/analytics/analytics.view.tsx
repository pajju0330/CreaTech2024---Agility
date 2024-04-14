import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Chart from 'chart.js/auto'
export const AnalyticsView = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  let chartInstance: Chart | null = null;

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy();
      }
      
      // Create new chart instance
      chartInstance = new Chart(chartRef.current.getContext('2d')!, {
        type: 'line',
        data: {
          labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
          datasets: [
            {
              label: 'Sprints per Month',
              data: [12, 19, 3, 5, 2, 3, 7, 8, 9, 10, 11, 12],
              fill: false,
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1,
            },
          ],
        },
      });
    }

    // Clean up function to destroy chart instance when component unmounts
    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []); // Empty dependency array ensures this effect runs only once on mount

  return <canvas ref={chartRef} style={{ width: '10 0px', height: '100px' }} />;
};
