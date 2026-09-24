import { DISPATCH_RATE_RANGE } from '@/lib/dispatch-pricing';
import { ImageResponse } from 'next/og';
export const alt = `Rai Dispatch — dedicated truck dispatchers with equipment-based fees of ${DISPATCH_RATE_RANGE}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', background: '#101827', color: '#fff', padding: '72px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', fontSize: 30, color: '#ff6269', letterSpacing: 5 }}>RAI DISPATCH / USA</div>
      <div style={{ display: 'flex', fontSize: 78, lineHeight: 1.05, fontWeight: 700, maxWidth: 980 }}>Your truck. Your lanes. Your dedicated dispatcher.</div>
      <div style={{ display: 'flex', fontSize: 32, justifyContent: 'space-between' }}><span>{DISPATCH_RATE_RANGE} fees by equipment</span><span>raidispatch.com</span></div>
    </div>, size,
  );
}
