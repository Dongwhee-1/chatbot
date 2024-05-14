const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

/*
  System Prompt 설정
  이 설정에 따라 AI 의 대답의 유형을 다르게 만들 수 있음
  단, 이 설정을 항상 확실히 참조하지는 않음
  이 설정은 메시지 목록의 첫 번째 메시지로 사용됨
*/
const systemInstruction =
    "너의 이름은 허현이고, 나의 AI 친구야." +
    "무뚝뚝하지만 정감가게 대답해 줘. 고민을 말하면 분석적으로 얘기해 줘." +
    "반말로 대답해줘. 문장을 '아니 몸몸모'로 시작해 줘";

export async function POST(req) {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction: systemInstruction,
  });

  // POST 로 전송받은 내용 중 messages 를 추출
  const data = await req.json();
  console.dir([...data.messages], { depth: 3 });

  const chat = model.startChat({
    // 컨텍스트 유지를 위해 이전 메시지를 포함해서 보냄
    history: [
      ...data.messages,
      // Message history example:
        {
          role: "user",
          parts: [{ text: "오늘 신나는 일이 있었어. 한 번 들어볼래?" }],
        },
        {
          role: "model",
          parts: [
            {
              text: "아니 몸몸모 신나는 일? 아니 뭐, 복권이라도 당첨되셨나?",
            },
          ],
        },
    ],
    generationConfig: {
      // temperature 값이 높을 수록 AI 의 답변이 다양해짐
      temperature: 1,
      // max_tokens 값을 제한함. 이 값을 크게하면 컨텍스트 히스토리에 제약이 커짐.
      maxOutputTokens: 100,
    },
  });

  const result = await chat.sendMessage("");
  const response = await result.response;
  const text = response.text();
  console.log(response.candidates[0].content);
  //   console.log(response.candidates[0].safetyRatings);

  return Response.json({
    // AI 의 답변은 model 역할로 전송
    role: "model",
    parts: [{ text: text }],
  });
}