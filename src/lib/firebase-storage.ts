import { firebaseStorage } from './firebase-admin'
import { randomUUID } from 'crypto'
import { Readable } from 'stream'

interface UploadOptions {
  buffer: Buffer
  originalName: string
  mimeType: string
  category?: string
}

interface UploadResult {
  success: boolean
  filePath: string
  fileName: string
  downloadURL?: string
}

interface DeleteOptions {
  filePath: string
}

// Firebase Storage service that replaces local file system
export class FirebaseStorageService {
  private bucket = firebaseStorage.bucket()

  // Validate file type
  private validateFileType(mimeType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/svg+xml',
      'image/webp'
    ]
    return allowedTypes.includes(mimeType)
  }

  // Validate file size (max 5MB)
  private validateFileSize(buffer: Buffer): boolean {
    const maxSize = 5 * 1024 * 1024 // 5MB
    return buffer.length <= maxSize
  }

  // Generate unique filename
  private generateFileName(originalName: string): string {
    const fileExtension = originalName.split('.').pop()
    return `${randomUUID()}.${fileExtension}`
  }

  // Get storage path for category
  private getStoragePath(category: string, fileName: string): string {
    const validCategories = ['logos', 'contacts']
    const validCategory = validCategories.includes(category) ? category : 'logos'
    return `uploads/${validCategory}/${fileName}`
  }

  // Upload file to Firebase Storage
  async uploadFile(options: UploadOptions): Promise<UploadResult> {
    try {
      const { buffer, originalName, mimeType, category = 'logos' } = options

      // Validate file type
      if (!this.validateFileType(mimeType)) {
        throw new Error('Invalid file type. Only JPEG, PNG, SVG, and WebP images are allowed.')
      }

      // Validate file size
      if (!this.validateFileSize(buffer)) {
        throw new Error('File too large. Maximum size is 5MB.')
      }

      // Generate unique filename and path
      const fileName = this.generateFileName(originalName)
      const storagePath = this.getStoragePath(category, fileName)

      // Create file in Firebase Storage
      const file = this.bucket.file(storagePath)
      
      // Upload buffer to Firebase Storage
      const stream = file.createWriteStream({
        metadata: {
          contentType: mimeType,
          metadata: {
            originalName: originalName,
            uploadedAt: new Date().toISOString(),
            category: category
          }
        }
      })

      return new Promise((resolve, reject) => {
        stream.on('error', (error) => {
          console.error('Firebase Storage upload error:', error)
          reject(new Error('Failed to upload file to Firebase Storage'))
        })

        stream.on('finish', async () => {
          try {
            // Make file publicly accessible
            await file.makePublic()

            // Get public URL
            const downloadURL = `https://storage.googleapis.com/${this.bucket.name}/${storagePath}`

            // Return path compatible with current API expectations
            const publicPath = `/uploads/${category}/${fileName}`

            resolve({
              success: true,
              filePath: publicPath,
              fileName: fileName,
              downloadURL: downloadURL
            })
          } catch (error) {
            console.error('Error making file public:', error)
            reject(new Error('Failed to make file publicly accessible'))
          }
        })

        stream.end(buffer)
      })

    } catch (error) {
      console.error('Firebase Storage upload error:', error)
      throw error
    }
  }

  // Delete file from Firebase Storage
  async deleteFile(options: DeleteOptions): Promise<boolean> {
    try {
      const { filePath } = options
      
      // Convert public path to storage path
      // Input: /uploads/logos/filename.jpg
      // Output: uploads/logos/filename.jpg
      const storagePath = filePath.startsWith('/') ? filePath.slice(1) : filePath

      const file = this.bucket.file(storagePath)
      
      // Check if file exists
      const [exists] = await file.exists()
      if (!exists) {
        console.warn(`File not found: ${storagePath}`)
        return false
      }

      // Delete file
      await file.delete()
      return true

    } catch (error) {
      console.error('Firebase Storage delete error:', error)
      throw error
    }
  }

  // Get file download URL
  async getDownloadURL(filePath: string): Promise<string | null> {
    try {
      const storagePath = filePath.startsWith('/') ? filePath.slice(1) : filePath
      const file = this.bucket.file(storagePath)
      
      const [exists] = await file.exists()
      if (!exists) {
        return null
      }

      // Get public URL
      return `https://storage.googleapis.com/${this.bucket.name}/${storagePath}`

    } catch (error) {
      console.error('Error getting download URL:', error)
      return null
    }
  }

  // List files in a category
  async listFiles(category: string = 'logos'): Promise<string[]> {
    try {
      const prefix = `uploads/${category}/`
      const [files] = await this.bucket.getFiles({ prefix })
      
      return files.map(file => `/${file.name}`)

    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  }

  // Get file metadata
  async getFileMetadata(filePath: string): Promise<any> {
    try {
      const storagePath = filePath.startsWith('/') ? filePath.slice(1) : filePath
      const file = this.bucket.file(storagePath)
      
      const [metadata] = await file.getMetadata()
      return metadata

    } catch (error) {
      console.error('Error getting file metadata:', error)
      return null
    }
  }
}

// Export singleton instance
export const firebaseStorageService = new FirebaseStorageService()

// Backward compatibility function that matches current upload API
export async function uploadToFirebaseStorage(
  buffer: Buffer,
  originalName: string,
  mimeType: string,
  category: string = 'logos'
): Promise<UploadResult> {
  return firebaseStorageService.uploadFile({
    buffer,
    originalName,
    mimeType,
    category
  })
}