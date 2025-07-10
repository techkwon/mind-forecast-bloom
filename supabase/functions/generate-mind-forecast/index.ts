import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface BiorhythmData {
  physical: number;
  emotional: number;
  intellectual: number;
}

interface RequestBody {
  birthDate: string;
  biorhythm: BiorhythmData;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!geminiApiKey) {
      throw new Error('Gemini API key not configured');
    }

    const { birthDate, biorhythm }: RequestBody = await req.json();

    const prompt = `
당신은 '마음 예보' AI 코치입니다. 사용자의 바이오리듬 데이터를 바탕으로 따뜻하고 개인화된 일일 리포트를 작성해주세요.

**중요: 개인정보 보호**
- 생년월일이나 개인 식별 정보는 절대 응답에 포함하지 마세요
- 나이나 출생연도도 언급하지 마세요
- 오직 바이오리듬 분석 결과에만 집중해주세요

**오늘의 바이오리듬:**
- 신체 리듬: ${biorhythm.physical.toFixed(1)}%
- 감정 리듬: ${biorhythm.emotional.toFixed(1)}%
- 지적 리듬: ${biorhythm.intellectual.toFixed(1)}%

**가이드라인:**
1. 따뜻하고 친근한 톤으로 작성하되, 개인정보는 절대 포함하지 않기
2. 구체적이고 실행 가능한 조언 포함
3. 부정적인 내용도 긍정적으로 재해석
4. 오늘 하루에 집중한 내용으로 작성

다음 JSON 형식으로 정확히 응답해주세요:

{
  "overallScore": 75,
  "weatherIcon": "☀️",
  "weatherDescription": "맑음",
  "keywords": ["활력", "집중", "소통"],
  "timeBasedAdvice": {
    "morning": {
      "icon": "🌅",
      "title": "아침 (6-12시)",
      "description": "신체 리듬이 좋은 시간입니다. 운동이나 중요한 업무를 처리하기 좋아요."
    },
    "afternoon": {
      "icon": "☀️", 
      "title": "오후 (12-18시)",
      "description": "집중력이 높은 시간대입니다. 창의적인 작업이나 학습에 집중해보세요."
    },
    "evening": {
      "icon": "🌙",
      "title": "저녁 (18-24시)", 
      "description": "감정 리듬이 안정적입니다. 소중한 사람들과 시간을 보내기 좋아요."
    }
  },
  "dailyAdvice": "오늘은 전반적으로 균형잡힌 하루가 될 것 같습니다. 특히 오전에는 신체적 활력이 넘치니 중요한 일정을 배치해보세요.",
  "precautions": "오후에 약간의 피로감을 느낄 수 있으니 적절한 휴식을 취하세요.",
  "encouragement": "당신의 긍정적인 에너지가 주변 사람들에게도 좋은 영향을 줄 거예요. 자신감을 가지고 하루를 시작하세요! ✨",
  "fashionRecommendation": {
    "style": "캐주얼 시크",
    "colors": ["하늘색", "화이트", "베이지"],
    "items": ["니트 가디건", "데님 팬츠", "스니커즈"],
    "description": "오늘은 편안하면서도 세련된 룩으로 활기찬 에너지를 표현해보세요."
  },
  "playlistRecommendation": {
    "mood": "상쾌하고 활기찬",
    "genres": ["팝", "인디", "어쿠스틱"],
    "songs": [
      {"title": "좋은 날", "artist": "아이유"},
      {"title": "Spring Day", "artist": "BTS"},
      {"title": "밤편지", "artist": "아이유"}
    ],
    "description": "긍정적인 에너지를 충전하고 기분을 업시켜줄 곡들로 구성된 플레이리스트입니다."
  }
}

**중요 참고사항:**
- 패션 추천은 현실적이고 실용적인 아이템으로 구성
- 플레이리스트는 한국 대중음악 위주로, 바이오리듬에 맞는 분위기로 추천
- 모든 추천은 당일의 바이오리듬 분석 결과와 연관성 있게 구성
`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const generatedText = data.candidates[0].content.parts[0].text;
    
    // JSON 응답 파싱
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse JSON from Gemini response');
    }

    const forecastData = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(forecastData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-mind-forecast function:', error);
    return new Response(JSON.stringify({ 
      error: '마음 예보를 생성하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});