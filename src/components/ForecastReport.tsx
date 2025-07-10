import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw, Settings, Trash2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { BiorhythmChart } from "./BiorhythmChart";
import { MoodGauge } from "./MoodGauge";
import { TimeBasedAdvice } from "./TimeBasedAdvice";
import { FloatingHearts } from "./FloatingHearts";
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
    <>
      <FloatingHearts />
      <div className="min-h-screen bg-gradient-warm p-4 relative z-10">
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
              className="glass-button glass-hover text-primary border-0"
            >
              <RefreshCw className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")} />
              새로고침
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onClearData}
              className="glass-button glass-hover text-destructive border-0"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              정보 삭제
            </Button>
          </div>
        </div>

        {/* 오늘의 총평 및 응원 메시지 */}
        <div className="space-y-6">
          {/* 격려 메시지 - 글래스모피즘 + 파스텔 */}
          {forecastData.encouragement && (
            <Card className="glass-message card-primary card-3d card-glow-animation border-0 animate-scale-in card-content-separated">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary drop-shadow-lg" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-primary drop-shadow-lg">✨ 오늘의 메시지</h3>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 border border-white/30">
                  <p className="text-lg leading-relaxed font-medium text-foreground">
                    {forecastData.encouragement}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* 오늘의 총평 */}
          {forecastData.dailyAdvice && (
            <Card className="glass-card card-secondary glass-hover card-3d transition-warm animate-slide-up border-0 card-content-separated">
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
        <Card className="glass-card card-accent glass-hover card-3d transition-warm border-0 card-content-separated">
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

        {/* 패션 & 플레이리스트 추천 */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* 패션 추천 */}
          {forecastData.fashionRecommendation && (
            <Card className="glass-card card-success glass-hover card-3d responsive-3d transition-warm border-0 card-content-separated">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">👗</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-4">오늘의 패션</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {forecastData.fashionRecommendation.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-foreground">스타일: </span>
                        <Badge variant="outline" className="ml-2 border-2">
                          {forecastData.fashionRecommendation.style}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">추천 색상: </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {forecastData.fashionRecommendation.colors.map((color, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                              {color}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">추천 아이템: </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {forecastData.fashionRecommendation.items.map((item, index) => (
                            <Badge key={index} variant="outline" className="text-xs px-3 py-1 border-2">
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
            <Card className="glass-card card-secondary glass-hover card-3d responsive-3d transition-warm border-0 card-content-separated">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">🎵</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-primary mb-4">오늘의 플레이리스트</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {forecastData.playlistRecommendation.description}
                    </p>
                    
                    <div className="space-y-4">
                      <div>
                        <span className="text-sm font-medium text-foreground">분위기: </span>
                        <Badge variant="outline" className="ml-2 border-2">
                          {forecastData.playlistRecommendation.mood}
                        </Badge>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">장르: </span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {forecastData.playlistRecommendation.genres.map((genre, index) => (
                            <Badge key={index} variant="secondary" className="text-xs px-3 py-1">
                              {genre}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <span className="text-sm font-medium text-foreground">추천 곡: </span>
                        <div className="space-y-2 mt-2">
                          {forecastData.playlistRecommendation.songs.slice(0, 3).map((song, index) => (
                            <div key={index} className="text-sm bg-white/20 backdrop-blur-sm rounded-lg p-3 border border-white/30">
                              <span className="font-medium text-foreground">{song.title}</span>
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

        {/* 바이오리듬 차트 */}
        <Card className="glass-card card-primary glass-hover card-3d transition-warm border-0 card-content-separated">
          <CardHeader>
            <CardTitle className="text-primary text-xl flex items-center space-x-2">
              <span>📊</span>
              <span>바이오리듬 분석</span>
            </CardTitle>
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

        {/* 주의사항 */}
        <Card className="glass-card card-accent glass-hover card-3d transition-warm border-0 card-content-separated">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="text-3xl">⚠️</div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-amber-600 mb-4">주의사항</h3>
                <div className="bg-amber-50/80 backdrop-blur-sm rounded-lg p-4 border border-amber-200/50">
                  <p className="text-foreground leading-relaxed">
                    {forecastData.precautions}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 푸터 */}
        <div className="text-center text-sm text-muted-foreground py-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
          마음 예보는 AI 분석을 통한 참고용 정보입니다. 
          건강한 마음가짐으로 하루를 시작하세요! 💫
        </div>
      </div>
    </div>
    </>
  );
}