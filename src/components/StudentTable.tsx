"use client";

import Link from 'next/link';
import React, { useMemo, useState } from 'react';
import { usePortfolio } from '@/lib/portfolioStore';
import type { SortKey } from '@/types';

const headers: { key: SortKey; label: string }[] = [
  { key: 'firstName', label: 'ชื่อ' },
  { key: 'lastName', label: 'นามสกุล' },
  { key: 'school', label: 'โรงเรียน' },
  { key: 'gpa', label: 'GPA' },
];

export default function StudentTable() {
  const { students } = usePortfolio();
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [q, setQ] = useState('');

  function onSort(k: SortKey) {
    if (sortKey === k) setSortAsc(!sortAsc);
    else {
      setSortKey(k);
      setSortAsc(true);
    }
  }

  const filtered = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    let data = students;
    if (keyword) {
      data = data.filter(
        (s) =>
          s.firstName.toLowerCase().includes(keyword) ||
          s.lastName.toLowerCase().includes(keyword) ||
          s.school.toLowerCase().includes(keyword)
      );
    }
    const sorted = [...data].sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      switch (sortKey) {
        case 'firstName':
          return a.firstName.localeCompare(b.firstName) * dir;
        case 'lastName':
          return a.lastName.localeCompare(b.lastName) * dir;
        case 'school':
          return a.school.localeCompare(b.school) * dir;
        case 'gpa':
          return (a.gpa - b.gpa) * dir;
        case 'createdAt':
        default:
          return (a.createdAt - b.createdAt) * dir;
      }
    });
    return sorted;
  }, [students, sortKey, sortAsc, q]);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <input
          placeholder="ค้นหา ชื่อ/นามสกุล/โรงเรียน"
          className="border rounded-md px-3 py-2 w-full max-w-sm"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <Link href="/portfolio/new" className="px-3 py-2 rounded-md bg-foreground text-background text-sm">+ เพิ่ม</Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm border-collapse">
          <thead>
            <tr className="bg-black/[.04] dark:bg-white/[.06]">
              {headers.map((h) => (
                <th key={h.key as string} className="text-left p-2 cursor-pointer select-none" onClick={() => onSort(h.key)}>
                  <div className="inline-flex items-center gap-1">
                    {h.label}
                    {sortKey === h.key && <span>{sortAsc ? '▲' : '▼'}</span>}
                  </div>
                </th>
              ))}
              <th className="text-left p-2">รายละเอียด</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-2">{s.firstName}</td>
                <td className="p-2">{s.lastName}</td>
                <td className="p-2">{s.school}</td>
                <td className="p-2 font-mono">{s.gpa.toFixed(2)}</td>
                <td className="p-2">
                  <Link href={`/teacher/${s.id}`} className="text-blue-600 hover:underline">
                    ดูรายละเอียด
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-black/60 dark:text-white/60">
                  ยังไม่มีข้อมูล ลองเพิ่มข้อมูลใหม่
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
