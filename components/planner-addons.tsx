'use client';

import { useEffect, useState } from 'react';
import {
  Check,
  ClipboardCheck,
  FileCheck2,
  GitBranch,
  KeyRound,
  LockKeyhole,
  LogIn,
  LogOut,
  PackageCheck,
  Plus,
  ShieldCheck,
  Trash2,
  UserMinus,
  UserPlus,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export type TeamMember = {
  id: string;
  initials: string;
  name: string;
  role: TeamRole;
  team: string;
  discipline: string;
  permissions: string;
  capacity: number;
  status: 'Szabad' | 'Terhelt' | 'Foglalt';
};

type TeamRole =
  | 'PM'
  | 'Épületvillamossági tervező'
  | 'Épületvillamossági tervező gyakornok';

const teamNames = ['A csapat', 'B csapat', 'C csapat', 'Közös'];
const teamRoleOptions: TeamRole[] = [
  'PM',
  'Épületvillamossági tervező',
  'Épületvillamossági tervező gyakornok',
];

export type StateLogEntry = {
  id: string;
  projectCode: string;
  projectName: string;
  from: string;
  to: string;
  author: string;
  at: string;
  note: string;
};

export type ReleaseEntry = {
  id: string;
  projectCode: string;
  title: string;
  version: string;
  date: string;
  author: string;
  status: 'Tervezett' | 'Kiadva' | 'Visszajelzés alatt';
  note: string;
};

type ProjectLike = {
  code: string;
  name: string;
  team: string;
  initials: string[];
};

const demoUser = 'tervezo-demo';
const demoPassword = 'TervDemo-2026!Kiad-47';

export const initialTeamMembers: TeamMember[] = [
  {
    id: 'm1',
    initials: 'T01',
    name: 'Tervező 01',
    role: 'PM',
    team: 'B csapat',
    discipline: 'Erősáram',
    permissions: 'Projekt létrehozás, kiadás jóváhagyás',
    capacity: 72,
    status: 'Terhelt',
  },
  {
    id: 'm2',
    initials: 'T02',
    name: 'Tervező 02',
    role: 'Épületvillamossági tervező',
    team: 'B csapat',
    discipline: 'Világítás',
    permissions: 'Feladat szerkesztés, kommentelés',
    capacity: 58,
    status: 'Szabad',
  },
  {
    id: 'm3',
    initials: 'T03',
    name: 'Tervező 03',
    role: 'Épületvillamossági tervező gyakornok',
    team: 'B csapat',
    discipline: 'Dokumentáció',
    permissions: 'Dokumentáció szerkesztés',
    capacity: 64,
    status: 'Szabad',
  },
  {
    id: 'm4',
    initials: 'T04',
    name: 'Tervező 04',
    role: 'Épületvillamossági tervező',
    team: 'A csapat',
    discipline: 'Villámvédelem',
    permissions: 'Ellenőrzés, státusz módosítás',
    capacity: 81,
    status: 'Foglalt',
  },
  {
    id: 'm5',
    initials: 'T09',
    name: 'Tervező 09',
    role: 'Épületvillamossági tervező',
    team: 'C csapat',
    discipline: 'Elosztók',
    permissions: 'Feladat szerkesztés, kiadás előkészítés',
    capacity: 45,
    status: 'Szabad',
  },
  {
    id: 'm6',
    initials: 'T12',
    name: 'Tervező 12',
    role: 'PM',
    team: 'Közös',
    discipline: 'Minőségellenőrzés',
    permissions: 'Ellenőrzés, kiadás zárolás',
    capacity: 69,
    status: 'Terhelt',
  },
];

export const initialStateLog: StateLogEntry[] = [
  {
    id: 's1',
    projectCode: 'P25020',
    projectName: 'Projekt Alfa',
    from: 'Előkészíthető',
    to: 'Folyamatban',
    author: 'Demo felhasználó',
    at: '2026. szept. 1. 09:12',
    note: 'A vállalás és az alapadatok ellenőrizve.',
  },
  {
    id: 's2',
    projectCode: 'P26074',
    projectName: 'Projekt Gamma',
    from: 'Folyamatban',
    to: 'Munkaközi kiadva',
    author: 'Demo felhasználó',
    at: '2026. aug. 30. 15:40',
    note: 'Munkaközi csomag kiadva belső átnézésre.',
  },
];

export const initialReleases: ReleaseEntry[] = [
  {
    id: 'r1',
    projectCode: 'P25020',
    title: 'Munkaközi tervcsomag',
    version: 'v0.3',
    date: '2026. szept. 12.',
    author: 'Tervező 01',
    status: 'Tervezett',
    note: 'Dokumentáció, elosztók és világítási munkarészek.',
  },
  {
    id: 'r2',
    projectCode: 'P26074',
    title: 'Belső ellenőrzési csomag',
    version: 'v0.2',
    date: '2026. aug. 30.',
    author: 'Tervező 12',
    status: 'Visszajelzés alatt',
    note: 'Ellenőrzési körre átadva.',
  },
  {
    id: 'r3',
    projectCode: 'P26028',
    title: 'Kiviteli tervcsomag',
    version: 'v1.0',
    date: '2026. aug. 28.',
    author: 'Tervező 03',
    status: 'Kiadva',
    note: 'Teljes lezárt csomag.',
  },
];

function statusTone(status: TeamMember['status']) {
  if (status === 'Szabad') return 'bg-emerald-400/12 text-emerald-300';
  if (status === 'Terhelt') return 'bg-amber-300/12 text-amber-200';
  return 'bg-red-400/12 text-red-300';
}

export function LoginGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState(demoUser);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setAuthenticated(
      window.sessionStorage.getItem('planner-demo-auth') === 'ok',
    );
  }, []);

  const login = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (user.trim() === demoUser && password === demoPassword) {
      window.sessionStorage.setItem('planner-demo-auth', 'ok');
      setAuthenticated(true);
      setPassword('');
      setError('');
      return;
    }
    setError('Nem jó felhasználónév vagy jelszó.');
  };

  const logout = () => {
    window.sessionStorage.removeItem('planner-demo-auth');
    setAuthenticated(false);
  };

  if (authenticated) {
    return (
      <>
        {children}
        <Button
          data-comment-control
          variant="outline"
          size="sm"
          onClick={logout}
          className="fixed bottom-5 left-4 z-[65] bg-popover shadow-xl sm:left-6"
        >
          <LogOut />
          Kilépés
        </Button>
      </>
    );
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-4 text-foreground">
      <section className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-[0_24px_70px_rgb(0_0_0/22%)]">
        <div className="mb-6 flex items-start gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-primary/15 text-primary">
            <LockKeyhole className="size-5" />
          </span>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
              Biztonsági belépés
            </p>
            <h1 className="mt-1 text-xl font-black">
              Tervezői projektkövető
            </h1>
          </div>
        </div>
        <form onSubmit={login} className="space-y-4">
          <label className="grid gap-1.5 text-xs font-bold">
            Felhasználó
            <Input
              value={user}
              onChange={(event) => setUser(event.target.value)}
              className="h-11 font-normal"
              autoComplete="username"
            />
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Jelszó
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="h-11 font-normal"
              autoComplete="current-password"
            />
          </label>
          {error && <p className="text-xs font-semibold text-red-300">{error}</p>}
          <Button type="submit" className="w-full">
            <LogIn />
            Belépés
          </Button>
        </form>
        <div className="mt-5 rounded-xl border border-primary/20 bg-primary/[.06] p-3 text-xs text-muted-foreground">
          <p className="flex items-center gap-2 font-semibold text-primary">
            <ShieldCheck className="size-4" />
            Demó védelem
          </p>
          <p className="mt-1">
            Egyetlen tesztfelhasználós kapu, külső fiók vagy regisztráció
            nélkül.
          </p>
        </div>
      </section>
    </main>
  );
}

