"use client";

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePortfolio } from '@/lib/portfolioStore';
import type { MediaItem, Student } from '@/types';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

type Errors = Partial<Record<keyof Omit<Student, 'id' | 'createdAt' | 'activities' | 'awards' | 'works' | 'avatar'>, string>> & {
  gpa?: string;
  phone?: string;
  motivation?: string;
};

export default function PortfolioForm() {
  const { addStudent } = usePortfolio();
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [school, setSchool] = useState('');
  const [gpa, setGpa] = useState('');
  const [skills, setSkills] = useState('');
  const [motivation, setMotivation] = useState('');
  const [major, setMajor] = useState('');
  const [university, setUniversity] = useState('');

  const [avatar, setAvatar] = useState<MediaItem | null>(null);
  const [activities, setActivities] = useState<MediaItem[]>([]);
  const [awards, setAwards] = useState<MediaItem[]>([]);
  const [works, setWorks] = useState<MediaItem[]>([]);

  const [errors, setErrors] = useState<Errors>({});
  const motivationMin = 10;
  const motivationCount = motivation.trim().length;
  const motivationOk = motivationCount >= motivationMin;

  const isValidGpa = useMemo(() => {
    const num = Number(gpa);
    return !isNaN(num) && num >= 0 && num <= 4;
  }, [gpa]);

  function validate(): boolean {
    const e: Errors = {};
    if (!firstName.trim()) e.firstName = 'กรุณากรอกชื่อ';
    if (!lastName.trim()) e.lastName = 'กรุณากรอกนามสกุล';
    if (!address.trim()) e.address = 'กรุณากรอกที่อยู่';
    const digits = phone.replace(/\D+/g, '');
    if (!phone.trim() || digits.length < 9) e.phone = 'หมายเลขโทรศัพท์ไม่ถูกต้อง';
    if (!school.trim()) e.school = 'กรุณากรอกโรงเรียน';
    if (!gpa.trim() || !isValidGpa) e.gpa = 'GPA ต้องอยู่ระหว่าง 0.00 - 4.00';
    if (!skills.trim()) e.skills = 'กรุณากรอกความสามารถพิเศษ';
    if (!motivation.trim() || motivation.trim().length < 10) e.motivation = 'เหตุผลอย่างน้อย 10 ตัวอักษร';
    if (!major.trim()) e.major = 'กรุณากรอกสาขาที่เลือก';
    if (!university.trim()) e.university = 'กรุณากรอกมหาวิทยาลัย';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const student: Student = {
      id: uid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      school: school.trim(),
      gpa: Number(Number(gpa).toFixed(2)),
      skills: skills.trim(),
      motivation: motivation.trim(),
      major: major.trim(),
      university: university.trim(),
      avatar,
      activities,
      awards,
      works,
      createdAt: Date.now(),
    };
    addStudent(student);
    router.push(`/teacher/${student.id}`);
  }

  function fillSample() {
    setFirstName('ณัฐวุฒิ');
    setLastName('ศิริวงศ์');
    setPhone('0812345678');
    setAddress('123/45 แขวงบางรัก เขตบางรัก กรุงเทพฯ 10500');
    setSchool('โรงเรียนตัวอย่างวิทยา');
    setGpa('3.78');
    setSkills('เขียนโปรแกรม, วิเคราะห์ข้อมูล, พูดในที่สาธารณะ');
    setMotivation('ต้องการพัฒนาทักษะด้านคอมพิวเตอร์และสร้างนวัตกรรมที่ช่วยสังคม');
    setMajor('Computer Science');
    setUniversity('Harvard University');
  }

  async function onAvatarChange(file?: File | null) {
    if (!file) return setAvatar(null);
    const url = await fileToDataUrl(file);
    setAvatar({ id: uid(), url });
  }

  async function onMultiAdd(files: FileList | null, setter: (items: MediaItem[]) => void, current: MediaItem[]) {
    if (!files || !files.length) return;
    const arr = await Promise.all(
      Array.from(files).slice(0, 10).map(async (f) => ({ id: uid(), url: await fileToDataUrl(f) }))
    );
    setter([...current, ...arr]);
  }

  function removeMedia(id: string, setter: (items: MediaItem[]) => void, current: MediaItem[]) {
    setter(current.filter((m) => m.id !== id));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">ชื่อ</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น ณัฐวุฒิ" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">นามสกุล</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น ศิริวงศ์" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">ที่อยู่</label>
          <textarea className="mt-1 w-full border rounded-md px-3 py-2" rows={2} placeholder="บ้านเลขที่ ตรอก/ซอย เขต/อำเภอ จังหวัด รหัสไปรษณีย์" value={address} onChange={(e) => setAddress(e.target.value)} />
          {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">หมายเลขโทรศัพท์</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="เช่น 081-234-5678" />
          {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">โรงเรียน</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น โรงเรียนตัวอย่างวิทยา" value={school} onChange={(e) => setSchool(e.target.value)} />
          {errors.school && <p className="text-red-600 text-xs mt-1">{errors.school}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">GPA</label>
          <input type="number" step="0.01" min="0" max="4" className="mt-1 w-full border rounded-md px-3 py-2" value={gpa} onChange={(e) => setGpa(e.target.value)} />
          {errors.gpa && <p className="text-red-600 text-xs mt-1">{errors.gpa}</p>}
          {isValidGpa && gpa && <p className="text-xs text-black/60 mt-1">GPA ของคุณ: {Number(gpa).toFixed(2)}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">ความสามารถพิเศษ</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น เขียนโปรแกรม, ว่ายน้ำ, วงโยธวาทิต" value={skills} onChange={(e) => setSkills(e.target.value)} />
          {errors.skills && <p className="text-red-600 text-xs mt-1">{errors.skills}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">เหตุผลในการสมัครเข้าเรียน</label>
          <textarea className="mt-1 w-full border rounded-md px-3 py-2" rows={3} placeholder="เล่าถึงแรงบันดาลใจ ประสบการณ์ และเป้าหมายของคุณ" value={motivation} onChange={(e) => setMotivation(e.target.value)} />
          <div className="flex justify-between text-xs mt-1">
            <span className={motivationOk ? 'text-black/60' : 'text-red-600'}>
              {motivationOk ? 'ความยาวเหมาะสม' : `ต้องการอีก ${Math.max(0, motivationMin - motivationCount)} ตัวอักษร`}
            </span>
            <span className="text-black/60">{motivationCount} ตัวอักษร</span>
          </div>
          {errors.motivation && <p className="text-red-600 text-xs mt-1">{errors.motivation}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">สาขาที่เลือก</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น Computer Science" value={major} onChange={(e) => setMajor(e.target.value)} />
          {errors.major && <p className="text-red-600 text-xs mt-1">{errors.major}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">มหาวิทยาลัย</label>
          <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น Harvard University" value={university} onChange={(e) => setUniversity(e.target.value)} />
          {errors.university && <p className="text-red-600 text-xs mt-1">{errors.university}</p>}
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="font-medium">รูปภาพประจำตัว</h3>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const f = e.target.files?.[0];
            await onAvatarChange(f ?? null);
          }}
        />
        {avatar && (
          <div className="mt-2 flex items-center gap-3">
            <img src={avatar.url} alt="avatar" className="w-20 h-20 object-cover rounded-md border" />
            <button type="button" className="text-sm text-red-600" onClick={() => setAvatar(null)}>
              ลบรูป
            </button>
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">กิจกรรม (อัปโหลดได้หลายรูป)</h3>
        <input type="file" accept="image/*" multiple onChange={(e) => onMultiAdd(e.target.files, setActivities, activities)} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {activities.map((m) => (
            <div key={m.id} className="relative group">
              <img src={m.url} className="w-full h-28 object-cover rounded-md border" />
              <button type="button" className="absolute top-1 right-1 text-xs bg-white/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={() => removeMedia(m.id, setActivities, activities)}>
                ลบ
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">รางวัล</h3>
        <input type="file" accept="image/*" multiple onChange={(e) => onMultiAdd(e.target.files, setAwards, awards)} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {awards.map((m) => (
            <div key={m.id} className="relative group">
              <img src={m.url} className="w-full h-28 object-cover rounded-md border" />
              <button type="button" className="absolute top-1 right-1 text-xs bg-white/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={() => removeMedia(m.id, setAwards, awards)}>
                ลบ
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-medium">ผลงาน</h3>
        <input type="file" accept="image/*" multiple onChange={(e) => onMultiAdd(e.target.files, setWorks, works)} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {works.map((m) => (
            <div key={m.id} className="relative group">
              <img src={m.url} className="w-full h-28 object-cover rounded-md border" />
              <button type="button" className="absolute top-1 right-1 text-xs bg-white/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={() => removeMedia(m.id, setWorks, works)}>
                ลบ
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex gap-3">
        <button type="submit" className="px-4 py-2 rounded-md btn-primary">บันทึก Portfolio</button>
        <button type="button" onClick={fillSample} className="px-4 py-2 rounded-md border">เติมข้อมูลตัวอย่าง</button>
        <a href="/teacher" className="px-4 py-2 rounded-md border">ดูรายชื่อนักเรียน</a>
      </div>
    </form>
  );
}
