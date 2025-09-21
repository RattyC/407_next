import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl brand-heading text-crimson">ไม่พบหน้าที่ร้องขอ</h1>
      <Link href="/" className="px-4 py-2 rounded-md btn-primary inline-block">กลับหน้าแรก</Link>
    </div>
  );
}
