import { Router }                                        from 'express'
import multer                                            from 'multer'
import { subscribe, unsubscribe, getSubscribers, sendBroadcast } from '../controllers/newsletter.controller.js'
import { protect, adminOnly }                           from '../middleware/auth.js'

const router = Router()

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB total limit
})

router.post('/subscribe',     subscribe)
router.post('/unsubscribe',   unsubscribe)
router.get('/subscribers',    protect, adminOnly, getSubscribers)
router.post('/broadcast',     protect, adminOnly, upload.array('attachments', 5), sendBroadcast)

export default router
