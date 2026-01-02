"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { useCart } from "@/hooks/use-cart"
import CertificatePreview from "@/components/certificate-preview"
import { LoadingButton } from "@/components/loading-spinner"
import { CardSkeleton, HeroSkeleton } from "@/components/loading-skeleton"

type DurationOption = "1-month" | "2-months" | "custom"

const internships = [
  {
    slug: "frontend",
    title: "Frontend Developer Internship",
    description: "Modern web UI: React, accessibility, performance.",
  },
  {
    slug: "backend",
    title: "Backend Developer Internship",
    description: "APIs, databases, security, and reliability.",
  },
  {
    slug: "fullstack",
    title: "Full-Stack Developer Internship",
    description: "Ship end-to-end features with confidence.",
  },
  { slug: "datascience", title: "Data Science Internship", description: "Data wrangling, modeling, and insights." },
]

function priceFor(duration: DurationOption) {
  if (duration === "1-month") return 400
  if (duration === "2-months") return 600
  return 700
}
export default function HomePage() {
  const { addItem } = useCart()
  const [selectedDuration, setSelectedDuration] = useState<Record<string, DurationOption>>({})
  const [customHours, setCustomHours] = useState<Record<string, number>>({})
  const [customWeeks, setCustomWeeks] = useState<Record<string, number>>({})
  const [previewName, setPreviewName] = useState("Your Name")
  const [isLoading, setIsLoading] = useState(true)
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data?.user)
    })
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  const onAddToCart = async (slug: string) => {
    setAddingToCart(slug)
    await new Promise((resolve) => setTimeout(resolve, 800))

    const duration = selectedDuration[slug] || "1-month"
    const price = priceFor(duration)
    addItem({
      internship: slug,
      title: internships.find((i) => i.slug === slug)?.title || slug,
      duration,
      durationLabel:
        duration === "1-month"
          ? "1 Month"
          : duration === "2-months"
          ? "2 Months"
          : `${customHours[slug] || 0} hrs, ${customWeeks[slug] || 0} weeks`,
      price,
      customHours: duration === "custom" ? customHours[slug] || 0 : undefined,
      customWeeks: duration === "custom" ? customWeeks[slug] || 0 : undefined,
    })
    setAddingToCart(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-12 fade-in">
        <HeroSkeleton />
        <section className="space-y-6">
          <div className="space-y-1">
            <div className="h-6 w-32 bg-muted rounded-full skeleton" />
            <div className="h-8 w-64 bg-muted rounded skeleton" />
            <div className="h-4 w-96 bg-muted rounded skeleton" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-16 fade-in">
      <section className="relative overflow-hidden rounded-3xl border border-primary/10 shadow-2xl">
        {/* decorative blob background */}
        <div className="absolute -left-40 -top-40 opacity-30 pointer-events-none">
          <svg width="700" height="700" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(300,300)">
              <path d="M120,-156C152,-124,164,-74,166,-25C168,24,160,73,133,112C106,151,60,180,11,186C-38,192,-76,176,-121,151C-166,126,-219,93,-240,48C-262,3,-252,-54,-218,-92C-185,-130,-128,-149,-76,-170C-24,-191,23,-214,69,-203C115,-192,88,-187,120,-156Z" fill="#fde68a"/>
            </g>
          </svg>
        </div>

        <div className="relative grid gap-8 md:grid-cols-2 items-center p-10 md:p-14 bg-gradient-to-br from-background via-background/50 to-muted/10">
          <div className="space-y-6 z-10">
            <div className="inline-flex items-center gap-3 rounded-full bg-yellow-50 text-yellow-700 px-4 py-2 text-sm font-medium border border-yellow-100">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M12 2v6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 12h14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>ISO 9001:2015</span>
              <span className="opacity-60">•</span>
              <span>Trusted Worldwide</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Verified internship certificates, instantly verifiable
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl">
              ProofNex issues tamper-evident certificates with a public QR & serial for instant verification. Buy, download,
              and share your achievements with confidence.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button size="lg" className="flex items-center gap-3 bg-gradient-to-r from-primary to-accent text-white shadow-lg rounded-full px-6 py-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-90"><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Browse Internships
              </Button>

              {isLoggedIn ? (
                <Button variant="outline" size="lg" className="flex items-center gap-3 rounded-full px-6 py-3" asChild>
                  <a href="/checkout">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Checkout
                  </a>
                </Button>
              ) : (
                <Button variant="outline" size="lg" className="flex items-center gap-3 rounded-full px-6 py-3" asChild>
                  <a href="/login">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-80"><path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Login to Checkout
                  </a>
                </Button>
              )}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <img src="/images/placeholder-user.jpg" alt="student" className="w-12 h-12 rounded-full border" />
              <div>
                <div className="text-sm font-semibold">"Professional and fast — my certificate was verified instantly!"</div>
                <div className="text-xs text-muted-foreground">— A. Sharma, Frontend Intern</div>
              </div>
            </div>
          </div>

          {/* Hero image with subtle frame */}
          <div className="relative z-10">
            <div className="rounded-2xl overflow-hidden border border-primary/10 shadow-2xl">
              <img
                src="/images/hero-certificate.jpg"
                alt="Sample certificate preview on desk"
                className="w-full h-full object-cover md:object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section id="internships" className="space-y-8">
        <div className="text-center space-y-4">
          <Badge className="rounded-full px-4 py-2 bg-primary/10 text-primary border-primary/20">
            ISO 9001:2015 Certified
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Choose Your Internship</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add certificates to cart and purchase instantly with our secure checkout.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {internships.map((intern) => {
            const duration = selectedDuration[intern.slug] || "1-month"
            const price = priceFor(duration)
            const isAddingThisItem = addingToCart === intern.slug

            return (
              <Card
                key={intern.slug}
                className="rounded-2xl border-primary/10 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/20"
              >
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between text-xl">
                    <span className="text-balance">{intern.title}</span>
                    <span className="text-primary font-bold text-2xl">₹{price}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground leading-relaxed">{intern.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Duration</Label>
                      <Select
                        value={duration}
                        onValueChange={(v: DurationOption) => setSelectedDuration((s) => ({ ...s, [intern.slug]: v }))}
                      >
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-month">1 Month (₹400)</SelectItem>
                          <SelectItem value="2-months">2 Months (₹600)</SelectItem>
                          <SelectItem value="custom">Custom (₹700)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {duration === "custom" && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Custom Details</Label>
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            type="number"
                            min={0}
                            placeholder="Hours"
                            value={customHours[intern.slug] || ""}
                            onChange={(e) => setCustomHours((s) => ({ ...s, [intern.slug]: Number(e.target.value) }))}
                            className="rounded-xl"
                          />
                          <Input
                            type="number"
                            min={0}
                            placeholder="Weeks"
                            value={customWeeks[intern.slug] || ""}
                            onChange={(e) => setCustomWeeks((s) => ({ ...s, [intern.slug]: Number(e.target.value) }))}
                            className="rounded-xl"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <LoadingButton
                      onClick={() => onAddToCart(intern.slug)}
                      isLoading={isAddingThisItem}
                      className="rounded-xl flex-1"
                    >
                      {isAddingThisItem ? "Adding..." : "Add to Cart"}
                    </LoadingButton>
                    <Button variant="outline" className="rounded-xl bg-transparent" asChild>
                      <a href="/checkout">Checkout</a>
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Certificate Preview</Label>
                    <div className="rounded-xl overflow-hidden">
                      <CertificatePreview
                        name={previewName || "Your Name"}
                        internshipTitle={intern.title}
                        durationLabel={
                          duration === "custom"
                            ? `${customHours[intern.slug] || 0} hrs, ${customWeeks[intern.slug] || 0} weeks`
                            : duration === "1-month"
                              ? "1 Month"
                              : "2 Months"
                        }
                        serial="QT-PREVIEW-00000"
                        qrPayload="https://proofnex.example/verify/QT-PREVIEW-00000"
                        isPreview
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>





      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl p-8 bg-gradient-to-br from-yellow-50 to-white border border-yellow-100 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-xl bg-yellow-500 flex items-center justify-center text-white shadow-md mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M12 2l7 4v5c0 5-3 9-7 11-4-2-7-6-7-11V6l7-4z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">ISO Certified</h3>
            <p className="text-muted-foreground">Our certificates follow ISO 9001:2015 guidelines for consistent quality and trusted verification across the platform.</p>
          </div>
          <div className="mt-6">
            <a href="/how-it-works" className="text-sm text-yellow-600 font-medium hover:underline">Learn how certification works →</a>
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-gradient-to-br from-sky-50 to-white border border-sky-100 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-xl bg-sky-500 flex items-center justify-center text-white shadow-md mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M3 3h6v6H3V3zM15 3h6v6h-6V3zM3 15h6v6H3v-6zM11 11h2v2h-2v-2zM17 17h4v4h-4v-4z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">QR & Serial</h3>
            <p className="text-muted-foreground">Each certificate includes a scannable QR code and a permanent serial number for instant public verification and tamper evidence.</p>
          </div>
          <div className="mt-6">
            <a href="/verify" className="text-sm text-sky-600 font-medium hover:underline">Try verifying a sample →</a>
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-16 h-16 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="white" strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Instant Issuance</h3>
            <p className="text-muted-foreground">Purchase and receive certificates instantly in your profile — download ready PNGs that are shareable across platforms.</p>
          </div>
          <div className="mt-6">
            <a href="/checkout" className="text-sm text-emerald-600 font-medium hover:underline">Get a certificate now →</a>
          </div>
        </div>

      </section>

      <section className="grid gap-8 md:grid-cols-3">
        <div className="rounded-3xl p-8 bg-gradient-to-br from-primary/10 to-white border border-primary/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-lg bg-primary flex items-center justify-center text-white shadow-md mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2v6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 12h14" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Live Mentor Support</h3>
            <p className="text-muted-foreground">Get doubts resolved quickly with live mentor guidance.</p>
          </div>
          <div className="mt-6">
            <a href="#" className="text-sm text-primary font-medium hover:underline">Connect with mentors →</a>
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-gradient-to-br from-accent/10 to-white border border-accent/20 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-lg bg-accent flex items-center justify-center text-white shadow-md mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 7h18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/><path d="M3 12h18" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Live Classes</h3>
            <p className="text-muted-foreground">Learn in real-time with structured, interactive sessions.</p>
          </div>
          <div className="mt-6">
            <a href="#" className="text-sm text-accent font-medium hover:underline">See upcoming classes →</a>
          </div>
        </div>

        <div className="rounded-3xl p-8 bg-gradient-to-br from-primary/5 to-white border border-primary/10 shadow-lg flex flex-col justify-between">
          <div>
            <div className="w-14 h-14 rounded-lg bg-emerald-500 flex items-center justify-center text-white shadow-md mb-4">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round"/></svg>
            </div>
            <h3 className="text-2xl font-bold mb-2">Hands-on Experience</h3>
            <p className="text-muted-foreground">Practice with assignments designed to build real skills.</p>
          </div>
          <div className="mt-6">
            <a href="#" className="text-sm text-emerald-600 font-medium hover:underline">Explore assignments →</a>
          </div>
        </div>
      </section>

      {/* Certificate Gallery removed per request */}

      <section className="rounded-3xl bg-gradient-to-br from-white via-primary/5 to-accent/10 border border-primary/20 p-0 md:p-0 text-center shadow-2xl max-w-2xl mx-auto my-12">
        <div className="flex flex-col items-center gap-0 p-0">
          <div className="w-full rounded-t-3xl bg-gradient-to-r from-primary/80 to-accent/80 py-6 flex flex-col items-center justify-center shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#fff"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.333A8.333 8.333 0 1120.333 12 8.343 8.343 0 0112 20.333z" fill="#2563eb"/><path d="M12 6.667a5.333 5.333 0 100 10.666 5.333 5.333 0 000-10.666zm0 9.333a4 4 0 110-8 4 4 0 010 8z" fill="#2563eb"/></svg>
              <h2 className="text-3xl font-bold text-primary-foreground tracking-tight">Contact & Support</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
              <a href="mailto:contact@proofnex.example" className="flex items-center gap-2 text-base font-semibold text-white hover:underline">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11z" stroke="#2563eb" strokeWidth="1.5"/><path d="M22 6.5l-10 7-10-7" stroke="#2563eb" strokeWidth="1.5"/></svg>
                contact@proofnex.example
              </a>
              <span className="hidden md:inline text-white opacity-60">|</span>
              <a href="https://wa.me/919921080226" target="_blank" rel="noopener" className="flex items-center gap-2 text-base font-semibold text-white hover:underline">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.205 5.077 4.368.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
                WhatsApp: +91 9921080226
              </a>
            </div>
          </div>
          <div className="px-6 py-8 md:px-12 bg-white rounded-b-3xl w-full">
            <ul className="text-sm text-muted-foreground mt-2 space-y-2 list-disc list-inside text-left mx-auto max-w-xl">
              <li><strong>Payments:</strong> All payments are final and non-refundable unless required by law.</li>
              <li><strong>Community Guidelines:</strong> Be respectful. Harassment, hate speech, or disruptive behaviour will lead to removal.</li>
              <li><strong>Copyright:</strong> Course content and certificates are the intellectual property of ProofNex. Unauthorized redistribution is prohibited.</li>
            </ul>
            <div className="mt-8 flex justify-center">
              <Button size="lg" className="rounded-full px-8 py-3 text-base font-semibold shadow-md" asChild>
                <a href="mailto:contact@proofnex.example">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
