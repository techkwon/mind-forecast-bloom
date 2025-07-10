import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { DateInputForm } from "@/components/DateInputForm";
import { ForecastReport, ForecastData } from "@/components/ForecastReport";
import { calculateBiorhythm } from "@/lib/biorhythm";
import { getSavedBirthDate, saveBirthDate, clearSavedData } from "@/lib/storage";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const { toast } = useToast();

  // 페이지 로드 시 저장된 데이터 확인
  useEffect(() => {
    const saved = getSavedBirthDate();
    if (saved) {
      setBirthDate(saved);
      generateForecast(saved);
    } else {
      setIsInitialLoading(false);
    }
  }, []);

  const generateForecast = async (birthDateStr: string) => {
    setIsLoading(true);
    try {
      const biorhythm = calculateBiorhythm(birthDateStr);
      
      const { data, error } = await supabase.functions.invoke('generate-mind-forecast', {
        body: { birthDate: birthDateStr, biorhythm }
      });

      if (error) throw error;
      
      setForecastData(data);
      toast({
        title: "✨ 마음 예보 완료!",
        description: "오늘의 컨디션 분석이 완료되었습니다.",
      });
    } catch (error) {
      console.error('Forecast generation error:', error);
      toast({
        title: "⚠️ 분석 실패",
        description: "마음 예보 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  const handleDateSubmit = (newBirthDate: string, shouldSave: boolean) => {
    setBirthDate(newBirthDate);
    if (shouldSave) {
      saveBirthDate(newBirthDate);
    }
    generateForecast(newBirthDate);
  };

  const handleRefresh = () => {
    if (birthDate) {
      generateForecast(birthDate);
    }
  };

  const handleClearData = () => {
    clearSavedData();
    setBirthDate(null);
    setForecastData(null);
    toast({
      title: "🗑️ 정보 삭제 완료",
      description: "저장된 정보가 모두 삭제되었습니다.",
    });
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground">마음 예보를 준비중입니다...</p>
        </div>
      </div>
    );
  }

  if (!birthDate || !forecastData) {
    return (
      <DateInputForm 
        onSubmit={handleDateSubmit}
        isLoading={isLoading}
      />
    );
  }

  return (
    <ForecastReport
      birthDate={birthDate}
      forecastData={forecastData}
      onRefresh={handleRefresh}
      onClearData={handleClearData}
      isLoading={isLoading}
    />
  );
};

export default Index;
