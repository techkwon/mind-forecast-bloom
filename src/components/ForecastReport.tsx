import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BiorhythmChart } from "./BiorhythmChart";
import { MoodGauge } from "./MoodGauge";
import { TimeBasedAdvice } from "./TimeBasedAdvice";
import { calculateBiorhythm, generateWeeklyBiorhythm } from "@/lib/biorhythm";

export interface ForecastData {
  overallScore: number;
  weatherIcon: string;
  weatherDescription: string;
  keywords: string[];
  timeBasedAdvice: {
    morning: {
      icon: string;
      title: string;
      description: string;
    };
    afternoon: {
      icon: string;
      title: string;
      description: string;
    };
    evening: {
      icon: string;
      title: string;
      description: string;
    };
  };
  dailyAdvice: string;
  precautions: string;
  encouragement: string;
}

interface ForecastReportProps {
  birthDate: string;
  forecastData: ForecastData;
  onRefresh: () => void;
  onClearData: () => void;
  isLoading: boolean;
}

export function ForecastReport({ 
  birthDate, 
  forecastData, 
  onRefresh, 
  onClearData, 
  isLoading 
}: ForecastReportProps) {
  const biorhythm = useMemo(() => calculateBiorhythm(birthDate), [birthDate]);
  const weeklyData = useMemo(() => generateWeeklyBiorhythm(birthDate), [birthDate]);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  return (
    <div className="min-h-screen bg-gradient-warm p-4">
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground text-glow">
              오늘의 마음 예보
            </h1>
            <p className="text-muted-foreground">{today}</p>
          </div>
          
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onRefresh}
              disabled={isLoading}
              className="hover-lift"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              새로고침
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearData}
              className="hover-lift text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              정보 삭제
            </Button>
          </div>
        </div>

        {/* 메인 요약 */}
        <Card className="shadow-warm hover-glow transition-warm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6 items-center">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl animate-bounce-in">
                    {forecastData.weatherIcon}
                  </span>
                  <div>
                    <h2 className="text-2xl font-bold text-primary">
                      {forecastData.weatherDescription}
                    </h2>
                    <p className="text-muted-foreground">
                      종합 컨디션 {forecastData.overallScore}점
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {forecastData.keywords.map((keyword, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary-soft text-primary hover:bg-primary hover:text-primary-foreground transition-warm"
                    >
                      #{keyword}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <MoodGauge score={forecastData.overallScore} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 바이오리듬 차트 */}
        <Card className="shadow-warm">
          <CardHeader>
            <CardTitle className="text-primary">바이오리듬 분석</CardTitle>
          </CardHeader>
          <CardContent>
            <BiorhythmChart 
              currentBiorhythm={biorhythm}
              weeklyData={weeklyData}
            />
          </CardContent>
        </Card>

        {/* 시간대별 조언 */}
        <TimeBasedAdvice advice={forecastData.timeBasedAdvice} />

        {/* 오늘의 조언 */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="shadow-warm hover-lift transition-warm">
            <CardHeader>
              <CardTitle className="text-lg text-primary">💡 오늘의 조언</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {forecastData.dailyAdvice}
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-warm hover-lift transition-warm">
            <CardHeader>
              <CardTitle className="text-lg text-amber-600">⚠️ 주의사항</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">
                {forecastData.precautions}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 격려 메시지 */}
        <Card className="shadow-glow gradient-sunrise text-white">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold mb-3">✨ 오늘의 메시지</h3>
            <p className="text-lg leading-relaxed">
              {forecastData.encouragement}
            </p>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="text-center text-xs text-muted-foreground py-4">
          마음 예보는 AI 분석을 통한 참고용 정보입니다. 
          건강한 마음가짐으로 하루를 시작하세요! 💫
        </div>
      </div>
    </div>
  );
}