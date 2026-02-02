import express from 'express'
import testController from '../controllers/test.controller.js'
import authMiddleware from '../middlewares/auth.middlware.js'
import userRepository from '../repository/user.repository.js'

const router = express.Router()

router.get('/test-mongo', async (req, res) => {
  try {
    const users = await userRepository.obtenerTodos() 
    res.json({ ok: true, count: users.length })
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message })
  }
})

export default router

