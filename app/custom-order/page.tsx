import React from 'react'
import PersonalImageUploadSection from '@/components/home/PersonalImageUploadSection'

export const metadata = {
  title: 'Custom Order & Personal Image Print Request | Kagzify Studio',
  description: 'Upload any personal image, 3D mock-up, or bespoke product specification for custom stickers, rigid packaging boxes, mugs, and corporate gifts. Rapid quote within 4 hours.',
}

export default function CustomOrderPage() {
  return (
    <div className="bg-paper-50 dark:bg-stone-950 min-h-screen py-10 transition-colors">
      <PersonalImageUploadSection standalone={true} />
    </div>
  )
}
