// Vercel serverless function — accepts POST body for upload speed test
// Drains the request body and returns immediately so the client can time it
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Cache-Control', 'no-store, no-cache')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Drain the body stream (required in Node.js runtime)
  if (req.body !== undefined) {
    // Already parsed by Vercel — nothing to do
  } else {
    await new Promise((resolve) => {
      req.resume()
      req.on('end', resolve)
      req.on('error', resolve)
    })
  }

  res.status(200).json({ ok: 1 })
}

// Tell Vercel not to parse the body (we want raw stream for large payloads)
export const config = {
  api: {
    bodyParser: false,
  },
}
