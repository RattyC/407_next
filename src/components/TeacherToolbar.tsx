"use client";

import { usePortfolio } from '@/lib/portfolioStore';
import { generateSampleStudents } from '@/lib/sampleData';

export default function TeacherToolbar() {
  const { setStudents, clearStudents, students } = usePortfolio();

  function seed() {
    setStudents(generateSampleStudents());
  }

  function clearAll() {
    clearStudents();
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <button onClick={seed} className="px-3 py-1.5 rounded-md border">เติมข้อมูลตัวอย่าง</button>
      <button onClick={clearAll} className="px-3 py-1.5 rounded-md border">ลบทั้งหมด</button>
      <span className="text-black/60 dark:text-white/60 ml-2">จำนวนปัจจุบัน: {students.length}</span>
    </div>
  );
}

