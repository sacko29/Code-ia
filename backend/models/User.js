const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: function() {
      return !this.googleId // Le mot de passe n'est requis que pour l'authentification email
    }
  },
  googleId: {
    type: String,
    sparse: true // Permet plusieurs documents sans cette valeur
  },
  displayName: {
    type: String,
    trim: true
  },
  avatar: {
    type: String
  },
  credits: {
    type: Number,
    default: 5 // Crédits gratuits à l'inscription
  },
  subscription: {
    type: String,
    enum: ['free', 'basic', 'premium', 'enterprise'],
    default: 'free'
  },
  subscriptionId: {
    type: String // ID de l'abonnement Stripe
  },
  customerId: {
    type: String // ID du client Stripe
  },
  settings: {
    language: {
      type: String,
      default: 'fr'
    },
    darkMode: {
      type: Boolean,
      default: false
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      promotional: {
        type: Boolean,
        default: false
      }
    }
  },
  lastLogin: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index pour améliorer les performances des requêtes
userSchema.index({ email: 1 })
userSchema.index({ googleId: 1 })
userSchema.index({ subscription: 1 })

// Middleware pour hacher le mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next()
  
  try {
    const salt = await bcrypt.genSalt(12)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error)
  }
})

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  if (!this.password) return false // Pour les utilisateurs Google sans mot de passe
  return bcrypt.compare(candidatePassword, this.password)
}

// Méthode pour obtenir le profil public
userSchema.methods.toProfileJSON = function() {
  return {
    id: this._id,
    email: this.email,
    displayName: this.displayName,
    avatar: this.avatar,
    credits: this.credits,
    subscription: this.subscription,
    settings: this.settings,
    lastLogin: this.lastLogin,
    createdAt: this.createdAt
  }
}

module.exports = mongoose.model('User', userSchema)
