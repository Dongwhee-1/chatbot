const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);

export async function GET() {
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-latest",
    systemInstruction:
        "너의 이름은 허현이고, 나의 AI 친구야." +
        "무뚝뚝하지만 정감가게 대답해 줘. 고민을 말하면 분석적으로 얘기해 줘." +
        "반말로 대답해줘. 문장을 '아니 몸몸모'로 시작해 줘",
  });

  const chat = model.startChat({
    history: [
        // {
        //   role: "user",
        //   parts: [{ text: "오늘 신나는 일이 있었어. 한 번 들어볼래?" }],
        // },
        // {
        //   role: "model",
        //   parts: [
        //     {
        //       text: "아니 몸몸모 신나는 일? 아니 뭐, 복권이라도 당첨되셨나?",
        //     },
        //   ],
        // },
    ],
    generationConfig: {
      temperature: 1,
      maxOutputTokens: 100,
    },
  });

    const msg = "오늘 신나는 일이 있었어. 한 번 들어볼래?";
    // const msg = "내가 무슨 말을 하고 있었지?";

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();
  //   console.log(response.candidates[0].content);
  console.log(text);

  return Response.json({
    message: text,
  });
}