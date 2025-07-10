import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BiorhythmData } from "@/lib/biorhythm";

interface BiorhythmChartProps {
  currentBiorhythm: BiorhythmData;
  weeklyData: Array<BiorhythmData & { date: string }>;
}

export function BiorhythmChart({ currentBiorhythm, weeklyData }: BiorhythmChartProps) {
  // 레이더 차트 데이터
  const radarData = [
    {
      category: '신체',
      value: currentBiorhythm.physical,
      fullMark: 100,
    },
    {
      category: '감정',
      value: currentBiorhythm.emotional,
      fullMark: 100,
    },
    {
      category: '지적',
      value: currentBiorhythm.intellectual,
      fullMark: 100,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* 오늘의 바이오리듬 (레이더 차트) */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">오늘의 컨디션</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid className="opacity-30" />
                <PolarAngleAxis 
                  dataKey="category" 
                  className="text-sm font-medium"
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  className="opacity-50"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                />
                <Radar
                  name="컨디션"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="hsl(var(--primary))"
                  fillOpacity={0.2}
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 세부 수치 */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-lg">세부 분석</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">💪 신체 리듬</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sunny transition-all duration-1000"
                      style={{ width: `${currentBiorhythm.physical}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {currentBiorhythm.physical}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">❤️ 감정 리듬</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-partly-cloudy transition-all duration-1000"
                      style={{ width: `${currentBiorhythm.emotional}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {currentBiorhythm.emotional}%
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">🧠 지적 리듬</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-cloudy transition-all duration-1000"
                      style={{ width: `${currentBiorhythm.intellectual}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-primary">
                    {currentBiorhythm.intellectual}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 주간 트렌드 (라인 차트) */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-lg">주간 바이오리듬 트렌드</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 100]}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-soft)',
                }}
              />
              <Line
                type="monotone"
                dataKey="physical"
                stroke="hsl(var(--sunny))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--sunny))', strokeWidth: 2, r: 4 }}
                name="신체"
              />
              <Line
                type="monotone"
                dataKey="emotional"
                stroke="hsl(var(--partly-cloudy))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--partly-cloudy))', strokeWidth: 2, r: 4 }}
                name="감정"
              />
              <Line
                type="monotone"
                dataKey="intellectual"
                stroke="hsl(var(--cloudy))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--cloudy))', strokeWidth: 2, r: 4 }}
                name="지적"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}