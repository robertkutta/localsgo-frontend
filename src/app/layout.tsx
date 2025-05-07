import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import HeaderLayout from './HeaderLayout'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500'],
  variable: '--font-dm-sans'
})

export const metadata: Metadata = {
  title: 'LocalsGo',
  description: 'Find your next trip.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const clerkLook = {
    elements: {
      userButtonBox: {
        color: 'white',
        fontSize: '14px',
        fontWeight: '200'
      },
      formButtonPrimary: {
        backgroundColor: '#4F46E5',
        '&:hover': { backgroundColor: '#4338CA' }
      }
    }
  }

  return (
    <ClerkProvider appearance={clerkLook} afterSignOutUrl="/">
      <html lang="en" className={dmSans.variable}>
        <body className={dmSans.className}>
          <HeaderLayout>{children}</HeaderLayout>
        </body>
      </html>
    </ClerkProvider>
  )
}