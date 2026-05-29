import { NextResponse } from 'next/server'
import { AuraImage } from '@auraimage/sdk'

const CDN_URL = process.env.CDN_URL || 'https://cdn.auraimage.ai'

export async function POST() {
  try {
    const aura = new AuraImage({
      secretKey: process.env.AURAIMAGE_SECRET_KEY!,
      projectName: process.env.AURAIMAGE_PROJECT_NAME!
    })
    const token = await aura.signUpload()
    return NextResponse.json({ token, cdnUrl: CDN_URL })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to sign upload token' }, { status: 500 })
  }
}
