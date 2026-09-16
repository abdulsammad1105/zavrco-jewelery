"use client";

import { apiFetch } from "@/lib/api";
import { useState, useEffect, useCallback } from "react";
import type { AdminLog } from "@/types";

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await apiFetch("/api/admin/logs");
    if (res.ok) setLogs(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl tracking-wider uppercase font-light">
          Activity Log ({logs.length})
        </h1>
        <button
          onClick={load}
          className="text-xs tracking-wider uppercase text-chrome hover:text-offwhite transition-colors"
        >
          Refresh
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wider uppercase text-chrome">
              <th className="text-left py-3 px-2">When</th>
              <th className="text-left py-3 px-2">Action</th>
              <th className="text-left py-3 px-2">Details</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className="py-8 text-center text-muted">Loading...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={3} className="py-8 text-center text-muted">No activity yet.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="border-b border-border/50 hover:bg-charcoal/50">
                  <td className="py-3 px-2 text-xs text-muted whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString("en-PK", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td className="py-3 px-2">
                    <span className="text-[10px] px-1.5 py-0.5 bg-charcoal border border-border rounded tracking-wider uppercase">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-muted">{log.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
