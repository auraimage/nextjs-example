'use client'

import { useState, useEffect } from 'react'
import { uploadOne } from '@auraimage/sdk/client'
import type { UploadResult } from '@auraimage/sdk/client'

const PRESETS = [
  { label: 'Thumbnail 200w WebP', params: 'w=200&h=200&fit=crop&fmt=webp' },
  { label: 'Medium 600w AVIF', params: 'w=600&fmt=avif' },
  { label: 'Full 1200w', params: 'w=1200' }
]

async function checkHealth(): Promise<boolean> {
  try {
    const res = await fetch('/api/health')
    return res.ok
  } catch {
    return false
  }
}

async function getUploadToken(): Promise<{ token: string; cdnUrl: string }> {
  const res = await fetch('/api/upload-token', { method: 'POST' })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { error?: string }).error ?? 'Failed to get upload token')
  }
  return res.json()
}

export default function Upload() {
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [image, setImage] = useState<UploadResult | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    checkHealth().then(setHealthy)
  }, [])

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError(null)

    try {
      const { token, cdnUrl } = await getUploadToken()
      const result = await uploadOne(file, {
        token,
        url: `${cdnUrl}/v1/upload`
      })
      setImage(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-4">
        Server:{' '}
        {healthy === null ? (
          <span className="text-neutral-400">Checking...</span>
        ) : healthy ? (
          <span className="text-green-600">Connected</span>
        ) : (
          <span className="text-red-600">Not running — check your .env file</span>
        )}
      </div>

      <div className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="block w-full max-w-xs text-sm text-neutral-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-neutral-900 file:text-white hover:file:bg-neutral-800"
        />
        {uploading && <p className="text-neutral-500 mt-2">Uploading...</p>}
        {error && <p className="text-red-600 mt-2">Upload failed: {error}</p>}
      </div>

      {image && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PRESETS.map((preset) => (
            <div key={preset.label} className="bg-white border border-neutral-200 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-600 mb-3">{preset.label}</p>
              <img
                src={`${image.url}?${preset.params}`}
                alt={preset.label}
                className="w-full h-auto rounded"
              />
              <code className="text-xs text-neutral-500 mt-3 block break-all">
                {image.url}?{preset.params}
              </code>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
