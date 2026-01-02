export const metadata = {
  title: 'Contact - ProofNex',
  description: 'Contact information for ProofNex support and business inquiries.'
}

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-2xl shadow-lg bg-white/90 border border-primary/10 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/80 to-accent/60 px-6 py-5 flex items-center gap-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#fff"/><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11z" stroke="#2563eb" strokeWidth="1.5"/><path d="M22 6.5l-10 7-10-7" stroke="#2563eb" strokeWidth="1.5"/></svg>
            <h1 className="text-2xl font-bold text-white tracking-tight">Contact & Support</h1>
          </div>
          <div className="px-6 py-7 flex flex-col gap-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <div className="font-semibold mb-1 text-primary">General Support</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11z" stroke="#2563eb" strokeWidth="1.5"/><path d="M22 6.5l-10 7-10-7" stroke="#2563eb" strokeWidth="1.5"/></svg>
                  <span>Email: <a href="mailto:contact@proofnex.example" className="underline">contact@proofnex.example</a></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#25D366"/><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.1 3.205 5.077 4.368.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.007-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" fill="#fff"/></svg>
                  <span>WhatsApp: <a href="https://wa.me/919921080226" className="underline">+91 99210 80226</a></span>
                </div>
                <div className="text-sm text-muted-foreground mb-1">Business Hours: 10am – 7pm IST</div>
              </div>
              <div className="flex-1">
                <div className="font-semibold mb-1 text-primary">Business Inquiries</div>
                <div className="text-sm text-muted-foreground mb-1">For partnerships, bulk certificates, or custom solutions:</div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.333A8.333 8.333 0 1120.333 12 8.343 8.343 0 0112 20.333z" fill="#2563eb"/><path d="M12 6.667a5.333 5.333 0 100 10.666 5.333 5.333 0 000-10.666zm0 9.333a4 4 0 110-8 4 4 0 010 8z" fill="#2563eb"/></svg>
                  <span>business@proofnex.example</span>
                </div>
              </div>
            </div>
            <div className="border-t pt-6 mt-2">
              <div className="font-semibold text-primary mb-2">Quick Help & FAQ</div>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <a href="/refund-policy" className="underline">Refund Policy</a></li>
                <li>• <a href="/how-it-works" className="underline">How it works</a></li>
                <li>• <a href="/verify" className="underline">How to verify a certificate?</a></li>
                <li>• <a href="/privacy" className="underline">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
