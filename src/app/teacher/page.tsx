import StudentTable from '@/components/StudentTable';
import TeacherToolbar from '@/components/TeacherToolbar';
import type { Metadata } from 'next';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'สำหรับอาจารย์',
  description: 'ตารางรายชื่อนักเรียน พร้อมค้นหาและเรียงลำดับ รวมถึงลิงก์ดูรายละเอียด',
};

export default function TeacherPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">สำหรับอาจารย์: รายชื่อนักเรียน</h1>
      <TeacherToolbar />
      <StudentTable />
    </div>
  );
}
