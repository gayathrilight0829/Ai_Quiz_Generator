const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty, numberOfQuestions } = req.body;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
      Generate a quiz in pure JSON. No explanation. No markdown. 
      Return EXACTLY this shape:

      {
        "quiz": [
          {
            "question": "",
            "options": ["", "", "", ""],
            "answer": ""
          }
        ]
      }

      Topic: ${topic}
      Difficulty: ${difficulty}
      Number of questions: ${numberOfQuestions}
    `;

    const result = await model.generateContent(prompt);
    let text = result.response.text();

    // CLEAN ANY NON-JSON MARKDOWN
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // FORCE PARSE
    const json = JSON.parse(text);

    if (!json.quiz || !Array.isArray(json.quiz)) {
      throw new Error("Invalid AI response");
    }

    return res.json(json);

  } catch (error) {
    console.error("Quiz Error:", error);
    return res.status(500).json({
      message: "Failed to generate quiz",
      error: error.message,
    });
  }
};
