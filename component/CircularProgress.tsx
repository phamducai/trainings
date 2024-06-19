import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

interface CircularProgressProps {
  value: number;
}

const CircularProgress: React.FC<CircularProgressProps> = ({ value }) => {
  return (
    <div className="flex justify-center items-center w-16 h-16">
      <CircularProgressbar
        value={value}
        text={`${value}%`}
        styles={buildStyles({
          textSize: '16px',
          pathColor: `rgba(62, 152, 199, ${value / 100})`,
          textColor: '#3e98c7',
          trailColor: '#d6d6d6',
          backgroundColor: '#3e98c7',
            })}
      />
    </div>
  );
};

export default CircularProgress;
