import { Router } from 'express'

const router = Router()

const MAX_SIZE = 5 * 1024 * 1024 // 5 MB limit per image

/**
 * POST /api/images/upload-url
 * Body: { url: "https://..." }
 * Fetches the image, converts to base64 data URI, returns it.
 * This avoids CORS/hotlink-blocked image URLs on the frontend.
 */
router.post('/upload-url', async (req, res) => {
  const { url } = req.body
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ error: 'url is required' })
  }

  try {
    const response = await fetch(url, {
      headers: {
        // Mimic a browser request to avoid bot-blocks
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'image/*,*/*',
        'Referer': url,
      },
      signal: AbortSignal.timeout(15000),
    })

    if (!response.ok) {
      return res.status(400).json({ error: `Failed to fetch image: HTTP ${response.status}` })
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    if (!contentType.startsWith('image/')) {
      return res.status(400).json({ error: 'URL does not point to an image' })
    }

    const buffer = await response.arrayBuffer()
    if (buffer.byteLength > MAX_SIZE) {
      return res.status(400).json({ error: 'Image too large (max 5 MB)' })
    }

    const base64 = Buffer.from(buffer).toString('base64')
    const dataUri = `data:${contentType};base64,${base64}`

    res.json({ dataUri })
  } catch (err) {
    res.status(500).json({ error: `Could not fetch image: ${err.message}` })
  }
})

export default router
