const express = require('express')
const { OpenAI } = require('openai')
const requireAuth = require('../middleware/requireAuth')
const User = require('../models/User')
const Generation = require('../models/Generation')

const router = express.Router()

// Initialisation de l'API OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

// Route pour générer du texte avec l'IA
router.post('/text', requireAuth, async (req, res) => {
  try {
    const { prompt, tone = 'professional', length = 'medium', language = 'french' } = req.body
    const userId = req.user.id

    // Vérifier que l'utilisateur a assez de crédits
    const user = await User.findById(userId)
    if (user.credits < 1) {
      return res.status(402).json({ error: 'Crédits insuffisants' })
    }

    // Construire le prompt final en fonction des paramètres
    const toneMap = {
      professional: 'un ton professionnel',
      casual: 'un ton décontracté',
      friendly: 'un ton amical',
      formal: 'un ton formel'
    }

    const lengthMap = {
      short: 'courte',
      medium: 'moyenne',
      long: 'longue'
    }

    const systemPrompt = `Tu es un assistant IA qui génère du contenu. Réponds en ${language} avec ${toneMap[tone]} et une longueur ${lengthMap[length]}.`

    // Appel à l'API OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt }
      ],
      max_tokens: length === 'short' ? 150 : length === 'medium' ? 300 : 600,
      temperature: 0.7
    })

    const generatedText = completion.choices[0].message.content

    // Sauvegarder la génération dans l'historique
    const generation = new Generation({
      userId,
      type: 'text',
      prompt,
      result: generatedText,
      parameters: { tone, length, language },
      creditsUsed: 1
    })
    await generation.save()

    // Déduire les crédits de l'utilisateur
    user.credits -= 1
    await user.save()

    res.json({ 
      success: true, 
      text: generatedText,
      creditsRemaining: user.credits
    })

  } catch (error) {
    console.error('Erreur lors de la génération de texte:', error)
    res.status(500).json({ error: 'Erreur lors de la génération' })
  }
})

// Route pour générer un PDF
router.post('/pdf', requireAuth, async (req, res) => {
  try {
    const { prompt, design = 'minimal' } = req.body
    const userId = req.user.id

    // Vérifier que l'utilisateur a assez de crédits (un PDF coûte 2 crédits)
    const user = await User.findById(userId)
    if (user.credits < 2) {
      return res.status(402).json({ error: 'Crédits insuffisants' })
    }

    // Générer le contenu du PDF avec l'IA
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: `Tu es un assistant qui crée du contenu structuré pour des PDF. 
          Génère un contenu bien formaté avec des titres, sous-titres et paragraphes.
          Utilise le markdown pour la structure.` 
        },
        { role: "user", content: prompt }
      ],
      max_tokens: 1000,
      temperature: 0.7
    })

    const content = completion.choices[0].message.content

    // Ici, on utiliserait normalement une librairie comme pdfkit ou puppeteer
    // Pour cet exemple, on simule la génération du PDF
    const pdfBuffer = Buffer.from(`PDF Simulation: ${content}`)

    // Sauvegarder la génération
    const generation = new Generation({
      userId,
      type: 'pdf',
      prompt,
      result: content, // On stocke le contenu, pas le PDF binaire
      parameters: { design },
      creditsUsed: 2
    })
    await generation.save()

    // Déduire les crédits
    user.credits -= 2
    await user.save()

    // Renvoyer le PDF (en simulation, on renvoie le contenu textuel)
    res.json({
      success: true,
      content: content,
      pdfUrl: `data:text/plain;base64,${pdfBuffer.toString('base64')}`, // Simulation
      creditsRemaining: user.credits
    })

  } catch (error) {
    console.error('Erreur lors de la génération de PDF:', error)
    res.status(500).json({ error: 'Erreur lors de la génération du PDF' })
  }
})

// Route pour récupérer l'historique des générations
router.get('/history', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const generations = await Generation.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const total = await Generation.countDocuments({ userId })

    res.json({
      generations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'historique:', error)
    res.status(500).json({ error: 'Erreur serveur' })
  }
})

module.exports = router
