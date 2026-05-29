import Upload from './upload'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 p-8">
      <h1 className="text-2xl font-semibold mb-6">AuraImage Next.js Example</h1>
      <Upload />
    </div>
  )
}
