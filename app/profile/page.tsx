import { createServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import CertificatePreview from "@/components/certificate-preview"
import ProfileForm from "@/components/profile-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CertificateActions } from "@/components/certificate-actions"

type Certificate = {
  id: string
  serial: string
  internship: string
  duration_label: string
  custom_hours: number | null
  custom_weeks: number | null
  price: number
  full_name: string
  issued_at: string
}

export default async function ProfilePage() {
  const supabase = await createServerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Fetch user profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("full_name,email,age,gender,id")
    .eq("id", user.id)
    .maybeSingle();

  // Fetch certificates
  const { data: certificates, error: certsError } = await supabase
    .from("certificates")
    .select("*")
    .order("issued_at", { ascending: false })

  const safeCerts = certificates || []
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-12 px-2">
  <div className="max-w-full w-full mx-auto space-y-20 px-2 sm:px-6">
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-extrabold text-blue-900 drop-shadow-sm">Profile Dashboard</h1>
          <p className="text-blue-700 text-lg">Manage your account and certificates in one beautiful place.</p>
        </div>
  <div className="max-w-full w-full mx-auto">
          <ProfileForm
            initialName={profileData?.full_name ?? null}
            initialEmail={profileData?.email ?? null}
            initialAge={profileData?.age ?? null}
            initialGender={profileData?.gender ?? null}
            initialUserId={profileData?.id ?? null}
          />
        </div>
  <div className="space-y-6 max-w-full w-full mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
              🎓 Your Certificates
            </h2>
            {safeCerts.length > 0 && (
              <div className="text-base text-blue-700 bg-blue-100 rounded-full px-4 py-1 shadow-sm">
                {safeCerts.length} certificate{safeCerts.length > 1 ? "s" : ""} earned
              </div>
            )}
          </div>

          {safeCerts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-28 h-28 mx-auto bg-gradient-to-br from-blue-200/40 to-blue-400/20 rounded-full flex items-center justify-center mb-6 shadow-xl">
                <svg className="w-14 h-14 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-2 text-blue-700">No certificates yet</h3>
              <p className="text-blue-600 mb-6 text-base">Start your learning journey and earn your first certificate</p>
              <Link href="/">
                <Button size="lg" className="rounded-full px-8 py-3 shadow-md bg-gradient-to-r from-blue-500 to-blue-400 text-white">Browse Certificates</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {safeCerts.map((cert: Certificate) => (
                <div
                  key={cert.id}
                  className="rounded-3xl border border-blue-200 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white via-blue-50 to-blue-100 p-8 flex flex-col gap-6"
                >
                  <CertificatePreview
                    name={cert.full_name}
                    internshipTitle={cert.internship}
                    durationLabel={cert.duration_label}
                    serial={cert.serial}
                    qrPayload={`${process.env.NEXT_PUBLIC_SITE_URL || ""}/verify?serial=${encodeURIComponent(cert.serial)}`}
                    showActions={true}
                    isPreview={true}
                  />
                  <div className="w-full flex flex-col gap-4">
                    <div className="text-center">
                      <h3 className="font-semibold text-blue-900 text-lg mb-1">{cert.internship}</h3>
                      <p className="text-sm text-blue-700">{cert.duration_label}</p>
                    </div>
                    <CertificateActions serial={cert.serial} className="w-full" />
                    <div className="flex justify-between items-center text-sm text-blue-600 pt-2 border-t">
                      <div className="font-mono">#{cert.serial}</div>
                      <div>{new Date(cert.issued_at).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}