/**
 * Image upload utility.
 * - If Cloudinary env vars are set → uploads to Cloudinary
 * - If not configured → returns a placeholder (for dev/demo)
 */

interface UploadResult {
  url: string
  publicId: string
  width?: number
  height?: number
}

export async function uploadImage(
  file: File | Buffer,
  folder: string = 'portfolio'
): Promise<UploadResult> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    console.warn('⚠️  Cloudinary not configured — returning placeholder image URL.')
    return {
      url: `https://placehold.co/800x600/1A1A2E/6366F1?text=No+Image`,
      publicId: `placeholder-${Date.now()}`,
    }
  }

  // Dynamically import cloudinary to avoid issues if not configured
  const { v2: cloudinary } = await import('cloudinary')
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  // Convert File to buffer if needed
  let buffer: Buffer
  if (file instanceof File) {
    const arrayBuffer = await file.arrayBuffer()
    buffer = Buffer.from(arrayBuffer)
  } else {
    buffer = file
  }

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' },
          { width: 1200, height: 900, crop: 'limit' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Upload failed'))
          return
        }
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          width: result.width,
          height: result.height,
        })
      }
    ).end(buffer)
  })
}

export async function deleteImage(publicId: string): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) return false

  const { v2: cloudinary } = await import('cloudinary')
  cloudinary.config({ cloud_name: cloudName, api_key: apiKey, api_secret: apiSecret })

  try {
    await cloudinary.uploader.destroy(publicId)
    return true
  } catch {
    return false
  }
}
