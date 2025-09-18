
import React from 'react'

import { InviteForm } from '@/src/all-pages/exports'

export default async function InvitePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>
}) {
  const params = await searchParams
  const token = params?.token || ''

  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <InviteForm token={token} />
      </div>
    </div>
  )
}


