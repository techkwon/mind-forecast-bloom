import { useState } from "react";
import { Calendar, Check, Sparkles, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateInputFormProps {
  onSubmit: (birthDate: string, shouldSave: boolean) => void;
  isLoading: boolean;
}

export function DateInputForm({ onSubmit, isLoading }: DateInputFormProps) {
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [shouldSave, setShouldSave] = useState(false);

  // 년도 옵션 생성 (1930-2010)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1930 + 1 }, (_, i) => currentYear - i);
  
  // 월 옵션
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  
  // 일 옵션 (선택된 년월에 따른 마지막 날 계산)
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  const days = selectedYear && selectedMonth 
    ? Array.from({ length: getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth)) }, (_, i) => i + 1)
    : Array.from({ length: 31 }, (_, i) => i + 1);

  const isFormValid = selectedYear && selectedMonth && selectedDay;
  
  const handleSubmit = () => {
    if (!isFormValid) return;
    
    const birthDate = `${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`;
    onSubmit(birthDate, shouldSave);
  };

  const getFormattedDate = () => {
    if (!isFormValid) return null;
    const date = new Date(parseInt(selectedYear), parseInt(selectedMonth) - 1, parseInt(selectedDay));
    return format(date, "yyyy년 MM월 dd일", { locale: ko });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-sunrise mb-4 animate-bounce-in">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 text-glow">
            마음 예보
          </h1>
          <p className="text-muted-foreground text-lg">
            나만을 위한 일일 컨디션 리포트
          </p>
        </div>

        <Card className="glass-card glass-hover transition-warm border-0">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-primary">
              생년월일을 알려주세요
            </CardTitle>
            <CardDescription>
              AI가 당신만의 바이오리듬을 분석해드려요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <label className="text-sm font-medium text-foreground">
                생년월일
              </label>
              
              {/* 년도 선택 */}
              <div className="space-y-3">
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="glass-input h-12 border-0 hover:bg-white/25 transition-warm">
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="년도를 선택하세요 (예: 1980)" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}년
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* 월과 일 선택 (년도 선택 후 표시) */}
                {selectedYear && (
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                      <SelectTrigger className="glass-input h-12 border-0 hover:bg-white/25 transition-warm">
                        <SelectValue placeholder="월" />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {month}월
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger className="glass-input h-12 border-0 hover:bg-white/25 transition-warm">
                        <SelectValue placeholder="일" />
                      </SelectTrigger>
                      <SelectContent className="max-h-60">
                        {days.map((day) => (
                          <SelectItem key={day} value={day.toString()}>
                            {day}일
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* 선택된 날짜 미리보기 */}
              {isFormValid && (
                <div className="glass-card rounded-2xl p-4 text-center animate-slide-up border border-white/30">
                  <p className="text-primary font-medium">
                    선택된 생년월일: {getFormattedDate()}
                  </p>
                </div>
              )}
            </div>

            <div className="glass-card rounded-2xl p-4 space-y-3 border border-white/20">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="save-data"
                  checked={shouldSave}
                  onCheckedChange={(checked) => setShouldSave(checked === true)}
                  className="mt-0.5"
                />
                <div className="space-y-1">
                  <label
                    htmlFor="save-data"
                    className="text-sm font-medium text-primary cursor-pointer"
                  >
                    브라우저에 정보 저장
                  </label>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    다음 방문 시 자동으로 예보를 확인할 수 있어요. 
                    정보는 오직 내 브라우저에만 저장되며 서버로 전송되지 않습니다.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!isFormValid || isLoading}
              className="glass-button w-full h-12 text-lg font-medium text-primary hover:text-white hover:bg-primary/80 border-0 hover:scale-105 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>분석 중...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Check className="w-5 h-5" />
                  <span>확인하기</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-xs text-muted-foreground">
          개인정보는 안전하게 보호되며, 분석에만 사용됩니다.
        </div>
      </div>
    </div>
  );
}