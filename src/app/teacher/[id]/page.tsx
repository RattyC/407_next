"use client";

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { usePortfolio } from '@/lib/portfolioStore';

export default function StudentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { students } = usePortfolio();
  const s = students.find((x) => x.id === id);

  if (!s) {
    return (
      <div className="space-y-3">
        <p>ไม่พบนักเรียน</p>
        <button onClick={() => router.push('/teacher')} className="px-3 py-2 rounded-md border">กลับไปหน้ารายชื่อ</button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        {s.avatar ? (
          <div className="w-28 h-28 relative rounded-md border overflow-hidden">
            <Image
              src={s.avatar.url}
              alt={`${s.firstName} ${s.lastName}`}
              fill
              sizes="112px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="w-28 h-28 rounded-md border grid place-items-center text-sm text-black/60 dark:text-white/60">ไม่มีรูป</div>
        )}
        <div>
          <h1 className="text-2xl font-semibold">{s.firstName} {s.lastName}</h1>
          <p className="text-sm text-black/70 dark:text-white/70">โรงเรียน: {s.school}</p>
          <p className="text-sm text-black/70 dark:text-white/70">GPA: <span className="font-mono">{s.gpa.toFixed(2)}</span></p>
        </div>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="font-medium">ข้อมูลติดต่อ</h2>
          <p className="text-sm">โทร: {s.phone}</p>
          <p className="text-sm">ที่อยู่: {s.address}</p>
        </div>
        <div>
          <h2 className="font-medium">การสมัคร</h2>
          <p className="text-sm">สาขาที่เลือก: {s.major}</p>
          <p className="text-sm">มหาวิทยาลัย: {s.university}</p>
        </div>
      </section>

      <section>
        <h2 className="font-medium mb-2">ความสามารถพิเศษ</h2>
        <p className="text-sm whitespace-pre-wrap">{s.skills}</p>
      </section>

      <section>
        <h2 className="font-medium mb-2">เหตุผลในการสมัครเข้าเรียน</h2>
        <p className="text-sm whitespace-pre-wrap">{s.motivation}</p>
      </section>

      <MediaGrid title="กิจกรรม" items={s.activities} />
      <MediaGrid title="รางวัล" items={s.awards} />
      <MediaGrid title="ผลงาน" items={s.works} />

      <div className="flex gap-3">
        <button onClick={() => history.back()} className="px-3 py-2 rounded-md border">ย้อนกลับ</button>
        <button onClick={() => router.push('/teacher')} className="px-3 py-2 rounded-md border">ไปหน้ารายชื่อ</button>
      </div>
    </div>
  );
}

function MediaGrid({ title, items }: { title: string; items: { id: string; url: string }[] }) {
  if (!items?.length) return null;
  return (
    <section>
      <h2 className="font-medium mb-2">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {items.map((m, idx) => (
          <div key={m.id} className="w-full h-32 relative rounded-md border overflow-hidden">
            <Image
              src={m.url}
              alt={`${title} ${idx + 1}`}
              fill
              sizes="(min-width: 768px) 200px, 150px"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
