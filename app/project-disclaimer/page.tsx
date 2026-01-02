export const metadata = {
  title: 'Project Disclaimer - Demo',
  description: 'Disclaimer that this site uses the ProofNex name only for testing/demo purposes.'
}

export default function ProjectDisclaimerPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto py-12 px-4">
        <div className="rounded-2xl shadow-lg bg-white/90 border border-primary/10 overflow-hidden">
          <div className="bg-gradient-to-r from-primary/80 to-accent/60 px-6 py-5 flex items-center gap-3">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#fff"/><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18.333A8.333 8.333 0 1120.333 12 8.343 8.343 0 0112 20.333z" fill="#2563eb"/><path d="M12 6.667a5.333 5.333 0 100 10.666 5.333 5.333 0 000-10.666zm0 9.333a4 4 0 110-8 4 4 0 010 8z" fill="#2563eb"/></svg>
            <h1 className="text-2xl font-bold text-white tracking-tight">Project Disclaimer</h1>
          </div>
          <div className="px-6 py-7 flex flex-col gap-4">
            <div className="text-muted-foreground text-sm mb-2">
              <p>This is a demo project for showcasing digital certificate generation and verification. All data is for demonstration purposes only.</p>
            </div>
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path d="M2 6.5A2.5 2.5 0 014.5 4h15A2.5 2.5 0 0122 6.5v11A2.5 2.5 0 0119.5 20h-15A2.5 2.5 0 012 17.5v-11z" stroke="#2563eb" strokeWidth="1.5"/><path d="M22 6.5l-10 7-10-7" stroke="#2563eb" strokeWidth="1.5"/></svg>
                <span>For support, email <a href="mailto:contact@proofnex.example" className="underline">contact@proofnex.example</a></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
