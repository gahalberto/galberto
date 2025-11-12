'use client'

import { useEffect } from 'react'

interface BlogViewTrackerProps {
  postId: string
}

export function BlogViewTracker({ postId }: BlogViewTrackerProps) {
  useEffect(() => {
    // Track view (opcional - pode ser feito via API route se necessário)
    // Por enquanto, apenas log para desenvolvimento
    if (process.env.NODE_ENV === 'development') {
      console.log('Blog post viewed:', postId)
    }
  }, [postId])

  return null
}

