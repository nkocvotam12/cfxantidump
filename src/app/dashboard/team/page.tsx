'use client';

import { useEffect, useState } from 'react';
import { useLang } from '@/hooks/useLang';
import { SortableItem } from '@/components/ui/SortableItem';
// 1. Thêm import cho DnD
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors, 
  DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';

interface TeamMember {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  role: 'owner' | 'master' | 'admin' | 'user';
  permissions: { logs: boolean; discord: boolean; iplists: boolean; team: boolean };
}

interface SearchUser {
  id: string;
  username: string;
  email?: string;
  avatar?: string;
  alreadyAdded?: boolean;
}

const PERMISSION_LABELS: Array<{ key: keyof TeamMember['permissions']; labelKey: string; descKey: string }> = [
  { key: 'logs', labelKey: 'team_perm_logs', descKey: 'team_perm_logs_desc' },
  { key: 'discord', labelKey: 'team_perm_discord', descKey: 'team_perm_discord_desc' },
  { key: 'iplists', labelKey: 'team_perm_iplists', descKey: 'team_perm_iplists_desc' },
  { key: 'team', labelKey: 'team_perm_team', descKey: 'team_perm_team_desc' },
];

export default function TeamPage() {
  const { t } = useLang();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<SearchUser[]>([]);
  const [searching, setSearching] = useState(false);

  const loadMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/team', { credentials: 'include' });
      if (res.ok) setMembers(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMembers(); }, []);

  useEffect(() => {
    if (!search.trim()) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/team/search?q=${encodeURIComponent(search)}`, { credentials: 'include' });
        if (res.ok) setResults(await res.json());
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const addMember = async (user: SearchUser) => {
    try {
      const res = await fetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ userId: user.id }),
      });
      if (res.ok) {
        setSearch('');
        setResults([]);
        await loadMembers();
      }
    } catch (e) {
      console.error('Failed to add user', e);
    }
  };

  const removeMember = async (member: TeamMember) => {
    if (!confirm(t('team_remove_confirm').replace('{username}', member.username))) return;
    try {
      const res = await fetch(`/api/team/${member.id}`, { method: 'DELETE', credentials: 'include' });
      if (res.ok) await loadMembers();
    } catch (e) {
      console.error('Failed to remove member', e);
    }
  };

  const updatePermission = async (member: TeamMember, key: keyof TeamMember['permissions'], value: boolean) => {
    const updated = { ...member, permissions: { ...member.permissions, [key]: value } };
    setMembers((prev) => prev.map((m) => (m.id === member.id ? updated : m)));
    try {
      await fetch(`/api/team/${member.id}/permissions`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(updated.permissions),
      });
    } catch (e) {
      console.error('Failed to update permissions', e);
      loadMembers();
    }
  };

  // 2. Khởi tạo sensors cho DnD
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Tránh click nhầm khi kéo
      },
    }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = members.findIndex((m) => m.id === active.id);
      const newIndex = members.findIndex((m) => m.id === over.id);
      const newOrder = arrayMove(members, oldIndex, newIndex);
      
      setMembers(newOrder); // Cập nhật UI ngay lập tức
      
      try {
        await fetch('/api/team/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ orderedIds: newOrder.map((m) => m.id) }),
        });
      } catch (e) {
        console.error('Failed to save order', e);
        loadMembers(); // Revert nếu API lỗi
      }
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('team_title')}</h1>
        <p className="text-sm text-zinc-400 mt-1">{t('team_subtitle')}</p>
      </div>

      {/* Add member search */}
      <div className="card p-4">
        <label className="block text-sm font-medium mb-2">{t('team_how_to_add')}</label>
        <input
          className="input"
          placeholder={t('team_search_placeholder')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <p className="text-xs text-zinc-500 mt-2">{t('team_how_to_add_desc')}</p>

        {search.trim() && (
          <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
            {searching ? (
              <p className="text-sm text-zinc-400 py-2">{t('gen_loading')}</p>
            ) : results.length === 0 ? (
              <div className="py-4 text-center">
                <p className="text-sm font-medium">{t('team_search_none')}</p>
                <p className="text-xs text-zinc-500 mt-1">{t('team_search_none_desc')}</p>
              </div>
            ) : results.map((u) => (
              <div key={u.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                <div className="flex items-center gap-3">
                  {u.avatar ? (
                    <img src={u.avatar} alt={u.username} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-red-600/20 flex items-center justify-center text-xs font-bold">
                      {u.username[0]?.toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{u.username}</p>
                    {u.email && <p className="text-xs text-zinc-500">{u.email}</p>}
                  </div>
                </div>
                {u.alreadyAdded ? (
                  <span className="badge badge-gray">{t('team_added_badge')}</span>
                ) : (
                  <button onClick={() => addMember(u)} className="btn-primary text-xs">
                    <i className="fa-solid fa-plus" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Members list with DnD */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-semibold">{t('team_members_count').replace('{count}', String(members.length))}</h2>
          <span className="text-xs text-zinc-500 italic"><i className="fa-solid fa-grip-vertical mr-1"/> {t('Drag to reorder') || 'Drag to reorder'}</span>
        </div>
        
        {loading ? (
          <div className="p-8 text-center text-zinc-400">{t('gen_loading')}</div>
        ) : members.length === 0 ? (
          <div className="p-8 text-center">
            <p className="font-semibold">{t('team_empty')}</p>
            <p className="text-xs text-zinc-500 mt-1">{t('team_empty_desc')}</p>
          </div>
        ) : (
          // 3. Tích hợp DnDContext và SortableContext
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={members.map((m) => m.id)} strategy={verticalListSortingStrategy}>
              <div className="divide-y divide-white/[0.03]">
                {members.map((m) => {
                  const protectedMember = m.role === 'master' || m.role === 'owner';
                  return (
                    // 4. Bọc SortableItem
                    <SortableItem key={m.id} id={m.id}>
                      <div className="p-4 flex flex-col lg:flex-row lg:items-center gap-4 bg-bg-card hover:bg-white/[0.01] transition-colors">
                        
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {/* Icon kéo thả */}
                          <div className="cursor-grab active:cursor-grabbing text-zinc-600 hover:text-zinc-300 p-1">
                            <i className="fa-solid fa-grip-vertical" />
                          </div>
                          
                          {m.avatar ? (
                            <img src={m.avatar} alt={m.username} className="w-10 h-10 rounded-full" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-red-600/20 flex items-center justify-center font-bold">
                              {m.username[0]?.toUpperCase()}
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-sm font-semibold truncate">@{m.username}</p>
                            <p className="text-xs text-zinc-500">
                              {m.role === 'master' && t('team_role_master')}
                              {m.role === 'owner' && t('team_role_owner')}
                              {m.role === 'admin' && t('team_role_admin')}
                              {m.role === 'user' && t('team_role_user')}
                            </p>
                          </div>
                          {protectedMember && (
                            <span className="badge badge-purple ml-2">{t('team_master_info_badge')}</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 flex-1">
                          {PERMISSION_LABELS.map((perm) => (
                            <div key={perm.key} className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`perm-${m.id}-${perm.key}`}
                                checked={m.permissions[perm.key]}
                                disabled={protectedMember}
                                onChange={(e) => updatePermission(m, perm.key, e.target.checked)}
                                className="w-4 h-4 accent-red-600 disabled:opacity-40"
                              />
                              <label htmlFor={`perm-${m.id}-${perm.key}`} className="text-xs cursor-pointer">
                                {t(perm.labelKey)}
                              </label>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => removeMember(m)}
                          disabled={protectedMember}
                          className="btn-danger text-xs disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <i className="fa-solid fa-user-minus" /> {t('team_remove')}
                        </button>
                      </div>
                    </SortableItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="card p-4 bg-amber-500/[0.07] border-amber-500/25">
        <h3 className="font-semibold text-amber-300 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved" /> {t('team_master_protection')}
        </h3>
        <p className="text-xs text-zinc-400 mt-1">{t('team_master_protection_desc')}</p>
      </div>
    </div>
  );
}