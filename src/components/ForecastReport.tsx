import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Trash2, Sparkles } from "lucide-react";
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
  fashionRecommendation?: {
    style: string;
    colors: string[];
    items: string[];
    description: string;
  };
  playlistRecommendation?: {
    mood: string;
    genres: string[];
    songs: Array<{
      title: string;
      artist: string;
    }>;
    description: string;
  };
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

        {/* 오늘의 총평 및 응원 메시지 - 맨 위로 이동 */}
        <div className="space-y-4">
          {/* 격려 메시지 - 가독성 개선 */}
          {forecastData.encouragement && (
            <Card className="shadow-glow bg-gradient-to-br from-primary to-primary-glow border-0 animate-scale-in">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white drop-shadow-lg">✨ 오늘의 메시지</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <p className="text-lg leading-relaxed font-medium text-white drop-shadow-md">
                    {forecastData.encouragement}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 오늘의 총평 */}
          {forecastData.dailyAdvice && (
            <Card className="shadow-warm hover-lift transition-warm animate-slide-up">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">💡</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-4">오늘의 총평</h3>
                    <p className="text-foreground leading-relaxed text-lg">
                      {forecastData.dailyAdvice}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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

        {/* 패션 & 플레이리스트 추천 */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* 패션 추천 */}
          {forecastData.fashionRecommendation && (
            <Card className="shadow-warm hover-lift transition-warm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">👗</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary mb-3">오늘의 패션</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {forecastData.fashionRecommendation.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">스타일: </span>
                        <Badge variant="outline" className="ml-1">
                          {forecastData.fashionRecommendation.style}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">추천 색상: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {forecastData.fashionRecommendation.colors.map((color, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">추천 아이템: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {forecastData.fashionRecommendation.items.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 플레이리스트 추천 */}
          {forecastData.playlistRecommendation && (
            <Card className="shadow-warm hover-lift transition-warm">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">🎵</div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-primary mb-3">오늘의 플레이리스트</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {forecastData.playlistRecommendation.description}
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-medium text-foreground">분위기: </span>
                        <Badge variant="outline" className="ml-1">
                          {forecastData.playlistRecommendation.mood}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">장르: </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {forecastData.playlistRecommendation.genres.map((genre, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">추천 곡: </span>
                        <div className="space-y-1 mt-2">
                          {forecastData.playlistRecommendation.songs.slice(0, 3).map((song, index) => (
                            <div key={index} className="text-xs bg-muted/50 rounded p-2">
                              <span className="font-medium">{song.title}</span>
                              <span className="text-muted-foreground"> - {song.artist}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* 주의사항만 남김 */}
        <Card className="shadow-warm hover-lift transition-warm">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="text-2xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-amber-600 mb-3">주의사항</h3>
                <p className="text-foreground leading-relaxed">
                  {forecastData.precautions}
                </p>
              </div>
            </div>
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