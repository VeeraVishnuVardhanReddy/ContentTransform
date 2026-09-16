const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
    storage: multer.memoryStorage()
});

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});


/* =========================
   HOME
========================= */

app.get("/", (req, res) => {
    res.send("Content Transformer Backend is running!");
});


/* =========================
   PDF TEXT EXTRACTION
========================= */

async function extractPdfText(file) {

    if (!file) {
        return "";
    }

    const pdfData = await pdfParse(file.buffer);

    return pdfData.text.trim();
}


/* =========================
   TRANSFORM EXISTING CONTENT
========================= */

app.post("/analyze", upload.single("file"), async (req, res) => {

    try {

        const {
            content,
            audience,
            tone,
            outputType
        } = req.body;

        let sourceContent = content || "";

        /* If a PDF was uploaded, read its actual text */
        if (req.file) {

            console.log("File received:", req.file.originalname);

            if (req.file.mimetype === "application/pdf") {

                sourceContent = await extractPdfText(req.file);

                console.log(
                    "Extracted PDF characters:",
                    sourceContent.length
                );

            } else {

                return res.status(400).json({
                    error: "Currently only PDF files are supported for content extraction."
                });

            }
        }

        if (!sourceContent || sourceContent.trim() === "") {

            return res.status(400).json({
                error: "No content could be extracted from the file."
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
${sourceContent}

IMPORTANT RULES:

1. Use the source content as the primary source.
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

        console.error("Transform Error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to transform content"
        });

    }

});


/* =========================
   GENERATE NEW CONTENT
========================= */

app.post("/generate", async (req, res) => {

    try {

        const {
            content,
            audience,
            tone,
            outputType
        } = req.body;

        if (!content || content.trim() === "") {

            return res.status(400).json({
                error: "Generation prompt is required"
            });

        }


        const prompt = `
You are an AI content generation engine.

The user wants you to create NEW content from their request.

USER REQUEST:
${content}

AUDIENCE:
${audience || "General"}

TONE:
${tone || "Professional"}

OUTPUT FORMAT:
${outputType || "LinkedIn Post"}

IMPORTANT RULES:

1. Create original content based on the user's request.
2. Do not mention that you are an AI.
3. Adapt the content for the specified audience.
4. Use the requested tone.
5. Follow the requested output format.
6. Make the content clear, useful, and well structured.
7. If the requested format is a presentation, create logical slide content.
8. For presentations, include speaker notes for every slide.
9. Return ONLY valid JSON.
10. Do not use markdown code fences.
11. Do not add any text outside the JSON.

Return this exact JSON structure:

{
    "topic": "",
    "summary": "",
    "keyFacts": [],
    "impact": [],
    "recommendations": [],
    "transformedContent": "",
    "slides": []
}

For a presentation, the "slides" array must use this structure:

[
    {
        "title": "",
        "content": [],
        "speakerNotes": ""
    }
]

For non-presentation outputs, "slides" can be an empty array.

The "transformedContent" field must contain the final generated content.
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


        const generated = JSON.parse(result);


        res.json({
            success: true,
            analysis: generated
        });

    } catch (error) {

        console.error("Generate Error:", error);

        res.status(500).json({
            success: false,
            error: "Failed to generate content"
        });

    }

});


/* =========================
   SERVER
========================= */

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});