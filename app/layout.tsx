import React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"
import Logo from '@/components/logo'
import { Suspense } from "react"
import ClientHeader from '@/components/client-header'

export const metadata: Metadata = {
  title: "ProofNex Certificates",
  description: "ISO-certified, QR-verifiable internship certificates by ProofNex.",
  generator: "v0.app",
}

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const logoSrc = process.env.NODE_ENV === 'development' ? '/images/proofnex-logo-new.jpg' : '/images/proofnex-logo.jpg';
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} antialiased`}>
        {/* Announcement bar */}
        <div className="bg-gradient-to-r from-primary via-blue-600 to-primary text-primary-foreground text-center text-xs sm:text-sm py-2 font-semibold tracking-wide shadow-md border-b border-blue-200/40">
          Best Internship Certificates • ISO 9001:2015 • QR & Serial Verification Included
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <header className="bg-white/90 dark:bg-background/90 shadow-lg border-b border-border sticky top-0 z-30 backdrop-blur-md">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                {/* Use Logo component to provide robust fallback handling */}
                <span className="rounded-full bg-primary/10 p-1.5 shadow-md border border-primary/20 group-hover:scale-105 transition-transform">
                  <Logo className="h-10 w-10" />
                </span>
                <span className="font-extrabold text-2xl text-primary tracking-tight drop-shadow-sm group-hover:text-blue-700 transition-colors">ProofNex</span>
              </Link>
              <ClientHeader />
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
          <footer className="border-t bg-gradient-to-br from-primary/5 via-accent/10 to-white pt-10 pb-4 px-0 mt-12">
            <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-3 items-start">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 font-bold text-xl text-primary">
                  <svg width='28' height='28' fill='none' viewBox='0 0 24 24'><rect width='24' height='24' rx='12' fill='#fff'/><path d='M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.333A8.333 8.333 0 1120.333 12 8.343 8.343 0 0112 20.333z' fill='#2563eb'/><path d='M12 6.667a5.333 5.333 0 100 10.666 5.333 5.333 0 000-10.666zm0 9.333a4 4 0 110-8 4 4 0 010 8z' fill='#2563eb'/></svg>
                  ProofNex
                </div>
                <p className="text-sm text-muted-foreground max-w-xs">
                  ISO-certified, digitally verifiable certificates for modern tech internships.
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <a href="mailto:contact@proofnex.example" className="hover:underline" title="Email">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11z" stroke="#2563eb" strokeWidth="1.5"/><path d="M22 6.5l-10 7-10-7" stroke="#2563eb" strokeWidth="1.5"/></svg>
                  </a>
                  <a href="https://wa.me/919921080226" target="_blank" rel="noopener" className="hover:underline" title="WhatsApp">
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.205 5.077 4.368.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
                  </a>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Trust & Security</div>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• ISO 9001:2015 Certified</li>
                  <li>• Unique QR & Serial on every certificate</li>
                  <li>• Public verification on our website</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold mb-1">Quick Links</div>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li><Link href="/#internships" className="hover:underline">Browse Internships</Link></li>
                  <li><Link href="/checkout" className="hover:underline">Checkout</Link></li>
                  <li><Link href="/verify" className="hover:underline">Verify Certificate</Link></li>
                  <li><Link href="/refund-policy" className="hover:underline">Refund Policy</Link></li>
                  <li><Link href="/terms" className="hover:underline">Terms &amp; Conditions</Link></li>
                  <li><Link href="/privacy" className="hover:underline">Privacy Policy</Link></li>
                  <li><Link href="/how-it-works" className="hover:underline">How it works</Link></li>
                  <li><Link href="/contact" className="hover:underline">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-primary/10 mt-8 pt-4 text-center text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} ProofNex. All rights reserved. Made with <span className="text-red-500">♥</span> in India.
            </div>
          </footer>
        </Suspense>
      </body>
    </html>
  )
}
