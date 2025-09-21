import type { Metadata } from 'next';
import Link from 'next/link';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'ส่งใบสมัครเรียบร้อย',
  description: 'บันทึกข้อมูลการสมัครเสร็จสมบูรณ์ คุณสามารถกลับหน้าแรกหรือดูรายชื่อผู้สมัครได้',
};

export default function ApplyCompletePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl brand-heading text-crimson">ส่งใบสมัครเรียบร้อย</h1>
      <p className="text-sm text-black/70 dark:text-white/70">เราได้บันทึกข้อมูลของคุณไว้ในระบบแล้ว (ตัวอย่าง: localStorage)</p>
      <div className="flex gap-3">
        <Link href="/teacher" className="px-4 py-2 rounded-md border">ดูรายชื่อผู้สมัคร (สำหรับอาจารย์)</Link>
        <Link href="/" className="px-4 py-2 rounded-md btn-primary">กลับหน้าแรก</Link>
      </div>
    </div>
  );
}
