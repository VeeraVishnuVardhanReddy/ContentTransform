const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.get("/", (req, res) => {
    res.send("Content Transformer Backend is running!");
});

app.post("/analyze", async (req, res) => {

    try {

        const {
            content,
            audience,
            tone,
            outputType
        } = req.body;

        if (!content || content.trim() === "") {

            return res.status(400).json({
                error: "Content is required"
            });

        }

        const prompt = `
You are an AI content transformation engine.

Transform the following source content according to the user's requirements.

AUDIENCE:
${audience || "General"}

TONE:
${tone || "Professional"}

OUTPUT FORMAT:
${outputType || "LinkedIn Post"}

SOURCE CONTENT:
${content}

IMPORTANT RULES:

1. Use only information present in the source content.
2. Do not invent facts, statistics, names, or information.
3. Adapt the language for the specified audience.
4. Use the requested tone.
5. Follow the requested output format.
6. Make the output clear, natural, and engaging.
7. Return ONLY valid JSON.
8. Do not use markdown code fences.
9. Do not add any text outside the JSON.

Return this exact JSON structure:

{
    "topic": "",
    "summary": "",
    "keyFacts": [],
    "impact": [],
    "recommendations": [],
    "transformedContent": ""
}

The "transformedContent" field must contain the final content in the requested format.
`;

        const response = await ai.models.generateContent({
            model: "gemini-3.6-flash",
            contents: prompt
        });

        let result = response.text;

        result = result
            .replace(/```json/g, "")
            .replace(/```/g, "")
            .trim();

        const analysis = JSON.parse(result);

        res.json({
            success: true,
            analysis: analysis
        });

    } catch (error) {

        console.error("Error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to transform content"
        });

    }

});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});