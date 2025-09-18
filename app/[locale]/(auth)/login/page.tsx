import { LoginForm } from '@/src/all-pages/exports'
import { getIsMobile } from '@/src/shared/hooks/use-mobile-server'
import React from 'react'

export default async function LoginPage() {
  const isMobile = await getIsMobile()
  
  return (
    <div className="flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div 
        className="absolute inset-0 opacity-5 dark:opacity-5"
        style={{
          backgroundImage: `url(${isMobile ? '/logo-dark.svg' : '/logo-full-dark.svg'})`,
          backgroundSize: isMobile ? '300px 300px' : '900px 700px',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  )
}