// src/app/admin/users/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';

interface User {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: string;
  joinedAt: string;
  serversCount: number;
}

export default function AdminUsersPage() {
  const { t } = useLang();
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const qs = new URLSearchParams({ q: search, page: String(page), limit: '20' });
        const res = await fetch(`/api/admin/users?${qs}`, { credentials: 'include' });
        if (res.ok) {
          const data = await res.json();
          setUsers(data.users ?? data);
          setTotal(data.total ?? data.length);
        }
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, page]);

  const updateRole = async (userId: string, role: string) => {
    const res = await fetch(`/api/admin/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ role }),
    });
    if (res.ok) setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role } : u)));
  };

  return (
    <div className="space-y-4">
      <div className="card p-4">
        <input
          className="input"
          placeholder={t('Search by Discord ID or username')}
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <div className="card overflow-hidden">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>{t('team_col_user')}</th>
                <th>{t('admin_col_id')}</th>
                <th>{t('team_col_role')}</th>
                <th>{t('admin_col_servers')}</th>
                <th>{t('admin_col_joined')}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('gen_loading')}</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-zinc-400">{t('admin_user_search_not_found')}</td></tr>
              ) : users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      {u.avatar ? (
                        <img src={u.avatar} alt={u.username} className="w-7 h-7 rounded-full" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-red-600/20 flex items-center justify-center text-xs font-bold">
                          {u.username[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{u.username}</p>
                        {u.email && <p className="text-xs text-zinc-500">{u.email}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="font-mono text-xs text-zinc-400">{u.id}</td>
                  <td>
                    <select
                      value={u.role}
                      onChange={(e) => updateRole(u.id, e.target.value)}
                      className="input py-1 text-xs"
                    >
                      <option value="user">{t('sidebar_role_user')}</option>
                      <option value="admin">{t('team_role_admin')}</option>
                      <option value="super_admin">{t('sidebar_role_super_admin')}</option>
                    </select>
                  </td>
                  <td className="text-sm">{u.serversCount}</td>
                  <td className="text-xs text-zinc-500">{new Date(u.joinedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}