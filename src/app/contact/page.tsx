import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'ติดต่อทีมงาน',
  description: 'ติดต่อทีมพัฒนา/ผู้ดูแลระบบสำหรับคำถาม ข้อเสนอแนะ หรือปัญหาการใช้งาน',
};

export default function ContactPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Contact</h1>
      <p className="text-sm text-black/70 dark:text-white/70">
        ช่องทางการติดต่อทีมพัฒนาโครงการสาธิตนี้ (ตัวอย่าง):
      </p>
      <div className="text-sm space-y-1">
        <p>อีเมล: example@tcas69.dev</p>
        <p>โทรศัพท์: 08x-xxx-xxxx</p>
      </div>
    </div>
  );
}
