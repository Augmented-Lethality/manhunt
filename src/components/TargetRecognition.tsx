import React, { useEffect, useState } from 'react';

type TargetRecognitionProps = {
  targettingCountdown: number | null;
}

const TargetRecognition: React.FC<TargetRecognitionProps> = ({ targettingCountdown }) => {
  const [fillPercentages, setFillPercentages] = useState([0, 0, 0, 0]);
  const [circleFillPercentage, setCircleFillPercentage] = useState(0);

  // Define the thresholds at which each bar will fill up
  const thresholds = [5, 10, 3, 7];

  const circleThreshold = 10;

  useEffect(() => {
    if (targettingCountdown !== null) {
      setFillPercentages(thresholds.map(threshold =>
        Math.min((targettingCountdown / threshold) * 100, 100)
      ));

      setCircleFillPercentage(Math.min((targettingCountdown / circleThreshold) * 100, 100));
    }
  }, [targettingCountdown]);

  const circleCircumference = 2 * Math.PI * 45;

  return (
    <div style={{ position: 'relative', width: '100px', height: '100px' }}>
      <svg width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="white"
          strokeWidth="2"
          fill="transparent"
          strokeDasharray={`${circleCircumference} ${circleCircumference}`}
          strokeDashoffset={circleCircumference - (circleFillPercentage / 100 * circleCircumference)}
        />
      </svg>

      {fillPercentages.map((percentage, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            bottom: '35px',
            left: `${25 + index * 15}px`, // Adjust positioning of bars
            width: '10px',
            height: '30px',
            background: `linear-gradient(to top, white ${percentage}%, black ${percentage}%)`,
            border: '1px solid white',
          }}
        />
      ))}
    </div>
  );
}

export default TargetRecognition;
