import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'หน้าหลัก',
  description: 'พอร์ทัลสมัครเรียนและจัดการ Portfolio สำหรับผู้สมัครและอาจารย์',
};

export default function Home() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl brand-heading">Admissions Portal</h1>
      <p className="text-sm text-black/70 dark:text-white/70">สมัครเรียนเป็นขั้นตอน ชัดเจน พร้อมอัปโหลดและจัดการ Portfolio</p>
      <div className="flex gap-3">
        <Link className="px-4 py-2 rounded-md btn-primary" href="/apply">เริ่มสมัครเรียน</Link>
        <Link className="px-4 py-2 rounded-md border border-black/10 dark:border-white/10" href="/portfolio/new">เพิ่ม Portfolio (ฉบับเต็ม)</Link>
        <Link className="px-4 py-2 rounded-md border border-black/10 dark:border-white/10" href="/teacher">สำหรับอาจารย์</Link>
      </div>
    </div>
  );
}
