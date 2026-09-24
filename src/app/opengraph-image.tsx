import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
export const alt = `Rai Dispatch — We manage the loads. You drive the miles. Truck dispatch fees ${DISPATCH_RATE_RANGE} by equipment.`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'public/brand/rai-dispatch-logo-dark.svg'));
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#101827', color: '#fff', padding: '72px', justifyContent: 'space-between' }}>
      <img src={`data:image/svg+xml;base64,${logo.toString('base64')}`} alt="Rai Dispatch" width={500} height={69} />
      <div style={{ display: 'flex', flexDirection: 'column', fontSize: 72, lineHeight: 1.15, fontWeight: 700 }}>
        <span>We manage the loads.</span>
        <span style={{ color: '#ff6269' }}>You drive the miles.</span>
      </div>
      <div style={{ display: 'flex', fontSize: 28, color: '#cdd2da' }}>Your dedicated dispatcher. Across the lower 48.</div>
      <div style={{ display: 'flex', fontSize: 32, justifyContent: 'space-between' }}><span>{DISPATCH_RATE_RANGE} fees by equipment</span><span>raidispatch.com</span></div>
    </div>, size,
  );
}
