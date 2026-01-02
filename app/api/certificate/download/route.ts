import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const serial = url.searchParams.get('serial')
  if (!serial) {
    return NextResponse.json({ error: 'serial query param is required' }, { status: 400 })
  }

  // Determine origin to visit the running app
  const proto = request.headers.get('x-forwarded-proto') || url.protocol.replace(':', '') || 'http'
  const host = request.headers.get('host')
  if (!host) return NextResponse.json({ error: 'host header missing' }, { status: 400 })
  const origin = `${proto}://${host}`

  // Try to dynamically require Playwright at runtime so the Next bundler
  // doesn't try to resolve/playwright during build. Playwright is optional.
  let playwright: any
  // Spawn a child Node process running a small script that uses Playwright.
  // This avoids bundling Playwright into the Next runtime.
  const childProcess = await import('child_process');
  const script = require('path').join(process.cwd(), 'scripts', 'screenshot_element.js');
  const selector = `[data-certificate="${serial}"]`;

  try {
  const proc = childProcess.spawn(process.execPath, [script, origin, serial], { stdio: ['ignore', 'pipe', 'pipe'] });

    // collect stderr for diagnostics
    let stderr = '';
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });

    const chunks: Buffer[] = [];
    for await (const chunk of proc.stdout) {
      chunks.push(Buffer.from(chunk));
    }

    const exit = await new Promise<number>((resolve) => proc.on('close', resolve));
    if (exit !== 0) {
      console.error('screenshot script failed:', stderr);
      return NextResponse.json({ error: 'screenshot script failed', details: stderr }, { status: 500 });
    }

    const buffer = Buffer.concat(chunks);
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="certificate-${serial}.png"`,
      },
    });
  } catch (err: any) {
    console.error('Child process screenshot failed:', err && err.stack ? err.stack : err);
    return NextResponse.json({ error: 'Child process screenshot failed', details: String(err && err.stack ? err.stack : err) }, { status: 500 });
  }
}
