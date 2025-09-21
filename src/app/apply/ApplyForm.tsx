"use client";

import { useState, useMemo, useEffect } from "react";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { usePortfolio } from "@/lib/portfolioStore";
import type { MediaItem, Student } from "@/types";

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

const DRAFT_KEY = 'apply_draft_v1';

export default function ApplyForm() {
  const { addStudent } = usePortfolio();
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [school, setSchool] = useState("");
  const [gpa, setGpa] = useState("");
  const [major, setMajor] = useState("");
  const [university, setUniversity] = useState("");
  const [motivation, setMotivation] = useState("");

  const [avatar, setAvatar] = useState<MediaItem | null>(null);
  const [activities, setActivities] = useState<MediaItem[]>([]);
  const [awards, setAwards] = useState<MediaItem[]>([]);
  const [works, setWorks] = useState<MediaItem[]>([]);

  const isValidGpa = useMemo(() => {
    const num = Number(gpa);
    return !isNaN(num) && num >= 0 && num <= 4;
  }, [gpa]);

  function canNext(cur: number) {
    if (cur === 1) {
      return (
        firstName.trim() &&
        lastName.trim() &&
        /^\+?\d{9,15}$/.test(phone) &&
        address.trim() &&
        school.trim() &&
        gpa.trim() &&
        isValidGpa
      );
    }
    if (cur === 2) {
      return university.trim() && major.trim() && motivation.trim().length >= 10;
    }
    return true;
  }

  // load draft
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(DRAFT_KEY) : null;
      if (raw) {
        const d = JSON.parse(raw);
        setFirstName(d.firstName ?? "");
        setLastName(d.lastName ?? "");
        setAddress(d.address ?? "");
        setPhone(d.phone ?? "");
        setSchool(d.school ?? "");
        setGpa(d.gpa ?? "");
        setMajor(d.major ?? "");
        setUniversity(d.university ?? "");
        setMotivation(d.motivation ?? "");
      }
    } catch {}
  }, []);

  // persist draft
  useEffect(() => {
    try {
      const payload = { firstName, lastName, address, phone, school, gpa, major, university, motivation };
      if (typeof window !== 'undefined') localStorage.setItem(DRAFT_KEY, JSON.stringify(payload));
    } catch {}
  }, [firstName, lastName, address, phone, school, gpa, major, university, motivation]);

  const motivationMin = 10;
  const motivationCount = motivation.trim().length;
  const motivationOk = motivationCount >= motivationMin;

  function cleanDigits(val: string) { return val.replace(/\D+/g, ''); }
  function formatPhoneOnBlur() {
    const digits = cleanDigits(phone);
    if (digits.startsWith('0') && digits.length >= 9) {
      const f = `${digits.slice(0,3)}-${digits.slice(3,6)}-${digits.slice(6,10)}`;
      setPhone(f);
    }
  }

  function fillSample() {
    setFirstName('ณัฐวุฒิ');
    setLastName('ศิริวงศ์');
    setPhone('0812345678');
    setAddress('123/45 แขวงบางรัก เขตบางรัก กรุงเทพฯ 10500');
    setSchool('โรงเรียนตัวอย่างวิทยา');
    setGpa('3.78');
    setUniversity('Harvard University');
    setMajor('Computer Science');
    setMotivation('ผมสนใจการพัฒนาซอฟต์แวร์และการวิจัยด้าน AI เพื่อสร้างผลกระทบเชิงบวกต่อสังคม');
  }

  function clearDraft() {
    setFirstName(''); setLastName(''); setPhone(''); setAddress(''); setSchool(''); setGpa(''); setUniversity(''); setMajor(''); setMotivation('');
    try { if (typeof window !== 'undefined') localStorage.removeItem(DRAFT_KEY); } catch {}
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

  function submit() {
    const student: Student = {
      id: uid(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      school: school.trim(),
      gpa: Number(Number(gpa).toFixed(2)),
      skills: "",
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
    router.push("/apply/complete");
  }

  const universityChips = ['Harvard University', 'Chulalongkorn University', 'Mahidol University'];
  const majorChips = ['Computer Science', 'Economics', 'Engineering'];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl brand-heading">สมัครเข้าเรียน</h1>
        <p className="text-sm text-black/70 dark:text-white/70">กรอกข้อมูลทีละขั้นตอนอย่างกระชับ พร้อมบันทึกแบบร่างอัตโนมัติ</p>
      </div>

      <div className="flex items-center gap-2 text-sm">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? 'bg-crimson' : 'bg-black/10 dark:bg-white/10'}`} />
        ))}
      </div>

      {step === 1 && (
        <section className="space-y-6 md:grid md:grid-cols-3 md:gap-6">
          <h2 className="text-xl brand-heading">ข้อมูลส่วนตัวและวิชาการ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium">ชื่อ</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น ณัฐวุฒิ" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <p className="text-xs text-black/60 mt-1">ใช้ชื่อจริงตามบัตรประชาชน</p>
            </div>
            <div>
              <label className="block text-sm font-medium">นามสกุล</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น ศิริวงศ์" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">เบอร์โทร</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น 081-234-5678" value={phone} onChange={(e) => setPhone(e.target.value)} onBlur={formatPhoneOnBlur} />
              <p className="text-xs text-black/60 mt-1">ใช้หมายเลขที่ติดต่อได้จริง</p>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">ที่อยู่</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="บ้านเลขที่ ตรอก/ซอย เขต/อำเภอ จังหวัด รหัสไปรษณีย์" value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">โรงเรียน</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น โรงเรียนตัวอย่างวิทยา" value={school} onChange={(e) => setSchool(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium">GPA</label>
              <input type="number" step="0.01" min="0" max="4" className="mt-1 w-full border rounded-md px-3 py-2" value={gpa} onChange={(e) => setGpa(e.target.value)} />
              {!isValidGpa && gpa && <p className="text-xs text-red-600 mt-1">GPA ต้องอยู่ระหว่าง 0.00 - 4.00</p>}
              {isValidGpa && gpa && <p className="text-xs text-black/60 mt-1">GPA ของคุณ: {Number(gpa).toFixed(2)}</p>}
            </div>
            <div className="md:col-span-2">
              <button type="button" onClick={fillSample} className="mr-2 px-3 py-1.5 rounded-md border">เติมข้อมูลตัวอย่าง</button>
              <button type="button" onClick={clearDraft} className="px-3 py-1.5 rounded-md border">ล้างแบบร่าง</button>
            </div>
          </div>
          <aside className="hidden md:block p-4 border rounded-md h-fit">
            <h3 className="font-medium mb-2">ตัวอย่างข้อมูล</h3>
            <p className="text-sm">ชื่อ-นามสกุล: {firstName || '—'} {lastName || ''}</p>
            <p className="text-sm">GPA: {gpa ? Number(gpa).toFixed(2) : '—'}</p>
            <p className="text-sm">โรงเรียน: {school || '—'}</p>
            <p className="text-sm">เบอร์: {phone || '—'}</p>
          </aside>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6 md:grid md:grid-cols-3 md:gap-6">
          <h2 className="text-xl brand-heading">หลักสูตรที่สนใจ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:col-span-2">
            <div>
              <label className="block text-sm font-medium">มหาวิทยาลัย</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น Harvard University" value={university} onChange={(e) => setUniversity(e.target.value)} />
              <div className="flex gap-2 mt-2 flex-wrap">
                {universityChips.map((u) => (
                  <button type="button" key={u} className="px-2 py-1 rounded-md border text-xs" onClick={() => setUniversity(u)}>{u}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">สาขาที่เลือก</label>
              <input className="mt-1 w-full border rounded-md px-3 py-2" placeholder="เช่น Computer Science" value={major} onChange={(e) => setMajor(e.target.value)} />
              <div className="flex gap-2 mt-2 flex-wrap">
                {majorChips.map((m) => (
                  <button type="button" key={m} className="px-2 py-1 rounded-md border text-xs" onClick={() => setMajor(m)}>{m}</button>
                ))}
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium">เหตุผลในการสมัคร (อย่างน้อย 10 ตัวอักษร)</label>
              <textarea className="mt-1 w-full border rounded-md px-3 py-2" rows={4} placeholder="เล่าถึงแรงบันดาลใจ ประสบการณ์ และเป้าหมายของคุณ" value={motivation} onChange={(e) => setMotivation(e.target.value)} />
              <div className="flex justify-between text-xs mt-1">
                <span className={motivationOk ? 'text-black/60' : 'text-red-600'}>
                  {motivationOk ? 'ความยาวเหมาะสม' : `ต้องการอีก ${Math.max(0, motivationMin - motivationCount)} ตัวอักษร`}
                </span>
                <span className="text-black/60">{motivationCount} ตัวอักษร</span>
              </div>
            </div>
          </div>
          <aside className="hidden md:block p-4 border rounded-md h-fit">
            <h3 className="font-medium mb-2">พรีวิว</h3>
            <p className="text-sm">มหาวิทยาลัย: {university || '—'}</p>
            <p className="text-sm">สาขา: {major || '—'}</p>
            <p className="text-sm">เหตุผล: {motivation ? `${motivation.slice(0, 80)}${motivation.length > 80 ? '…' : ''}` : '—'}</p>
          </aside>
        </section>
      )}

      {step === 3 && (
        <section className="space-y-6 md:grid md:grid-cols-3 md:gap-6">
          <h2 className="text-xl brand-heading">อัปโหลดเอกสาร/รูปภาพ</h2>
          <div className="space-y-3 md:col-span-2">
            <div>
              <label className="block text-sm font-medium">รูปภาพประจำตัว</label>
              <input type="file" accept="image/*" onChange={async (e) => onAvatarChange(e.target.files?.[0] ?? null)} />
              {avatar && (
                <div className="mt-2 w-20 h-20 relative rounded-md border overflow-hidden">
                  <Image src={avatar.url} alt="avatar" fill sizes="80px" className="object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">กิจกรรม</label>
              <div
                className="mt-1 border rounded-md p-3 text-sm text-black/60 dark:text-white/60"
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); onMultiAdd(e.dataTransfer.files, setActivities, activities); }}
              >ลากวางไฟล์ที่นี่ หรือเลือกไฟล์ด้านล่าง</div>
              <input className="mt-2" type="file" accept="image/*" multiple onChange={(e) => onMultiAdd(e.target.files, setActivities, activities)} />
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {activities.map((m, idx) => (
                  <div key={m.id} className="relative group">
                    <div className="w-full h-24 relative rounded-md border overflow-hidden">
                      <Image src={m.url} alt={`กิจกรรม ${idx + 1}`} fill sizes="160px" className="object-cover" />
                    </div>
                    <button type="button" className="absolute top-1 right-1 text-xs bg-white/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={() => removeMedia(m.id, setActivities, activities)}>ลบ</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">รางวัล</label>
              <div
                className="mt-1 border rounded-md p-3 text-sm text-black/60 dark:text-white/60"
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); onMultiAdd(e.dataTransfer.files, setAwards, awards); }}
              >ลากวางไฟล์ที่นี่ หรือเลือกไฟล์ด้านล่าง</div>
              <input className="mt-2" type="file" accept="image/*" multiple onChange={(e) => onMultiAdd(e.target.files, setAwards, awards)} />
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {awards.map((m, idx) => (
                  <div key={m.id} className="relative group">
                    <div className="w-full h-24 relative rounded-md border overflow-hidden">
                      <Image src={m.url} alt={`รางวัล ${idx + 1}`} fill sizes="160px" className="object-cover" />
                    </div>
                    <button type="button" className="absolute top-1 right-1 text-xs bg-white/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={() => removeMedia(m.id, setAwards, awards)}>ลบ</button>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium">ผลงาน</label>
              <div
                className="mt-1 border rounded-md p-3 text-sm text-black/60 dark:text-white/60"
                onDragOver={(e) => { e.preventDefault(); }}
                onDrop={(e) => { e.preventDefault(); onMultiAdd(e.dataTransfer.files, setWorks, works); }}
              >ลากวางไฟล์ที่นี่ หรือเลือกไฟล์ด้านล่าง</div>
              <input className="mt-2" type="file" accept="image/*" multiple onChange={(e) => onMultiAdd(e.target.files, setWorks, works)} />
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                {works.map((m, idx) => (
                  <div key={m.id} className="relative group">
                    <div className="w-full h-24 relative rounded-md border overflow-hidden">
                      <Image src={m.url} alt={`ผลงาน ${idx + 1}`} fill sizes="160px" className="object-cover" />
                    </div>
                    <button type="button" className="absolute top-1 right-1 text-xs bg-white/80 px-2 py-0.5 rounded opacity-0 group-hover:opacity-100" onClick={() => removeMedia(m.id, setWorks, works)}>ลบ</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <aside className="hidden md:block p-4 border rounded-md h-fit">
            <h3 className="font-medium mb-2">รูปโปรไฟล์</h3>
            {avatar ? (
              <div className="w-24 h-24 relative rounded-md border overflow-hidden">
                <Image src={avatar.url} alt="avatar" fill sizes="96px" className="object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-md border grid place-items-center text-xs text-black/60 dark:text-white/60">ไม่มีรูป</div>
            )}
            <p className="text-xs text-black/60 mt-2">กิจกรรม: {activities.length} รูป</p>
            <p className="text-xs text-black/60">รางวัล: {awards.length} รูป</p>
            <p className="text-xs text-black/60">ผลงาน: {works.length} รูป</p>
          </aside>
        </section>
      )}

      <div className="flex items-center justify-between pt-2">
        <button className="px-4 py-2 rounded-md border" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>ย้อนกลับ</button>
        {step < 3 ? (
          <button className={`px-4 py-2 rounded-md btn-primary ${!canNext(step) ? 'opacity-60 cursor-not-allowed' : ''}`} onClick={() => canNext(step) && setStep((s) => Math.min(3, s + 1))} disabled={!canNext(step)}>ถัดไป</button>
        ) : (
          <button className="px-4 py-2 rounded-md btn-primary" onClick={submit}>ส่งใบสมัคร</button>
        )}
      </div>
    </div>
  );
}
