import type { Metadata } from 'next';
import ApplyForm from './ApplyForm';

export const metadata: Metadata = {
  title: 'สมัครเข้าเรียน',
  description: 'กรอกข้อมูลสมัครเรียนเป็นขั้นตอน พร้อมอัปโหลดเอกสารและบันทึกแบบร่างอัตโนมัติ',
};

export default function ApplyPage() {
  return <ApplyForm />;
}

