const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const mongoose = require('mongoose')
require('dotenv').config()

// Import des routes
const authRoutes = require('./routes/auth')
const generateRoutes = require('./routes/generate')
const userRoutes = require('./routes/users')
const paymentRoutes = require('./routes/payment')

const app = express()
const PORT = process.env.PORT || 3001

// Middleware de sécurité
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'", "'unsafe-eval'"],
    },
  },
  crossOriginEmbedderPolicy: false
}))

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Limiteur de requêtes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limite chaque IP à 100 requêtes par fenêtre
})
app.use(limiter)

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Connexion à la base de données MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lovableclone', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err))

// Routes de l'API
app.use('/api/auth', authRoutes)
app.use('/api/generate', generateRoutes)
app.use('/api/users', userRoutes)
app.use('/api/payment', paymentRoutes)

// Route de santé pour les tests
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Serveur opérationnel' })
})

// Gestion des routes non trouvées
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' })
})

// Gestionnaire d'erreurs global
app.use((error, req, res, next) => {
  console.error('Erreur:', error)
  res.status(500).json({ 
    error: 'Une erreur interne est survenue',
    message: process.env.NODE_ENV === 'development' ? error.message : undefined
  })
})

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur backend démarré sur le port ${PORT}`)
})

module.exports = app
