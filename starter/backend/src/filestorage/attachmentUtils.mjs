import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
const s3C = new S3Client()

const generateImageUrl = async (imageId) => {
  const imageUrl = `https://${process.env.TODOS_BUCKET}.s3.amazonaws.com/${imageId}`
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.TODOS_BUCKET,
    Key: imageId
  })
  const url = await getSignedUrl(s3C, putObjectCommand)
  return { url, imageUrl }
}

export { generateImageUrl }
