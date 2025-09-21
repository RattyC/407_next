import type { MediaItem, Student } from '@/types';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function img(path: string): MediaItem {
  return { id: uid(), url: path };
}

export function generateSampleStudents(): Student[] {
  const now = Date.now();
  const avatars = ['/vercel.svg', '/next.svg', '/globe.svg', '/file.svg', '/window.svg'];
  const base: Omit<Student, 'id' | 'firstName' | 'lastName' | 'gpa' | 'school' | 'createdAt'> = {
    address: '123/45 แขวงบางรัก เขตบางรัก กรุงเทพฯ 10500',
    phone: '081-234-5678',
    skills: 'เขียนโปรแกรม, วิเคราะห์ข้อมูล, นำเสนอ',
    motivation: 'มุ่งมั่นพัฒนาทักษะและสร้างสรรค์นวัตกรรมเพื่อสังคม',
    major: 'Computer Science',
    university: 'Harvard University',
    avatar: null,
    activities: [img('/globe.svg')],
    awards: [img('/file.svg')],
    works: [img('/window.svg')],
  };

  const rows: Array<{ firstName: string; lastName: string; gpa: number; school: string; avatar?: string }> = [
    { firstName: 'กิตติ', lastName: 'สมบูรณ์', gpa: 3.92, school: 'รร. ตัวอย่างวิทยา', avatar: avatars[0] },
    { firstName: 'ณัฐวุฒิ', lastName: 'ศิริวงศ์', gpa: 3.78, school: 'รร. เมืองใหม่พิทยา', avatar: avatars[1] },
    { firstName: 'พิมพ์ชนก', lastName: 'รุ่งเรือง', gpa: 3.55, school: 'รร. ธนบุรีศึกษา', avatar: avatars[2] },
    { firstName: 'ศุภกร', lastName: 'ศักดิ์ชัย', gpa: 3.22, school: 'รร. ปทุมวิทยาคม', avatar: avatars[3] },
    { firstName: 'อาทิตยา', lastName: 'ใจดี', gpa: 3.01, school: 'รร. สวนหลวงพิทย์', avatar: avatars[4] },
  ];

  return rows.map((r, i) => ({
    id: uid(),
    firstName: r.firstName,
    lastName: r.lastName,
    gpa: r.gpa,
    school: r.school,
    createdAt: now - i * 3600_000,
    address: base.address,
    phone: base.phone,
    skills: base.skills,
    motivation: base.motivation,
    major: base.major,
    university: base.university,
    avatar: r.avatar ? { id: uid(), url: r.avatar } : null,
    activities: base.activities,
    awards: base.awards,
    works: base.works,
  }));
}

