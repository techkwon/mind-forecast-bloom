import { useEffect, useState } from 'react';

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  animationDuration: number;
  delay: number;
}

export function FloatingHearts() {
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);

  useEffect(() => {
    // 화면에 떠다닐 하트들 생성
    const heartCount = 15;
    const newHearts: FloatingHeart[] = [];

    for (let i = 0; i < heartCount; i++) {
      newHearts.push({
        id: i,
        x: Math.random() * 100, // 0-100% 위치
        y: Math.random() * 100,
        size: Math.random() * 20 + 15, // 15-35px 크기
        animationDuration: Math.random() * 10 + 15, // 15-25초 지속
        delay: Math.random() * 20, // 0-20초 딜레이
      });
    }

    setHearts(newHearts);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute heart-float opacity-30"
          style={{
            left: `${heart.x}%`,
            top: `${heart.y}%`,
            fontSize: `${heart.size}px`,
            animationDuration: `${heart.animationDuration}s`,
            animationDelay: `${heart.delay}s`,
            color: 'hsl(330, 81%, 60%)',
          }}
        >
          💖
        </div>
      ))}
    </div>
  );
}