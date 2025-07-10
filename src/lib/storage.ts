// localStorage 관리 유틸리티

const STORAGE_KEYS = {
  BIRTH_DATE: 'mind-forecast-birth-date',
  USER_PREFERENCES: 'mind-forecast-preferences',
} as const;

export interface UserData {
  birthDate: string;
  savedAt: string;
}

export interface UserPreferences {
  notifications: boolean;
  theme: 'light' | 'dark' | 'auto';
}

/**
 * 생년월일 저장
 */
export function saveBirthDate(birthDate: string): void {
  const userData: UserData = {
    birthDate,
    savedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(STORAGE_KEYS.BIRTH_DATE, JSON.stringify(userData));
}

/**
 * 저장된 생년월일 가져오기
 */
export function getSavedBirthDate(): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.BIRTH_DATE);
    if (!stored) return null;
    
    const userData: UserData = JSON.parse(stored);
    return userData.birthDate;
  } catch (error) {
    console.error('Failed to get saved birth date:', error);
    return null;
  }
}

/**
 * 저장된 데이터 삭제
 */
export function clearSavedData(): void {
  localStorage.removeItem(STORAGE_KEYS.BIRTH_DATE);
  localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
}

/**
 * 사용자 설정 저장
 */
export function saveUserPreferences(preferences: UserPreferences): void {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
}

/**
 * 사용자 설정 가져오기
 */
export function getUserPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
    if (!stored) {
      return {
        notifications: true,
        theme: 'auto',
      };
    }
    
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to get user preferences:', error);
    return {
      notifications: true,
      theme: 'auto',
    };
  }
}

/**
 * 저장된 데이터가 있는지 확인
 */
export function hasSavedData(): boolean {
  return getSavedBirthDate() !== null;
}