import PortfolioForm from '@/components/PortfolioForm';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'เพิ่ม Portfolio',
  description: 'กรอกรายละเอียด Portfolio และอัปโหลดสื่อประกอบสำหรับการสมัครเรียน',
};

export default function NewPortfolioPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">เพิ่ม Portfolio</h1>
      <PortfolioForm />
    </div>
  );
}
