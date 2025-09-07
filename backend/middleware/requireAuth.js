const admin = require('firebase-admin')

// Initialisation de Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  })
}

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token d\'authentification requis' })
    }

    const token = authHeader.split('Bearer ')[1]
    
    // Vérifier le token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = {
      id: decodedToken.uid,
      email: decodedToken.email,
      name: decodedToken.name
    }
    
    next()
  } catch (error) {
    console.error('Erreur de vérification du token:', error)
    res.status(401).json({ error: 'Token invalide ou expiré' })
  }
}

module.exports = requireAuth