export function TeamTab({
  project,
  members,
  onProjectTeamChange,
  onProjectMembersChange,
}: {
  project: ProjectLike;
  members: TeamMember[];
  onProjectTeamChange: (team: string) => void;
  onProjectMembersChange: (initials: string[]) => void;
}) {
  const [activeTeam, setActiveTeam] = useState(project.team);

  useEffect(() => {
    setActiveTeam(project.team);
  }, [project.team]);

  const activeTeamMembers = members.filter((member) => member.team === activeTeam);
  const assigned = activeTeamMembers.filter((member) =>
    project.initials.includes(member.initials),
  );
  const available = activeTeamMembers.filter(
    (member) => !project.initials.includes(member.initials),
  );

  const selectTeam = (team: string) => {
    setActiveTeam(team);
  };
  const addMember = (initials: string) =>
    onProjectMembersChange([...project.initials, initials]);
  const removeMember = (initials: string) =>
    onProjectMembersChange(
      project.initials.filter((current) => current !== initials),
    );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-black">Projektcsapat összeállítása</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Itt csak a projekt tagságát állítod; a tervezők adatai külön
              lapon szerkeszthetők.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="bg-muted text-muted-foreground">
              Projekt: {project.team}
            </Badge>
            <Badge className="bg-primary/15 text-primary">
              Nézet: {activeTeam}
            </Badge>
            {activeTeam !== project.team && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onProjectTeamChange(activeTeam)}
              >
                Ez legyen a projektcsapat
              </Button>
            )}
          </div>
        </div>
        <div className="mb-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {teamNames.map((team) => (
            <button
              key={team}
              type="button"
              onClick={() => selectTeam(team)}
              className={`h-9 rounded-lg border px-2 text-xs font-black transition-colors ${
                activeTeam === team
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {team}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {assigned.map((member) => (
            <article
              key={member.id}
              className="rounded-xl border border-primary/25 bg-primary/[.04] p-3"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/20 text-[10px] font-black text-primary">
                    {member.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{member.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      Projekten van
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMember(member.initials)}
                >
                  <UserMinus />
                  Le
                </Button>
              </div>
              <div className="grid gap-2 text-[11px] text-muted-foreground sm:grid-cols-3">
                <span>{member.role}</span>
                <span>{member.discipline}</span>
                <span>{member.capacity}% kapacitás</span>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                Jogosultság: {member.permissions}
              </p>
            </article>
          ))}
          {assigned.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Ehhez a projekthez ebben a csapatban még nincs hozzárendelt ember.
            </div>
          )}
        </div>
      </section>
      <aside className="space-y-4">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold">{activeTeam} · elérhető emberek</h3>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {available.map((member) => (
              <div
                key={member.id}
                className="rounded-lg border border-border bg-background/30 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold">
                      {member.initials} · {member.name}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {member.role} · {member.capacity}% kapacitás
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {member.permissions}
                    </p>
                  </div>
                  <Badge className={statusTone(member.status)}>
                    {member.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addMember(member.initials)}
                  className="mt-3 w-full"
                >
                  <UserPlus />
                  Hozzáadás
                </Button>
              </div>
            ))}
            {available.length === 0 && (
              <div className="rounded-lg border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                Ebben a csapatban nincs több elérhető demó tervező.
              </div>
            )}
          </div>
        </section>
        <section className="rounded-xl border border-primary/25 bg-primary/[.06] p-4">
          <h3 className="text-sm font-bold">Csapatterhelés</h3>
          <div className="mt-3 space-y-3">
            {assigned.map((member) => (
              <div key={member.id}>
                <div className="mb-1 flex justify-between text-[10px] font-semibold">
                  <span>{member.initials}</span>
                  <span>{member.capacity}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${member.capacity}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

export function DesignersDirectory({
  members,
  setMembers,
}: {
  members: TeamMember[];
  setMembers: React.Dispatch<React.SetStateAction<TeamMember[]>>;
}) {
  const [newName, setNewName] = useState('');
  const [newInitials, setNewInitials] = useState('');
  const [newTeam, setNewTeam] = useState('A csapat');
  const [newRole, setNewRole] = useState<TeamRole>(
    'Épületvillamossági tervező',
  );
  const [newPermissions, setNewPermissions] = useState(
    'Feladat szerkesztés, kommentelés',
  );

  const updateMember = (id: string, patch: Partial<TeamMember>) =>
    setMembers((current) =>
      current.map((member) =>
        member.id === id ? { ...member, ...patch } : member,
      ),
    );
  const updateInitials = (member: TeamMember, value: string) => {
    const nextInitials = value.trim().toUpperCase().slice(0, 4);
    if (nextInitials) updateMember(member.id, { initials: nextInitials });
  };
  const addMember = () => {
    if (!newName.trim() || !newInitials.trim()) return;
    setMembers((current) => [
      {
        id: `member-${Date.now()}`,
        initials: newInitials.trim().toUpperCase().slice(0, 4),
        name: newName.trim(),
        role: newRole,
        team: newTeam,
        discipline: 'Épületvillamosság',
        permissions: newPermissions,
        capacity: 50,
        status: 'Szabad',
      },
      ...current,
    ]);
    setNewName('');
    setNewInitials('');
  };
  const removeMember = (id: string) =>
    setMembers((current) => current.filter((member) => member.id !== id));

  return (
    <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-sm font-black">Új tervező</h3>
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-[90px_1fr] gap-2">
            <label className="grid gap-1.5 text-xs font-bold">
              Jel
              <Input
                value={newInitials}
                onChange={(event) => setNewInitials(event.target.value)}
                placeholder="T13"
                className="h-10 font-normal"
              />
            </label>
            <label className="grid gap-1.5 text-xs font-bold">
              Név
              <Input
                value={newName}
                onChange={(event) => setNewName(event.target.value)}
                placeholder="Tervező 13"
                className="h-10 font-normal"
              />
            </label>
          </div>
          <label className="grid gap-1.5 text-xs font-bold">
            Role
            <select
              value={newRole}
              onChange={(event) => setNewRole(event.target.value as TeamRole)}
              className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none"
            >
              {teamRoleOptions.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Csapat
            <select
              value={newTeam}
              onChange={(event) => setNewTeam(event.target.value)}
              className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none"
            >
              {teamNames.map((team) => (
                <option key={team}>{team}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-xs font-bold">
            Jogosultságok
            <Textarea
              value={newPermissions}
              onChange={(event) => setNewPermissions(event.target.value)}
              className="min-h-20 font-normal"
            />
          </label>
          <Button
            onClick={addMember}
            disabled={!newName.trim() || !newInitials.trim()}
            className="w-full"
          >
            <UserPlus />
            Tervező hozzáadása
          </Button>
        </div>
      </section>
      <section className="grid gap-4 xl:grid-cols-2">
        {teamNames.map((team) => {
          const teamMembers = members.filter((member) => member.team === team);
          return (
            <div key={team} className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-sm font-black">{team}</h3>
                <Badge className="bg-primary/15 text-primary">
                  {teamMembers.length} fő
                </Badge>
              </div>
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <article
                    key={member.id}
                    className="rounded-xl border border-border bg-background/35 p-3"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-black">
                        {member.initials} · {member.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeMember(member.id)}
                        aria-label="Tervező törlése"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                    <EditableMemberRow
                      member={member}
                      updateMember={updateMember}
                      updateInitials={updateInitials}
                    />
                  </article>
                ))}
                {teamMembers.length === 0 && (
                  <div className="rounded-lg border border-dashed border-border p-5 text-center text-xs text-muted-foreground">
                    Nincs még tervező ebben a csapatban.
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

function EditableMemberRow({
  member,
  compact = false,
  updateMember,
  updateInitials,
}: {
  member: TeamMember;
  compact?: boolean;
  updateMember: (id: string, patch: Partial<TeamMember>) => void;
  updateInitials: (member: TeamMember, value: string) => void;
}) {
  return (
    <div className={`grid gap-2 ${compact ? '' : 'sm:grid-cols-[70px_1fr_1fr]'}`}>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">
        Jel
        <Input
          value={member.initials}
          onChange={(event) => updateInitials(member, event.target.value)}
          className="h-8 text-xs font-semibold"
        />
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">
        Név
        <Input
          value={member.name}
          onChange={(event) => updateMember(member.id, { name: event.target.value })}
          className="h-8 text-xs font-semibold"
        />
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">
        Szakterület
        <Input
          value={member.discipline}
          onChange={(event) =>
            updateMember(member.id, { discipline: event.target.value })
          }
          className="h-8 text-xs font-semibold"
        />
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground sm:col-span-3">
        Jogosultságok
        <Textarea
          value={member.permissions}
          onChange={(event) =>
            updateMember(member.id, { permissions: event.target.value })
          }
          className="min-h-16 text-xs font-semibold"
        />
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground sm:col-span-2">
        Role
        <select
          value={member.role}
          onChange={(event) =>
            updateMember(member.id, { role: event.target.value as TeamRole })
          }
          className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-semibold text-foreground outline-none"
        >
          {teamRoleOptions.map((role) => (
            <option key={role}>{role}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">
        Csapat
        <select
          value={member.team}
          onChange={(event) => updateMember(member.id, { team: event.target.value })}
          className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-semibold text-foreground outline-none"
        >
          {teamNames.map((team) => (
            <option key={team}>{team}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">
        Kapacitás
        <Input
          value={String(member.capacity)}
          type="number"
          min={0}
          max={100}
          onChange={(event) =>
            updateMember(member.id, {
              capacity: Math.max(0, Math.min(100, Number(event.target.value) || 0)),
            })
          }
          className="h-8 text-xs font-semibold"
        />
      </label>
      <label className="grid gap-1 text-[10px] font-bold uppercase text-muted-foreground">
        Státusz
        <select
          value={member.status}
          onChange={(event) =>
            updateMember(member.id, {
              status: event.target.value as TeamMember['status'],
            })
          }
          className="h-8 rounded-lg border border-input bg-card px-2 text-xs font-semibold text-foreground outline-none"
        >
          <option>Szabad</option>
          <option>Terhelt</option>
          <option>Foglalt</option>
        </select>
      </label>
    </div>
  );
}

export function CommitmentTaskSuggestions({
  includedItems,
  existingTaskTitles,
  onApprove,
}: {
  includedItems: string[];
  existingTaskTitles: string[];
  onApprove: (titles: string[]) => void;
}) {
  const suggestions = includedItems.slice(0, 6).map((item, index) => ({
    id: `commitment-${index}`,
    title: item.length > 64 ? `${item.slice(0, 64)}…` : item,
    source: item,
  }));
  const [selected, setSelected] = useState(
    new Set(suggestions.slice(0, 3).map((item) => item.id)),
  );
  const approved = suggestions.filter((item) => selected.has(item.id));

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <section className="rounded-xl border border-primary/25 bg-primary/[.05] p-4">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black">Vállalásból javasolt feladatok</h3>
          <p className="mt-1 text-[11px] text-muted-foreground">
            A rendszer csak javasol; a feladatokat kézzel kell jóváhagyni.
          </p>
        </div>
        <Button
          size="sm"
          disabled={approved.length === 0}
          onClick={() => onApprove(approved.map((item) => item.title))}
        >
          <ClipboardCheck />
          {approved.length} jóváhagyása
        </Button>
      </div>
      <div className="grid gap-2 md:grid-cols-2">
        {suggestions.map((item) => {
          const alreadyExists = existingTaskTitles.some((title) =>
            item.title.toLowerCase().includes(title.toLowerCase()),
          );
          return (
            <label
              key={item.id}
              className="flex cursor-pointer gap-3 rounded-lg border border-border bg-card p-3"
            >
              <input
                type="checkbox"
                checked={selected.has(item.id)}
                onChange={() => toggle(item.id)}
                className="mt-1 size-4 accent-primary"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-xs font-bold leading-snug">
                  {item.title}
                </span>
                <span className="mt-1 block text-[10px] text-muted-foreground">
                  {alreadyExists ? 'Hasonló feladat már van' : 'Új részfeladat'}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}

export function PlanningLogTab({
  project,
  stateLog,
  releases,
  setReleases,
}: {
  project: ProjectLike;
  stateLog: StateLogEntry[];
  releases: ReleaseEntry[];
  setReleases: React.Dispatch<React.SetStateAction<ReleaseEntry[]>>;
}) {
  const [title, setTitle] = useState('Munkaközi tervcsomag');
  const [version, setVersion] = useState('v0.4');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');
  const projectStateLog = stateLog.filter(
    (entry) => entry.projectCode === project.code,
  );
  const projectReleases = releases.filter(
    (release) => release.projectCode === project.code,
  );

  const addRelease = () => {
    if (!title.trim() || !version.trim()) return;
    setReleases((current) => [
      {
        id: `release-${Date.now()}`,
        projectCode: project.code,
        title: title.trim(),
        version: version.trim(),
        date: date || 'Dátum nélkül',
        author: 'Demo felhasználó',
        status: 'Tervezett',
        note: note.trim() || 'Új kiadási pont.',
      },
      ...current,
    ]);
    setNote('');
  };

  const removeRelease = (id: string) =>
    setReleases((current) => current.filter((release) => release.id !== id));

  const updateReleaseStatus = (id: string, status: ReleaseEntry['status']) =>
    setReleases((current) =>
      current.map((release) =>
        release.id === id ? { ...release, status } : release,
      ),
    );

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]">
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black">Tervezési állapotnapló</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Minden kézi állapotváltás visszakereshető.
            </p>
          </div>
          <GitBranch className="size-4 text-muted-foreground" />
        </div>
        <div className="relative space-y-4 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-border">
          {projectStateLog.map((entry) => (
            <article key={entry.id} className="relative flex gap-4">
              <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
                <Check className="size-4" />
              </span>
              <div className="flex-1 rounded-xl border border-border bg-background/35 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-bold">
                    {entry.from} → {entry.to}
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    {entry.at}
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-foreground/85">
                  {entry.note}
                </p>
                <p className="mt-2 text-[10px] text-muted-foreground">
                  Módosította: {entry.author}
                </p>
              </div>
            </article>
          ))}
          {projectStateLog.length === 0 && (
            <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
              Ennél a projektnél még nincs állapotváltás.
            </div>
          )}
        </div>
      </section>
      <aside className="space-y-4">
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center gap-2">
            <PackageCheck className="size-4 text-primary" />
            <h3 className="text-sm font-bold">Új kiadási pont</h3>
          </div>
          <div className="space-y-3">
            <Input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="h-9"
              placeholder="Kiadás neve"
            />
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                className="h-9"
                placeholder="Verzió"
              />
              <Input
                value={date}
                onChange={(event) => setDate(event.target.value)}
                type="date"
                className="h-9"
              />
            </div>
            <Textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="Megjegyzés a kiadáshoz…"
              className="min-h-20"
            />
            <Button onClick={addRelease} className="w-full">
              <Plus />
              Kiadás felvétele
            </Button>
          </div>
        </section>
        <section className="rounded-xl border border-border bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold">Kiadási napló</h3>
            <FileCheck2 className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            {projectReleases.map((release) => (
              <article
                key={release.id}
                className="rounded-lg border border-border bg-background/35 p-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold">
                      {release.version} · {release.title}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {release.date} · {release.author}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => removeRelease(release.id)}
                    aria-label="Kiadás törlése"
                  >
                    <Trash2 />
                  </Button>
                </div>
                <p className="mt-2 text-[11px] leading-relaxed text-foreground/80">
                  {release.note}
                </p>
                <select
                  value={release.status}
                  onChange={(event) =>
                    updateReleaseStatus(
                      release.id,
                      event.target.value as ReleaseEntry['status'],
                    )
                  }
                  className="mt-3 h-8 w-full rounded-md border border-input bg-card px-2 text-[11px] font-semibold outline-none"
                >
                  <option>Tervezett</option>
                  <option>Visszajelzés alatt</option>
                  <option>Kiadva</option>
                </select>
              </article>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}

export function DemoCredentialsNote() {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
      <KeyRound className="size-3" />
      {demoUser}
    </span>
  );
}
