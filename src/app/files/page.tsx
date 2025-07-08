import { File } from '@prisma/client'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'

const FilesPage: NextPage = () => {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/files')
        if (!res.ok) throw new Error('Failed to fetch files')
        const data = await res.json()
        setFiles(data)
      } catch (err: any) {
        setError(err.message || 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchFiles()
  }, [])

  if (loading) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">Loading...</div>
  }

  if (error) {
    return <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-red-600">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Files</h1>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {files.length === 0 ? (
          <div className="text-gray-500">No files uploaded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mime Type</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Uploaded</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {files.map((file) => (
                  <tr key={file.id}>
                    <td className="px-4 py-2 text-sm text-gray-900">{file.fileName}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{file.mimeType}</td>
                    <td className="px-4 py-2 text-sm text-gray-600">{new Date(file.createdAt).toLocaleString()}</td>
                    <td className="px-4 py-2 text-sm">
                      <a
                        href={`/uploads/logos/${file.id}.${file.fileName.split('.').pop()}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default FilesPage
