import CertificatePreview from '@/components/certificate-preview'

type Props = {
	params: {
		serial: string
	}
}

export default function Page({ params }: Props) {
	const { serial } = params

	// Minimal server-rendered certificate page.
	// In the future you may fetch certificate details from your API here.
	return (
		<div className="max-w-5xl mx-auto px-4 py-8">
			<CertificatePreview
				name={serial}
				internshipTitle={"Internship"}
				durationLabel={"1 Month"}
				serial={serial}
				qrPayload={`/verify?serial=${encodeURIComponent(serial)}`}
				showActions={true}
				isPreview={false}
			/>
		</div>
	)
}
