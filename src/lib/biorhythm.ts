// 바이오리듬 계산 라이브러리

export interface BiorhythmData {
  physical: number;
  emotional: number;
  intellectual: number;
}

/**
 * 바이오리듬 계산 함수
 * @param birthDate 생년월일 (YYYY-MM-DD 형식)
 * @param targetDate 계산할 날짜 (기본값: 오늘)
 * @returns 바이오리듬 데이터 (0-100% 범위)
 */
export function calculateBiorhythm(birthDate: string, targetDate: Date = new Date()): BiorhythmData {
  const birth = new Date(birthDate);
  const today = new Date(targetDate);
  
  // 태어난 날부터 오늘까지의 일수 계산
  const diffTime = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  // 바이오리듬 주기
  const PHYSICAL_CYCLE = 23;    // 신체 리듬
  const EMOTIONAL_CYCLE = 28;   // 감정 리듬  
  const INTELLECTUAL_CYCLE = 33; // 지적 리듬

  // 각 리듬 계산 (사인파, -1 ~ 1 범위를 0 ~ 100%로 변환)
  const physical = Math.sin((2 * Math.PI * diffDays) / PHYSICAL_CYCLE);
  const emotional = Math.sin((2 * Math.PI * diffDays) / EMOTIONAL_CYCLE);
  const intellectual = Math.sin((2 * Math.PI * diffDays) / INTELLECTUAL_CYCLE);

  return {
    physical: Math.round(((physical + 1) / 2) * 100),
    emotional: Math.round(((emotional + 1) / 2) * 100),
    intellectual: Math.round(((intellectual + 1) / 2) * 100),
  };
}

/**
 * 바이오리듬 평균값 계산
 */
export function calculateOverallBiorhythm(biorhythm: BiorhythmData): number {
  return Math.round((biorhythm.physical + biorhythm.emotional + biorhythm.intellectual) / 3);
}

/**
 * 바이오리듬 상태 해석
 */
export function interpretBiorhythmLevel(value: number): {
  level: 'low' | 'medium' | 'high';
  description: string;
  color: string;
} {
  if (value >= 70) {
    return {
      level: 'high',
      description: '최고조',
      color: 'hsl(var(--sunny))'
    };
  } else if (value >= 40) {
    return {
      level: 'medium', 
      description: '안정적',
      color: 'hsl(var(--partly-cloudy))'
    };
  } else {
    return {
      level: 'low',
      description: '회복기',
      color: 'hsl(var(--cloudy))'
    };
  }
}

/**
 * 7일간 바이오리듬 데이터 생성 (차트용)
 */
export function generateWeeklyBiorhythm(birthDate: string): Array<BiorhythmData & { date: string }> {
  const result = [];
  const today = new Date();
  
  for (let i = -3; i <= 3; i++) {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + i);
    
    const biorhythm = calculateBiorhythm(birthDate, targetDate);
    result.push({
      ...biorhythm,
      date: targetDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    });
  }
  
  return result;
}