import { NextResponse } from 'next/server'
import { FALLBACK_POSTS, InstagramPost } from '@/config/instagram'

export const revalidate = 3600 // Cache for 1 hour (ISR)

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN || process.env.META_ACCESS_TOKEN

  if (!token) {
    return NextResponse.json({
      success: true,
      source: 'curated_fallback',
      posts: FALLBACK_POSTS
    })
  }

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=8&access_token=${token}`,
      { next: { revalidate: 3600 } }
    )

    if (!res.ok) {
      console.warn('Instagram Graph API returned status:', res.status)
      return NextResponse.json({
        success: true,
        source: 'curated_fallback',
        posts: FALLBACK_POSTS
      })
    }

    const data = await res.json()

    if (!data.data || !Array.isArray(data.data) || data.data.length === 0) {
      return NextResponse.json({
        success: true,
        source: 'curated_fallback',
        posts: FALLBACK_POSTS
      })
    }

    const posts: InstagramPost[] = data.data.map((item: any, idx: number) => ({
      id: item.id || `live-${idx}`,
      img: item.media_type === 'VIDEO' ? (item.thumbnail_url || item.media_url) : item.media_url,
      link: item.permalink || 'https://www.instagram.com/waldorftrekanpv/',
      caption: item.caption ? item.caption.slice(0, 140) + '...' : 'Colegio Waldorf Trekan en Puerto Varas.',
      tag: 'Instagram Live'
    }))

    return NextResponse.json({
      success: true,
      source: 'live_api',
      posts
    })
  } catch (err: any) {
    console.error('Error fetching live Instagram posts:', err.message)
    return NextResponse.json({
      success: true,
      source: 'curated_fallback',
      posts: FALLBACK_POSTS
    })
  }
}
