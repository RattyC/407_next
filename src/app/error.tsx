"use client";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="space-y-3">
      <h1 className="text-2xl brand-heading text-crimson">เกิดข้อผิดพลาด</h1>
      <p className="text-sm text-black/70 dark:text-white/70">{error.message || 'Something went wrong'}</p>
      <button className="px-4 py-2 rounded-md btn-primary" onClick={() => reset()}>ลองใหม่</button>
    </div>
  );
}

