"use client"

export async function renderCertificateToBlob({ name, title, duration, serial, scale = 3 }:{ name:string, title:string, duration:string, serial:string, scale?:number }) {
  const width = 1200 * scale;
  const height = 850 * scale;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // --- 1. PREMIUM BACKGROUND & SECURITY PATTERN ---
  ctx.fillStyle = '#FCFBF7'; 
  ctx.fillRect(0, 0, width, height);

  // Security Guilloche Pattern (Subtle curved lines)
  ctx.globalAlpha = 0.03;
  ctx.strokeStyle = '#1a237e';
  for (let i = 0; i < width; i += 60 * scale) {
    ctx.beginPath();
    ctx.arc(i, height/2, 400 * scale, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.globalAlpha = 1.0;

  // --- 2. LUXURY BORDERS ---
  const pad = 40 * scale;
  // Thick Gold Frame
  ctx.strokeStyle = '#B8860B'; 
  ctx.lineWidth = 7 * scale;
  ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

  // Inner Navy Accent Border
  ctx.strokeStyle = '#1a237e';
  ctx.lineWidth = 1.5 * scale;
  const innerPad = pad + 15 * scale;
  ctx.strokeRect(innerPad, innerPad, width - innerPad * 2, height - innerPad * 2);

  // --- 3. HEADER & TOP BADGE ---
  ctx.textAlign = 'center';
  ctx.fillStyle = '#1a237e';
  ctx.font = `bold ${52 * scale}px "Georgia", serif`;
  ctx.fillText('PROOFNEX', width / 2, 135 * scale);
  
  ctx.fillStyle = '#B8860B';
  ctx.font = `bold ${12 * scale}px "Verdana"`;
  ctx.fillText('AN ISO 9001:2015 CERTIFIED ORGANIZATION', width / 2, 165 * scale);

  // --- 4. MAIN CONTENT ---
  ctx.fillStyle = '#444';
  ctx.font = `italic ${26 * scale}px "Georgia"`;
  ctx.fillText('This is to certify that', width / 2, 270 * scale);

  // NAME (Focus of the certificate)
  ctx.fillStyle = '#1a237e';
  ctx.font = `bold ${78 * scale}px "Times New Roman"`;
  ctx.fillText(name.toUpperCase(), width / 2, 360 * scale);

  // Decorative Golden Line
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2 * scale;
  ctx.beginPath();
  ctx.moveTo(width / 2 - 300 * scale, 385 * scale);
  ctx.lineTo(width / 2 + 300 * scale, 385 * scale);
  ctx.stroke();

  // Program Description
  ctx.fillStyle = '#555';
  ctx.font = `500 ${22 * scale}px "Georgia"`;
  ctx.fillText('has successfully demonstrated self-motivation and excellence in the', width / 2, 450 * scale);

  ctx.fillStyle = '#000';
  ctx.font = `bold ${42 * scale}px "Arial"`;
  ctx.fillText(title.toUpperCase(), width / 2, 505 * scale);

  ctx.fillStyle = '#B8860B';
  ctx.font = `600 ${20 * scale}px "Arial"`;
  ctx.fillText(`Internship Period: ${duration}`, width / 2, 555 * scale);

  // --- 5. FOOTER LAYOUT (RE-ALIGNED) ---
  const footerY = 740 * scale;

  // LEFT: Credential Box
  ctx.textAlign = 'left';
  ctx.fillStyle = '#1a237e';
  ctx.font = `bold ${14 * scale}px monospace`;
  ctx.fillText(`CREDENTIAL ID : ${serial}`, 100 * scale, footerY);
  ctx.fillStyle = '#666';
  ctx.font = `bold ${13 * scale}px sans-serif`;
  ctx.fillText(`ISSUE DATE    : ${new Date().toLocaleDateString('en-GB')}`, 100 * scale, footerY + 25 * scale);
  ctx.font = `normal ${11 * scale}px sans-serif`;
  ctx.fillText('VERIFY AT     : proofnex.com/verify', 100 * scale, footerY + 50 * scale);

  // RIGHT: Signature Section
  ctx.textAlign = 'center';
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 1 * scale;
  ctx.beginPath();
  ctx.moveTo(width - 330 * scale, footerY + 5 * scale);
  ctx.lineTo(width - 90 * scale, footerY + 5 * scale);
  ctx.stroke();
  
  ctx.fillStyle = '#1a237e';
  ctx.font = `bold ${17 * scale}px "Georgia"`;
  ctx.fillText('Authorized Signatory', width - 210 * scale, footerY + 30 * scale);
  ctx.fillStyle = '#B8860B';
  ctx.font = `italic ${12 * scale}px "Georgia"`;
  ctx.fillText('Director, ProofNex Foundation', width - 210 * scale, footerY + 50 * scale);

  // --- 6. QR CODE (Niche Shifted & Improved) ---
  const qrSize = 95 * scale;
  const qrX = width - 257 * scale; 
  const qrY = footerY - 115 * scale; // Moved down to be closer to signature
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${Math.round(qrSize)}x${Math.round(qrSize)}&data=${encodeURIComponent(serial)}`;

  return new Promise<Blob>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Clean white frame for QR
      ctx.shadowColor = 'rgba(0,0,0,0.05)';
      ctx.shadowBlur = 10 * scale;
      ctx.fillStyle = '#FFF';
      ctx.fillRect(qrX - 6 * scale, qrY - 6 * scale, qrSize + 12 * scale, qrSize + 12 * scale);
      ctx.shadowBlur = 0;

      ctx.drawImage(img, qrX, qrY, qrSize, qrSize);
      
      ctx.fillStyle = '#999';
      ctx.textAlign = 'center';
      ctx.font = `bold ${8 * scale}px sans-serif`;
      ctx.fillText('SCAN CREDENTIAL', qrX + qrSize/2, qrY - 12 * scale);

      canvas.toBlob((b) => b ? resolve(b) : reject(new Error('null')) , 'image/png');
    };
    img.src = qrUrl;
  });
}