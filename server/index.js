/* global process */

import cors from 'cors'
import express from 'express'
import multer from 'multer'
import 'dotenv/config'
//import OpenAI from 'openai'
import {GoogleGenAI} from '@google/genai'
const app = express()
/*const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})*/
const gemini = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})
const upload = multer ({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
  }
})
const port = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})
app.post(
  '/api/analyze-food',
  upload.single('image'),
  async (request, response) => {
    if (!request.file) {
      return response.status(400).json({
        error: 'Image file is required'
      })
    }
    try {
      const imageBase64 = request.file.buffer.toString('base64')
      //const imageDataUrl = `data:${request.file.mimetype};base64,${imageBase64}`
      /*const aiResponse = await openai.responses.create({
        model: 'gpt-4.1-mini',
        input: [
          {
            role: 'user',
            content: [
              {
                type: 'input_text',
                text: 'Identify the food in this image and estimate its calories. Return a short explanation and an approximate calorie number. Make clear that this is only an estimate.'
              },
              {
                type: 'input_image',
                image_url: imageDataUrl
              }
            ]
          }
        ]
      })
      response.json({
        message: 'Image analyzed.',
        result: aiResponse.output_text
      })*/
     const geminiResponse = await gemini.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          {
            inlineData: {
              mimeType: request.file.mimetype,
              data: imageBase64
            }
          },
          {
            text: `
    Analyze the food in this image.

    Return only valid JSON with this exact structure:
    {
      "foodName": "string",
      "ingredients": [
        {
          "name": "string",
          "amount": "string",
          "calories": 0
        }
      ],
      "totalCalories": 0,
      "confidence": "low",
      "assumptions": ["string"]
    }

    Estimate calories conservatively.
    Explain uncertain ingredients in assumptions.
    Do not include markdown or extra text outside the JSON.
  `
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseJsonSchema: {
            type: 'object',
            properties: {
              foodName: {
                type: 'string'
              },
              ingredients: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    name: { type: 'string' },
                    amount: { type: 'string' },
                    calories: { type: 'integer' }
                  },
                  required: ['name', 'amount', 'calories']
              }
            },
            totalCalories: {
              type: 'integer'
            },
            confidence: {
              type: 'string',
              enum: ['low', 'medium', 'high']
          },
          assumptions: {
            type: 'array',
            items: {
              type: 'string'
            }
          }
          },
            required: [
              'foodName',
              'ingredients',
              'totalCalories',
              'confidence',
              'assumptions'
            ]
          }
        }
     })
     response.json({
      message: 'Image analyzed.',
      result: geminiResponse.text
     })
    } catch (error) {
      console.error('Gemini request failed:', error)
      response.status(500).json({
        error: 'Could not analyze image.'
      })
    }
  }
)
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})
