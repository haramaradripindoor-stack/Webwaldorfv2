'use server'

import { createClient } from '@supabase/supabase-js'

export async function saveHomepageContent(content: any) {
  // Use Service Role Key to bypass RLS for admin operations
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const { data, error } = await supabase
    .from('homepage_content')
    .upsert({
      id: 1,
      hero_section: content.hero_section,
      text_reveal: content.text_reveal,
      masonry_gallery: content.masonry_gallery,
      updated_at: new Date().toISOString()
    })

  if (error) {
    console.error('Error saving homepage content via Server Action:', error)
    return { success: false, error: error.message }
  }

  return { success: true }
}
