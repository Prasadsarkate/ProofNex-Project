"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Download, Eye, Share2 } from "lucide-react"
import { renderCertificateToBlob } from './certificate-renderer'

interface CertificateActionsProps {
  serial: string
  className?: string
}

export function CertificateActions({ serial, className }: CertificateActionsProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleShare = async () => {
    const url = `${window.location.origin}/certificate/${encodeURIComponent(serial)}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Share Certificate',
          text: 'Check out my certificate from ProofNex',
          url
        })
      } else {
        await navigator.clipboard.writeText(url)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
    }
  }

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // First try our deterministic canvas renderer (based on your sample)
      try {
        // Gather basic values from the DOM or fall back to serial-based defaults
        const root = document.querySelector(`[data-certificate="${serial}"]`) as HTMLElement | null;
        let name = serial;
        let title = 'Internship';
        let duration = '1 Month';
        if (root) {
          const nameEl = root.querySelector('h3') || root.querySelector('h2') || null;
          const titleEl = root.querySelector('h4') || null;
          const footerText = root.innerText || '';
          if (nameEl) name = (nameEl.textContent || serial).trim();
          if (titleEl) title = (titleEl.textContent || title).trim();
          // attempt to parse a duration mention
          const m = footerText.match(/Duration[:\s]*([\w\s]+)/i);
          if (m) duration = m[1].trim();
        }
        const blob = await renderCertificateToBlob({ name, title, duration, serial, scale: 2 });
        if (blob) {
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `certificate-${serial}.png`;
          document.body.appendChild(link);
          link.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
          setIsDownloading(false);
          return;
        }
      } catch (e) {
        console.warn('[cert-download] canvas renderer failed, falling back to DOM capture', e);
      }
      // Create a visible debug panel so the user can see logs without DevTools
      const ensureDebugPanel = () => {
        let panel = document.getElementById('cert-download-debug');
        if (!panel) {
          panel = document.createElement('div');
          panel.id = 'cert-download-debug';
          panel.style.position = 'fixed';
          panel.style.right = '12px';
          panel.style.bottom = '12px';
          panel.style.zIndex = '99999';
          panel.style.maxWidth = '360px';
          panel.style.maxHeight = '240px';
          panel.style.overflow = 'auto';
          panel.style.background = 'rgba(0,0,0,0.75)';
          panel.style.color = '#fff';
          panel.style.fontSize = '12px';
          panel.style.padding = '8px';
          panel.style.borderRadius = '8px';
          panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.6)';
          panel.innerText = 'Certificate download debug logs:\n';
          document.body.appendChild(panel);
        }
        return panel;
      };
  const debugPanel = ensureDebugPanel();
  // Temporary route console logs to the debug panel as well
  const origConsole = { log: console.log, warn: console.warn, error: console.error };
  try { (window as any).__origConsole = origConsole; } catch (e) { /* ignore */ }
      const append = (level: string, ...args: any[]) => {
        try {
          const text = args.map(a => (typeof a === 'string' ? a : JSON.stringify(a, null, 2))).join(' ');
          const line = document.createElement('div');
          line.style.marginBottom = '6px';
          line.textContent = `[${level}] ${text}`;
          debugPanel.appendChild(line);
          debugPanel.scrollTop = debugPanel.scrollHeight;
        } catch (e) {
          /* ignore */
        }
      };
      console.log = (...args: any[]) => { origConsole.log(...args); append('log', ...args); };
      console.warn = (...args: any[]) => { origConsole.warn(...args); append('warn', ...args); };
      console.error = (...args: any[]) => { origConsole.error(...args); append('error', ...args); };
      console.log('[cert-download] start', { serial });
      // Find the certificate preview by serial
      let certificateDiv = document.querySelector(`[data-certificate="${serial}"]`) as HTMLDivElement | null;
      console.log('[cert-download] initial selector result', { certificateDiv });
      if (!certificateDiv) {
        // Try to find by partial match (for preview/test cases)
        const all = document.querySelectorAll('[data-certificate]');
        certificateDiv = Array.from(all).find(div => (div as HTMLElement).dataset.certificate?.includes(serial)) as HTMLDivElement | null;
        console.log('[cert-download] fallback selector result', { certificateDiv });
      }
      if (!certificateDiv) {
        console.error('[cert-download] certificate element not found for serial', serial);
        throw new Error('Certificate element not found');
      }
      certificateDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
      console.log('[cert-download] scrolled into view');
      // Wait for images to load
      const images = Array.from(certificateDiv.getElementsByTagName('img'));
      await Promise.all(images.map(img =>
        new Promise((resolve, reject) => {
          if (img.complete && img.naturalWidth !== 0) resolve(true);
          img.onload = () => resolve(true);
          img.onerror = reject;
        })
      ));
      console.log('[cert-download] images loaded count', images.length);
      // html2canvas can now capture the QR code (canvas) directly
      const html2canvas = (await import('html2canvas')).default;
      console.log('[cert-download] html2canvas imported', { html2canvas: !!html2canvas });
      let canvas;
      // short wait to allow any canvas/QR to finish rendering
      await new Promise(r => setTimeout(r, 120));
      try {
        try {
          canvas = await html2canvas(certificateDiv, { scale: 2, useCORS: true, backgroundColor: '#fff' });
          console.log('[cert-download] canvas created via html2canvas (useCORS)', { canvas });
        } catch (errUseCORS) {
          console.warn('[cert-download] html2canvas with useCORS failed, will retry without useCORS');
          console.warn((errUseCORS as any) && (errUseCORS as any).stack ? (errUseCORS as any).stack : errUseCORS);
          try {
            canvas = await html2canvas(certificateDiv, { scale: 2, backgroundColor: '#fff' });
            console.log('[cert-download] canvas created via html2canvas (no useCORS)', { canvas });
          } catch (errNoCORS) {
            console.error('[cert-download] both html2canvas attempts failed');
            console.error('useCORS error:', (errUseCORS as any) && (errUseCORS as any).stack ? (errUseCORS as any).stack : errUseCORS);
            console.error('noCORS error:', (errNoCORS as any) && (errNoCORS as any).stack ? (errNoCORS as any).stack : errNoCORS);
            canvas = undefined;
          }
        }
      } catch (err) {
  console.error('[cert-download] unexpected error during html2canvas attempts', (err as any) && (err as any).stack ? (err as any).stack : err);
        canvas = undefined;
      }
      // Try to get blob from canvas
      const tryDownloadFromCanvas = (c: HTMLCanvasElement) => new Promise<boolean>((resolve) => {
        try {
          c.toBlob((blob) => {
            console.log('[cert-download] toBlob callback', { blob });
            if (!blob) {
              // fallback to dataURL
              try {
                const dataUrl = c.toDataURL('image/png');
                console.warn('[cert-download] toBlob returned null, falling back to toDataURL', { dataUrlLength: dataUrl.length });
                const link = document.createElement('a');
                link.href = dataUrl;
                link.download = `certificate-${serial}.png`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                resolve(true);
                return;
              } catch (e) {
                console.error('[cert-download] toDataURL fallback failed', e);
                resolve(false);
                return;
              }
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate-${serial}.png`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            resolve(true);
          }, 'image/png', 1.0);
        } catch (e) {
          console.error('[cert-download] toBlob threw', e);
          // try dataURL as last resort
          try {
            const dataUrl = c.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = dataUrl;
            link.download = `certificate-${serial}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            resolve(true);
          } catch (err) {
            console.error('[cert-download] toDataURL also failed', err);
            resolve(false);
          }
        }
      });

      let downloaded = false;
      if (canvas && (canvas.width || canvas.height)) {
        // canvas could be HTMLCanvasElement (html2canvas returns a canvas)
        downloaded = await tryDownloadFromCanvas(canvas as unknown as HTMLCanvasElement);
      }

      if (!downloaded) {
        console.warn('[cert-download] primary canvas download failed, attempting clone fallback');
        try {
          // Clone certificate node and inline any canvases as images
          const clone = certificateDiv.cloneNode(true) as HTMLElement;
          const canvases = clone.querySelectorAll('canvas');
          canvases.forEach((cv) => {
            try {
              const source = (cv as HTMLCanvasElement).toDataURL('image/png');
              const img = document.createElement('img');
              img.src = source;
              img.style.width = (cv as HTMLCanvasElement).width + 'px';
              img.style.height = (cv as HTMLCanvasElement).height + 'px';
              // copy display styles
              img.style.display = (cv as HTMLElement).style.display || 'block';
              cv.parentNode?.replaceChild(img, cv);
            } catch (err) {
              console.warn('[cert-download] failed to convert canvas to image in clone', err);
            }
          });

          // Inline computed styles from the original into the clone to avoid html2canvas parsing
          // modern CSS color functions (like oklch) which html2canvas can't parse.
          try {
            const origNodes = Array.from(certificateDiv.querySelectorAll('*')) as HTMLElement[];
            const cloneNodes = Array.from(clone.querySelectorAll('*')) as HTMLElement[];
            // also include the root element
            const roots = [{ orig: certificateDiv as HTMLElement, clone }];
            for (let i = 0; i < origNodes.length; i++) {
              const o = origNodes[i];
              const c = cloneNodes[i];
              if (!o || !c) continue;
              try {
                const cs = window.getComputedStyle(o);
                // copy key properties as resolved values
                c.style.color = cs.color || '';
                c.style.backgroundColor = cs.backgroundColor || '';
                c.style.borderColor = cs.borderColor || '';
                c.style.boxShadow = 'none';
                c.style.backgroundImage = 'none';
                c.style.filter = 'none';
                c.style.webkitTextFillColor = cs.webkitTextFillColor || '';
              } catch (e) {
                // ignore individual failures
              }
            }
            // copy root computed styles too
            try {
              const csRoot = window.getComputedStyle(certificateDiv as HTMLElement);
              (clone as HTMLElement).style.backgroundColor = csRoot.backgroundColor || '#fff';
              (clone as HTMLElement).style.color = csRoot.color || '#000';
            } catch (e) { /* ignore */ }
          } catch (e) {
            console.warn('[cert-download] inline computed styles failed', e);
          }

          // Render clone offscreen
          const wrapper = document.createElement('div');
          wrapper.style.position = 'fixed';
          wrapper.style.left = '-9999px';
          wrapper.style.top = '0';
          wrapper.style.opacity = '1';
          wrapper.style.background = '#fff';
          wrapper.appendChild(clone);
          document.body.appendChild(wrapper);
          // small delay to let images settle
          await new Promise(r => setTimeout(r, 150));

          let cloneCanvas;
          try {
            cloneCanvas = await html2canvas(clone, { scale: 2, backgroundColor: '#fff', allowTaint: true, useCORS: false });
          } catch (err) {
            console.error('[cert-download] clone html2canvas failed', err);
            cloneCanvas = await html2canvas(clone, { scale: 2, backgroundColor: '#fff' });
          }

          if (cloneCanvas) {
            downloaded = await tryDownloadFromCanvas(cloneCanvas as unknown as HTMLCanvasElement);
          }

          document.body.removeChild(wrapper);
        } catch (err) {
          console.error('[cert-download] clone fallback failed', err);
        }
      }

      if (!downloaded) {
        console.warn('[cert-download] client-side capture failed, attempting server-side render fallback');
        try {
          const resp = await fetch(`/api/certificate/download?serial=${encodeURIComponent(serial)}`);
          if (resp.ok) {
            const blob = await resp.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `certificate-${serial}.png`;
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);
            downloaded = true;
          } else {
            const json = await resp.json().catch(() => ({ error: 'unknown' }));
            console.error('[cert-download] server fallback failed', json);
            alert('Failed to create image. If your certificate has a QR or logo, try disabling ad blockers or check image permissions.');
          }
        } catch (e) {
          console.error('[cert-download] server fallback request failed', e);
          alert('Failed to create image. If your certificate has a QR or logo, try disabling ad blockers or check image permissions.');
        }
      }
    } catch (error) {
      console.error('Error creating certificate:', error);
      alert('Failed to download certificate. Please try again. If the problem persists, check your browser settings or try a different browser.');
    } finally {
      // restore console
      try {
        const orig = (window as any).__origConsole;
        if (orig) {
          console.log = orig.log;
          console.warn = orig.warn;
          console.error = orig.error;
        }
      } catch (e) {
        /* ignore */
      }
      // remove debug panel after short delay so user can see results
      setTimeout(() => {
        try {
          const panel = document.getElementById('cert-download-debug');
          if (panel && panel.parentNode) panel.parentNode.removeChild(panel);
        } catch (e) { /* ignore */ }
      }, 7000);
      setIsDownloading(false);
    }
  }

  const handleVerify = () => {
    window.open(`/verify?serial=${encodeURIComponent(serial)}`, '_blank')
  }

  return (
    <div className={`flex flex-row gap-2 w-full ${className || ''}`}>
      <Button
        onClick={handleVerify}
        variant="secondary"
        className="flex-1 bg-secondary/50 hover:bg-secondary/80 flex items-center justify-center gap-1.5"
        size="sm"
      >
        <Eye className="w-4 h-4" />
        Verify
      </Button>
      <Button 
        onClick={handleShare}
        variant="outline" 
        className="flex-1 flex items-center justify-center gap-1.5"
        size="sm"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex-1 flex items-center justify-center gap-1.5"
        size="sm"
      >
        {isDownloading ? (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        {isDownloading ? 'Saving...' : 'Download'}
      </Button>
    </div>
  )
}
