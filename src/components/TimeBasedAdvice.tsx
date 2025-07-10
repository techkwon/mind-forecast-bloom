import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TimeAdvice {
  icon: string;
  title: string;
  description: string;
}

interface TimeBasedAdviceProps {
  advice: {
    morning: TimeAdvice;
    afternoon: TimeAdvice;
    evening: TimeAdvice;
  };
}

export function TimeBasedAdvice({ advice }: TimeBasedAdviceProps) {
  const timeSlots = [
    { key: 'morning', data: advice.morning },
    { key: 'afternoon', data: advice.afternoon },
    { key: 'evening', data: advice.evening },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {timeSlots.map(({ key, data }) => (
        <Card key={key} className="shadow-warm hover-lift transition-warm">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <span className="text-2xl">{data.icon}</span>
              <span className="text-primary">{data.title}</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground leading-relaxed text-sm">
              {data.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}