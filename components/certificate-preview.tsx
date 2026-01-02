"use client"

import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { isLoggedInSync } from "@/lib/supabase/auth-client"
import { Button } from "./ui/button"

const LoadingSpinner = ({ size = "md" }: { size?: "sm" | "md" | "lg" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }
  
  return (
    <div className={`animate-spin rounded-full border-2 border-muted border-t-primary ${sizeClasses[size]}`} />
  )
}

const Download = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
)

const Share2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"
    />
  </svg>
)

const Eye = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
)

const Award = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
)

const Star = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

type Props = {
  name: string
  internshipTitle: string
  durationLabel: string
  serial: string
  qrPayload: string
  isPreview?: boolean
  showActions?: boolean
}

export default function CertificatePreview({
  name,
  internshipTitle,
  durationLabel,
  serial,
  qrPayload,
  isPreview = false,
  showActions = false,
}: Props) {
  // Compact mode for small previews (used in cards) — reduce sizes/padding for certificate vibe
  const compact = Boolean(isPreview)

  // For compact mode, use a larger aspect ratio, more padding, and higher min height for better visibility
  const previewContainerClass = compact
    ? "relative w-full h-full aspect-[21/9] max-w-[1400px] mx-auto flex flex-col justify-between bg-background rounded-2xl border-2 border-blue-300 shadow-2xl min-h-[475px] p-6 sm:p-10 overflow-hidden box-border"
    : "relative bg-background rounded-3xl border-2 border-border shadow-2xl overflow-hidden box-border"
  function normalizeInternshipTitle(raw: string) {
    if (!raw) return 'Internship'
    const s = raw.toLowerCase()
    if (s.includes('frontend')) return 'Frontend Developer Internship'
    if (s.includes('front-end')) return 'Frontend Developer Internship'
    if (s.includes('backend')) return 'Backend Developer Internship'
    if (s.includes('back-end')) return 'Backend Developer Internship'
    if (s.includes('full') && s.includes('stack')) return 'Full-Stack Developer Internship'
    if (s.includes('fullstack') || s.includes('full-stack')) return 'Full-Stack Developer Internship'
    if (s.includes('data')) return 'Data Science Internship'
    if (s.includes('devops')) return 'DevOps Internship'
    if (s.includes('ui')) return 'UI/UX Internship'
    if (s.includes('intern')) return raw
    return raw + ' Internship'
  }

  const displayTitle = normalizeInternshipTitle(internshipTitle || '')
  // QR code is now rendered locally for CORS-safe downloads

  // Removed: handleDownload and all button logic

  return (
    <div
      data-certificate={serial}
      className={previewContainerClass}
      style={{ background: '#fff' }}
    >
      {/* Elegant header with golden accent */}
      { !compact && <div className="h-2 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600" /> }

  <div className={compact ? "p-2 sm:p-3 bg-gradient-to-br from-background via-background to-muted/10 flex flex-col justify-center h-full w-full overflow-hidden" : "p-6 md:p-12 bg-gradient-to-br from-background via-background to-muted/20 overflow-hidden"}>
        {/* Header section */}
  <div className={compact ? "flex flex-row items-center justify-between mb-2 gap-2 w-full flex-nowrap min-w-0" : "flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4 flex-nowrap min-w-0"}>
          <div className="flex flex-row items-center gap-2 min-w-[120px] min-w-0 max-w-full overflow-hidden">
            {/* Seal */}
            <div className="relative group/seal flex items-center">
              <div className={compact ? "w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-md border border-yellow-300/50" : "w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg border-4 border-yellow-300/50"}>
                <Award className={compact ? "w-4 h-4 sm:w-5 sm:h-5 text-white" : "w-6 h-6 md:w-8 md:h-8 text-white"} />
              </div>
              {!compact && <div className="absolute inset-0 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 blur group-hover/seal:scale-110 transition-transform duration-300" />}
            </div>
            {/* ProofNex brand left-aligned */}
            <h1 className={compact ? "text-base sm:text-lg font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent ml-2 truncate max-w-[180px]" : "text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent ml-3 truncate max-w-[350px]"}>
              ProofNex
            </h1>
          </div>
          <div className="flex flex-row items-center gap-4 min-w-0">
            {/* QR Code */}
            <div className="relative flex items-center max-w-full">
              <div className={compact ? "w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white border shadow-md p-0.5 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center max-w-full" : "w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white border-2 border-muted shadow-lg p-2 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center max-w-full"}>
                <QRCodeCanvas value={qrPayload || serial} size={compact ? 44 : 72} level="H" includeMargin={false} />
              </div>
            </div>
          </div>
        </div>

        {/* Certificate title */}
        {/* Centered stars and ISO text below header */}
        <div className={compact ? "flex flex-col items-center justify-center mb-2 mt-1" : "flex flex-col items-center justify-center mb-6 mt-2"}>
          <div className="flex gap-1 items-center mb-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={compact ? "w-3 h-3 text-yellow-500" : "w-4 h-4 text-yellow-500"} />
            ))}
          </div>
          <span className={compact ? "text-[10px] text-muted-foreground font-medium" : "text-base text-muted-foreground font-medium"}>
            ISO 9001:2015 Certified • Trusted Digital Verification
          </span>
        </div>
        <div className={compact ? "text-center mb-2" : "text-center mb-6"}>
          <h2 className={compact ? "text-xs font-semibold text-muted-foreground italic mb-1" : "text-lg md:text-xl font-semibold text-muted-foreground italic mb-2"}>
            CERTIFICATE OF INTERNSHIP
          </h2>
          <div className={compact ? "w-20 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto" : "w-28 h-px bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto"} />
        </div>

        {/* Main content */}
        <div className={compact ? "text-center space-y-2 mb-3" : "text-center space-y-6 mb-8"}>
          <p className={compact ? "text-xs text-muted-foreground font-medium" : "text-lg text-muted-foreground font-medium"}>
            This is to certify that
          </p>
          
          <div className="relative">
            <h3 className={compact ? "text-base sm:text-lg font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight truncate max-w-full" : "text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight truncate max-w-full"}>
              {name}
            </h3>
            { !compact && <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" /> }
          </div>
          
          <p className={compact ? "text-xs text-muted-foreground font-medium" : "text-lg text-muted-foreground font-medium"}>
            has successfully completed the comprehensive
          </p>
          
          <h4 className={compact ? "text-sm sm:text-base font-bold text-primary leading-tight" : "text-2xl md:text-3xl font-bold text-primary leading-tight"}>
            {displayTitle}
          </h4>
          
          <p className={compact ? "text-xs text-muted-foreground italic" : "text-base text-muted-foreground italic"}>
            with outstanding performance and dedication
          </p>
        </div>

        {/* Footer */}
        <div className={compact ? "border-t pt-2" : "border-t pt-6"}>
          <div className={compact ? "flex flex-col md:flex-row justify-between items-center gap-2 text-[10px]" : "flex flex-col md:flex-row justify-between items-center gap-4 text-sm"}>
            <div className={compact ? "text-left space-y-0.5" : "text-left space-y-1"}>
              <div className={compact ? "flex items-center gap-1 font-mono font-medium text-[10px]" : "flex items-center gap-2 font-mono font-medium"}>
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                Certificate ID: <span className="text-primary font-bold">{serial}</span>
              </div>
              <div className="text-muted-foreground text-[10px]">
                Issue Date: {new Date().toLocaleDateString()}
              </div>
              {/* Small duration label shown in footer for clarity */}
              <div className="text-xxs text-muted-foreground italic">{durationLabel}</div>
              <div className="text-muted-foreground text-[10px]">
                {(() => {
                  const origin = typeof window !== "undefined" ? window.location.origin : ""
                  return (
                    <span>
                      Verify at: {isPreview ? "proofnex.com/verify" : `${origin}/verify`}
                    </span>
                  )
                })()}
              </div>
            </div>
            <div className={compact ? "text-right space-y-0.5 text-[10px]" : "text-right space-y-1"}>
              <div className="font-semibold">Authorized by ProofNex</div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                Digitally Verified & Secured
              </div>
              <div className="flex items-center gap-1 text-green-600 text-[10px]">
                <Award className="w-3 h-3" />
                Authentic Certificate
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
