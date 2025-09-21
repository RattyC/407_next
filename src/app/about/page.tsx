import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'เกี่ยวกับโครงการ',
  description: 'โครงการสาธิตระบบสมัครเรียนและ Portfolio ด้วย Next.js App Router และ Tailwind',
};

export default function AboutPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="text-sm text-black/70 dark:text-white/70">
        โครงการตัวอย่างระบบ Portfolio สำหรับ TCAS69 พัฒนาด้วย Next.js App Router และ Tailwind.
      </p>
      <ul className="list-disc pl-5 text-sm">
        <li>เพิ่ม/จัดเก็บ Portfolio ในเครื่องด้วย localStorage</li>
        <li>หน้ารายชื่อสำหรับอาจารย์ พร้อมค้นหาและเรียงลำดับ</li>
        <li>อัปโหลดและแสดงรูปภาพกิจกรรม/รางวัล/ผลงาน</li>
      </ul>
    </div>
  );
}
