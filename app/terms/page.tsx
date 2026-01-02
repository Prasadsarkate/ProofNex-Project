export const metadata = {
  title: 'Terms & Conditions - ProofNex',
  description: 'Terms and conditions for using ProofNex services.'
}

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Terms & Conditions</h1>
      <p className="text-sm text-muted-foreground mb-3">
  By using ProofNex services, you agree to the following terms and conditions. These
        govern your access to our website and issuance and verification of certificates.
      </p>
      <ul className="list-disc ml-6 text-sm space-y-2">
        <li>Certificates issued are subject to verification and may be revoked in case of fraud.</li>
        <li>Users are responsible for keeping their account credentials secure.</li>
        <li>We reserve the right to modify these terms; continued use implies acceptance.</li>
      </ul>
    </div>
  )
}
