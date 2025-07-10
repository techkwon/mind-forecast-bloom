interface MoodGaugeProps {
  score: number;
}

export function MoodGauge({ score }: MoodGaugeProps) {
  const getColorFromScore = (score: number) => {
    if (score >= 80) return 'hsl(var(--sunny))';
    if (score >= 60) return 'hsl(var(--partly-cloudy))';
    if (score >= 40) return 'hsl(var(--cloudy))';
    return 'hsl(var(--rainy))';
  };

  const radius = 90;
  const strokeWidth = 12;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative w-48 h-48 flex items-center justify-center">
      {/* 배경 원 */}
      <svg
        height={radius * 2}
        width={radius * 2}
        className="transform -rotate-90"
      >
        <circle
          stroke="hsl(var(--muted))"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="opacity-20"
        />
        <circle
          stroke={getColorFromScore(score)}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          className="transition-all duration-1000 ease-out drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${getColorFromScore(score)}40)`
          }}
        />
      </svg>
      
      {/* 중앙 점수 */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-3xl font-bold text-primary">
          {score}
        </div>
        <div className="text-sm text-muted-foreground">
          점
        </div>
      </div>
    </div>
  );
}