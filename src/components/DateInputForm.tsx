import { useState } from "react";
import { Calendar, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as DatePicker } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface DateInputFormProps {
  onSubmit: (birthDate: string, shouldSave: boolean) => void;
  isLoading: boolean;
}

export function DateInputForm({ onSubmit, isLoading }: DateInputFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [shouldSave, setShouldSave] = useState(false);

  const handleSubmit = () => {
    if (!selectedDate) return;
    
    const birthDate = format(selectedDate, "yyyy-MM-dd");
    onSubmit(birthDate, shouldSave);
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

        <Card className="shadow-warm hover-glow transition-warm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl text-primary">
              생년월일을 알려주세요
            </CardTitle>
            <CardDescription>
              AI가 당신만의 바이오리듬을 분석해드려요
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                생년월일
              </label>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-12",
                      !selectedDate && "text-muted-foreground",
                      "border-2 hover:border-primary transition-warm"
                    )}
                  >
                    <Calendar className="mr-3 h-5 w-5" />
                    {selectedDate ? (
                      format(selectedDate, "yyyy년 MM월 dd일", { locale: ko })
                    ) : (
                      <span>날짜를 선택해주세요</span>
                    )}
                  </Button>
                </PopoverTrigger>
                
                <PopoverContent className="w-auto p-0" align="start">
                  <DatePicker
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="bg-primary-soft rounded-lg p-4 space-y-3">
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
              disabled={!selectedDate || isLoading}
              className="w-full h-12 text-lg font-medium gradient-sunrise border-0 hover:scale-105 transition-bounce disabled:opacity-50"
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