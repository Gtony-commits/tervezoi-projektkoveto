'use client';

import { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  Bell,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  ClipboardList,
  Columns3,
  Database,
  Filter,
  FolderKanban,
  GitBranch,
  List,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Users,
  X,
  Zap,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PageComments } from '@/components/page-comments';
import {
  CommitmentTaskSuggestions,
  DemoCredentialsNote,
  DesignersDirectory,
  initialReleases,
  initialStateLog,
  initialTeamMembers,
  PlanningLogTab,
  type ReleaseEntry,
  type StateLogEntry,
  TeamTab,
  type TeamMember,
} from '@/components/planner-addons';

type ProjectState =
  | 'Elkezdhető'
  | 'Előkészíthető'
  | 'Folyamatban'
  | 'Átnézendő'
  | 'Munkaközi kiadva'
  | 'Módosítandó'
  | 'Kiviteli kiadva'
  | 'Kész';
type DetailTab =
  | 'áttekintés'
  | 'feladatok'
  | 'csapat'
  | 'vállalás'
  | 'napló'
  | 'pénzügy'
  | 'tevékenység';
type Project = {
  id: number;
  name: string;
  code: string;
  offer: string;
  team: string;
  initials: string[];
  progress: number;
  due: string;
  dueLong: string;
  state: ProjectState;
  priority: 'Magas' | 'Közepes' | 'Alacsony';
  finance: string;
  color: string;
};
type Task = {
  id: string;
  title: string;
  due: string;
  owner: string;
  done: boolean;
  late?: boolean;
};
type TaskGroup = { id: string; title: string; tone: string; tasks: Task[] };

const initialProjects: Project[] = [
  {
    id: 1,
    name: 'Projekt Alfa',
    code: 'P25020',
    offer: 'A25-041',
    team: 'B csapat',
    initials: ['T01', 'T02', 'T03', 'T04'],
    progress: 68,
    due: 'szept. 14.',
    dueLong: '2026. szeptember 14.',
    state: 'Folyamatban',
    priority: 'Magas',
    finance: 'Aláírásra vár',
    color: '#48d7a4',
  },
  {
    id: 2,
    name: 'Projekt Béta',
    code: 'P26067',
    offer: 'A26-112',
    team: 'A csapat',
    initials: ['T05', 'T06', 'T07'],
    progress: 42,
    due: 'szept. 21.',
    dueLong: '2026. szeptember 21.',
    state: 'Előkészíthető',
    priority: 'Közepes',
    finance: 'Szerződéskötés',
    color: '#62a4ff',
  },
  {
    id: 3,
    name: 'Projekt Gamma',
    code: 'P26074',
    offer: 'A26-129',
    team: 'Közös',
    initials: ['T08', 'T09'],
    progress: 81,
    due: 'szept. 4.',
    dueLong: '2026. szeptember 4.',
    state: 'Folyamatban',
    priority: 'Közepes',
    finance: 'TIG kiállítható',
    color: '#9e83ff',
  },
  {
    id: 4,
    name: 'Projekt Delta',
    code: 'P26077',
    offer: 'A26-131',
    team: 'B csapat',
    initials: ['T09', 'T10', 'T07'],
    progress: 26,
    due: 'okt. 2.',
    dueLong: '2026. október 2.',
    state: 'Módosítandó',
    priority: 'Alacsony',
    finance: 'Aláírva',
    color: '#f1ab62',
  },
  {
    id: 5,
    name: 'Projekt Epszilon',
    code: 'P26052',
    offer: 'A26-087',
    team: 'B csapat',
    initials: ['T02', 'T09'],
    progress: 54,
    due: 'szept. 28.',
    dueLong: '2026. szeptember 28.',
    state: 'Folyamatban',
    priority: 'Közepes',
    finance: 'TIG aláírásra vár',
    color: '#54c9d9',
  },
  {
    id: 6,
    name: 'Projekt Zéta',
    code: 'P25069',
    offer: 'A25-228',
    team: 'C csapat',
    initials: ['T11', 'T08', 'T01'],
    progress: 93,
    due: 'szept. 9.',
    dueLong: '2026. szeptember 9.',
    state: 'Kiviteli kiadva',
    priority: 'Közepes',
    finance: 'Dokumentáció lezárva',
    color: '#df7fde',
  },
  {
    id: 7,
    name: 'Projekt Éta',
    code: 'P26028',
    offer: 'A26-031',
    team: 'A csapat',
    initials: ['T05', 'T03'],
    progress: 100,
    due: 'aug. 28.',
    dueLong: '2026. augusztus 28.',
    state: 'Kész',
    priority: 'Alacsony',
    finance: 'Számla kiállítva',
    color: '#67c977',
  },
  {
    id: 8,
    name: 'Projekt Théta',
    code: 'P26079',
    offer: 'A26-138',
    team: 'B csapat',
    initials: ['T12', 'T09'],
    progress: 18,
    due: 'okt. 12.',
    dueLong: '2026. október 12.',
    state: 'Előkészíthető',
    priority: 'Magas',
    finance: 'Szerződéskötés',
    color: '#f0786c',
  },
];

const initialGroups: TaskGroup[] = [
  {
    id: 'docs',
    title: 'Dokumentáció',
    tone: '#62a4ff',
    tasks: [
      {
        id: 'd1',
        title: 'Nézeti képek',
        due: 'szept. 10.',
        owner: 'T01',
        done: true,
      },
      {
        id: 'd2',
        title: 'Tervjegyzék',
        due: 'szept. 11.',
        owner: 'T09',
        done: true,
      },
      {
        id: 'd3',
        title: 'Költségvetés',
        due: 'szept. 13.',
        owner: 'T09',
        done: false,
      },
      {
        id: 'd4',
        title: 'Műszaki leírás',
        due: 'szept. 13.',
        owner: 'T03',
        done: false,
      },
      {
        id: 'd5',
        title: 'Villámvédelem kockázatelemzés',
        due: 'szept. 12.',
        owner: 'T01',
        done: false,
        late: true,
      },
    ],
  },
  {
    id: 'boards',
    title: 'Elosztók',
    tone: '#c9f257',
    tasks: [
      { id: 'e1', title: 'CSF', due: 'szept. 8.', owner: 'T09', done: true },
      { id: 'e2', title: 'FE', due: 'szept. 8.', owner: 'T09', done: true },
      { id: 'e3', title: 'CSM0-1', due: 'szept. 9.', owner: 'T09', done: true },
      {
        id: 'e4',
        title: 'ESZ1-8',
        due: 'szept. 10.',
        owner: 'T09',
        done: true,
      },
      {
        id: 'e5',
        title: 'L1–L4',
        due: 'szept. 12.',
        owner: 'T02',
        done: false,
      },
    ],
  },
  {
    id: 'site',
    title: 'Installáció',
    tone: '#48d7a4',
    tasks: [
      {
        id: 'i1',
        title: 'Áramköri kiosztás',
        due: 'szept. 9.',
        owner: 'T02',
        done: true,
      },
      {
        id: 'i2',
        title: 'Alaprajzi konszignáció',
        due: 'szept. 11.',
        owner: 'T02',
        done: false,
      },
      {
        id: 'i3',
        title: 'Falnézetek',
        due: 'szept. 12.',
        owner: 'T02',
        done: false,
      },
      {
        id: 'i4',
        title: 'Födémcsövezés',
        due: 'szept. 14.',
        owner: 'T02',
        done: false,
      },
    ],
  },
  {
    id: 'check',
    title: 'Ellenőrzés',
    tone: '#9e83ff',
    tasks: [
      {
        id: 'c1',
        title: 'Installáció ellenőrzés',
        due: 'szept. 14.',
        owner: 'T12',
        done: false,
      },
      {
        id: 'c2',
        title: 'Nyomvonal ellenőrzés',
        due: 'szept. 14.',
        owner: 'T12',
        done: false,
      },
      {
        id: 'c3',
        title: 'Költségvetés ellenőrzés',
        due: 'szept. 14.',
        owner: 'T12',
        done: false,
      },
    ],
  },
];

const financeSteps = [
  'Szerződéskötés folyamatban',
  'Aláírásra vár',
  'Aláírva mindkét fél által',
  'TIG kiállítható',
  'TIG aláírásra vár',
  'TIG aláírva',
  'Dokumentáció lezárva',
  'Számla kiállítva',
  'Számla fizetve',
];
const projectStateOptions: ProjectState[] = [
  'Elkezdhető',
  'Előkészíthető',
  'Folyamatban',
  'Átnézendő',
  'Munkaközi kiadva',
  'Kiviteli kiadva',
  'Módosítandó',
  'Kész',
];
const commitmentContent = {
  included: [
    '3D modell készítés (Revit modell, LOD300, elosztóberendezések, lámpatestek és kábeltálcák megjelenítésével)',
    'Belső terek általános világítási rendszerének tervezése részletes világításméretezés alapján',
    'Belső terek tartalékvilágításának tervezése',
    'Erőátvitel, épületen belüli villamos fogyasztók betáplálásának tervezése',
    'Gépészeti automatika, épületautomatika és BMS tervezés',
    'Gyengeáramú rendszerek tervezése',
    'Kábelméretezés, zárlatszámítás és feszültségesés-számítás',
    'Kisfeszültségű elosztóberendezések tervezése',
    'Teleken belüli kültéri területek világítás- és erősáram-tervezése',
    'Tűzjelző, üzemi hangosítási és villámvédelmi rendszerek tervezése',
  ],
  excluded: [
    'BREEAM tervcsomag',
    'Gyártmánytervezés',
    'Hatósági ügyintézés',
    'Idegen nyelvű tervcsomag készítése',
    'Közműmentesítés',
    'Megvalósulási tervcsomag',
    'Nyomtatott példányok készítése',
    'Technológia tervezés',
    'Üzemeltetési kézikönyv',
  ],
  notShown: [
    '3D tervezés (Revit)',
    'Árazatlan költségvetés',
    'Beléptető rendszer tervezése',
    'Belső terek világítási rendszere',
    'BIM modell üzemeltetési célra',
    'Gépészeti tervezés',
    'Gyengeáramú rendszerek tervezése',
    'Hő- és füstelvezetés',
    'Kamera rendszer tervezése',
    'Kiviteli költségvetés készítése',
    'Tender dokumentáció készítése',
    'Tűzjelző rendszer tervezése',
    'Üzemi hangosítási rendszer',
  ],
  note: 'A vállalás a bérleményi tervezésre vonatkozik; az alapépületi munkarészek és a külön jelölt területek nem részei a tervezési csomagnak.',
};
const activityItems = [
  {
    who: 'Tervező 02',
    when: 'Ma, 09:42',
    text: 'A költségvetés első verziója feltöltve.',
    icon: Paperclip,
  },
  {
    who: 'PM 01',
    when: 'Tegnap, 16:18',
    text: 'Az L1–L4 elosztók határideje frissült.',
    icon: CalendarDays,
  },
  {
    who: 'Rendszerautomatizmus',
    when: 'Tegnap, 08:00',
    text: 'Emlékeztető kiküldve: 3 közelgő feladat.',
    icon: Zap,
  },
];
const stateTone: Record<ProjectState, string> = {
  Elkezdhető: 'bg-slate-400/12 text-slate-300 border-slate-400/20',
  Előkészíthető: 'bg-sky-400/12 text-sky-300 border-sky-400/20',
  Folyamatban: 'bg-emerald-400/12 text-emerald-300 border-emerald-400/20',
  Átnézendő: 'bg-amber-400/12 text-amber-300 border-amber-400/20',
  'Munkaközi kiadva': 'bg-cyan-400/12 text-cyan-300 border-cyan-400/20',
  Módosítandó: 'bg-orange-400/12 text-orange-300 border-orange-400/20',
  'Kiviteli kiadva': 'bg-violet-400/12 text-violet-300 border-violet-400/20',
  Kész: 'bg-lime-400/12 text-lime-300 border-lime-400/20',
};
const avatarTones = [
  'bg-violet-400',
  'bg-cyan-400',
  'bg-emerald-400',
  'bg-amber-300',
  'bg-pink-400',
];

function AvatarStack({
  initials,
  limit = 4,
}: {
  initials: string[];
  limit?: number;
}) {
  return (
    <div
      className="flex -space-x-1.5"
      aria-label={`Felelősök: ${initials.join(', ')}`}
    >
      {initials.slice(0, limit).map((initial, index) => (
        <span
          key={initial}
          className={`grid size-6 place-items-center rounded-full border-2 border-card text-[8px] font-black text-slate-950 ${avatarTones[index % avatarTones.length]}`}
        >
          {initial}
        </span>
      ))}
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  note,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  note: string;
  tone: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-[0_10px_30px_rgb(0_0_0/8%)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-muted-foreground">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-tight">{value}</p>
          <p className="mt-1 text-[11px] text-muted-foreground">{note}</p>
        </div>
        <span
          className="grid size-9 place-items-center rounded-lg"
          style={{ backgroundColor: `${tone}20`, color: tone }}
        >
          <Icon className="size-4" />
        </span>
      </div>
    </div>
  );
}

const teamOptions = ['A csapat', 'B csapat', 'C csapat', 'Közös'];

function TeamSelectPill({
  value,
  onChange,
}: {
  value: string;
  onChange: (team: string) => void;
}) {
  return (
    <select
      value={value}
      onClick={(event) => event.stopPropagation()}
      onChange={(event) => {
        event.stopPropagation();
        onChange(event.target.value);
      }}
      className="h-8 rounded-full border border-input bg-background px-3 text-xs font-black text-foreground outline-none transition-colors hover:border-primary/50 focus:border-primary"
      aria-label="Projektcsapat kiválasztása"
    >
      {teamOptions.map((team) => (
        <option key={team}>{team}</option>
      ))}
    </select>
  );
}

export function NinaPlanner() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(1);
  const [query, setQuery] = useState('');
  const [teamFilter, setTeamFilter] = useState('Minden csapat');
  const [stateFilter, setStateFilter] = useState('Minden állapot');
  const [section, setSection] = useState<'projects' | 'designers'>('projects');
  const [view, setView] = useState<'list' | 'board'>('list');
  const [tab, setTab] = useState<DetailTab>('áttekintés');
  const [groups, setGroups] = useState(initialGroups);
  const [openGroups, setOpenGroups] = useState(
    new Set(initialGroups.map((group) => group.id)),
  );
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectTeam, setNewProjectTeam] = useState('A csapat');
  const [newProjectPriority, setNewProjectPriority] =
    useState<Project['priority']>('Közepes');
  const [templates, setTemplates] = useState([
    {
      id: 'tpl-1',
      name: 'Általános épületvillamossági terv',
      team: 'B csapat',
      items: ['Dokumentáció', 'Elosztók', 'Installáció', 'Ellenőrzés'],
    },
    {
      id: 'tpl-2',
      name: 'Gyengeáramú feladatcsomag',
      team: 'C csapat',
      items: ['Tűzjelző', 'Kamera', 'IT hálózat', 'Költségvetés'],
    },
  ]);
  const [templateName, setTemplateName] = useState('');
  const [templateTeam, setTemplateTeam] = useState('A csapat');
  const [templateItems, setTemplateItems] = useState(
    'Dokumentáció\nElosztók\nInstalláció\nEllenőrzés',
  );
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskOwner, setNewTaskOwner] = useState('T01');
  const [newTaskDue, setNewTaskDue] = useState('');
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<
    { who: string; when: string; text: string; icon: typeof MessageSquare }[]
  >([]);
  const [teamMembers, setTeamMembers] =
    useState<TeamMember[]>(initialTeamMembers);
  const [stateLog, setStateLog] = useState<StateLogEntry[]>(initialStateLog);
  const [releases, setReleases] = useState<ReleaseEntry[]>(initialReleases);
  const [toast, setToast] = useState('');

  const selected =
    projects.find((project) => project.id === selectedId) ?? projects[0];
  const filtered = projects.filter(
    (project) =>
      `${project.name} ${project.code}`
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (teamFilter === 'Minden csapat' || project.team === teamFilter) &&
      (stateFilter === 'Minden állapot' || project.state === stateFilter),
  );
  const taskTotal = groups.reduce((sum, group) => sum + group.tasks.length, 0);
  const taskDone = groups.reduce(
    (sum, group) => sum + group.tasks.filter((task) => task.done).length,
    0,
  );
  const taskProgress = Math.round((taskDone / taskTotal) * 100);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2500);
  };
  const updateProjectState = (state: ProjectState) => {
    if (state === selected.state) return;
    setProjects((current) =>
      current.map((project) =>
        project.id === selected.id ? { ...project, state } : project,
      ),
    );
    setStateLog((current) => [
      {
        id: `state-${Date.now()}`,
        projectCode: selected.code,
        projectName: selected.name,
        from: selected.state,
        to: state,
        author: 'Demo felhasználó',
        at: new Intl.DateTimeFormat('hu-HU', {
          dateStyle: 'medium',
          timeStyle: 'short',
        }).format(new Date()),
        note: 'Kézi állapotváltás a tervezői felületen.',
      },
      ...current,
    ]);
    showToast(`Tervezési állapot: ${state}.`);
  };
  const updateProjectTeam = (team: string) => {
    updateProjectTeamForProject(selected.id, team);
  };
  const updateProjectTeamForProject = (projectId: number, team: string) => {
    const teamInitials = teamMembers
      .filter((member) => member.team === team)
      .map((member) => member.initials);
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              team,
              initials:
                project.initials.filter((initial) =>
                  teamInitials.includes(initial),
                ).length > 0
                  ? project.initials.filter((initial) =>
                      teamInitials.includes(initial),
                    )
                  : teamInitials.slice(0, 2),
            }
          : project,
      ),
    );
    showToast(`Csapat frissítve: ${team}.`);
  };
  const updateProjectMembers = (initials: string[]) => {
    setProjects((current) =>
      current.map((project) =>
        project.id === selected.id ? { ...project, initials } : project,
      ),
    );
    showToast('Projektcsapat frissítve.');
  };
  const toggleTask = (groupId: string, taskId: string, checked: boolean) =>
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? {
              ...group,
              tasks: group.tasks.map((task) =>
                task.id === taskId ? { ...task, done: checked } : task,
              ),
            }
          : group,
      ),
    );
  const addProject = () => {
    if (!newProjectName.trim()) return;
    const nextId = Math.max(...projects.map((project) => project.id)) + 1;
    const starterInitials = teamMembers
      .filter((member) => member.team === newProjectTeam)
      .slice(0, 2)
      .map((member) => member.initials);
    const newProject: Project = {
      id: nextId,
      name: newProjectName.trim(),
      code: `P26${String(nextId + 80).padStart(3, '0')}`,
      offer: '–',
      team: newProjectTeam,
      initials: starterInitials,
      progress: 0,
      due: 'nincs',
      dueLong: 'Nincs megadva',
      state: 'Előkészíthető',
      priority: newProjectPriority,
      finance: 'Szerződéskötés',
      color: '#48d7a4',
    };
    setProjects((current) => [newProject, ...current]);
    setSelectedId(nextId);
    setNewProjectName('');
    setNewProjectOpen(false);
    setSection('projects');
    setView('list');
    showToast('Az új projekt létrejött.');
  };
  const createTemplate = () => {
    if (!templateName.trim()) return;
    setTemplates((current) => [
      {
        id: `tpl-${Date.now()}`,
        name: templateName.trim(),
        team: templateTeam,
        items: templateItems
          .split('\n')
          .map((item) => item.trim())
          .filter(Boolean),
      },
      ...current,
    ]);
    setTemplateName('');
    showToast('A sablon létrejött.');
  };
  const startProjectFromTemplate = (template: (typeof templates)[number]) => {
    setNewProjectName(`${template.name} projekt`);
    setNewProjectTeam(template.team);
    setTemplatesOpen(false);
    setNewProjectOpen(true);
  };
  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    setGroups((current) =>
      current.map((group, index) =>
        index === 0
          ? {
              ...group,
              tasks: [
                ...group.tasks,
                {
                  id: `new-${Date.now()}`,
                  title: newTaskTitle.trim(),
                  due: newTaskDue || 'Nincs határidő',
                  owner: newTaskOwner,
                  done: false,
                },
              ],
            }
          : group,
      ),
    );
    setNewTaskTitle('');
    setNewTaskDue('');
    setNewTaskOpen(false);
    setTab('feladatok');
    showToast('A részfeladat hozzáadva.');
  };
  const approveCommitmentTasks = (titles: string[]) => {
    if (titles.length === 0) return;
    setGroups((current) =>
      current.map((group, index) =>
        index === 0
          ? {
              ...group,
              tasks: [
                ...group.tasks,
                ...titles.map((title) => ({
                  id: `commitment-${Date.now()}-${title}`,
                  title,
                  due: 'Jóváhagyás után',
                  owner: selected.initials[0] ?? 'T01',
                  done: false,
                })),
              ],
            }
          : group,
      ),
    );
    setTab('feladatok');
    showToast(`${titles.length} vállalásból javasolt feladat hozzáadva.`);
  };
  const addComment = () => {
    if (!comment.trim()) return;
    setComments((current) => [
      {
        who: 'Felhasználó 01',
        when: 'Éppen most',
        text: comment.trim(),
        icon: MessageSquare,
      },
      ...current,
    ]);
    setComment('');
    showToast('A megjegyzés elküldve.');
  };
  const selectProject = (id: number) => {
    setSelectedId(id);
    setTab('áttekintés');
  };
  return (
    <PageComments
      pageKey={
        section === 'designers'
          ? 'designers'
          : `${view}:${selected.code}:${tab}`
      }
    >
      <main className="min-h-screen overflow-x-hidden bg-background text-foreground">
        <div>
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-3 backdrop-blur-xl sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.16em] text-muted-foreground">
                Tervezés
              </p>
              <h1 className="text-base font-bold sm:text-lg">
                Tervezői projektkövető
              </h1>
              <DemoCredentialsNote />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => showToast('Nincs új értesítés.')}
                aria-label="Értesítések"
              >
                <Bell />
              </Button>
              <Button onClick={() => setNewProjectOpen(true)}>
                <Plus />
                <span className="hidden sm:inline">Új projekt</span>
              </Button>
            </div>
          </header>
          <section className="border-b border-border bg-card/20 px-3 py-4 sm:px-6">
            <div className="mx-auto max-w-[1640px]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                    {section === 'projects'
                      ? 'Futó tervezési projektek'
                      : 'Tervezői törzslista'}
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {section === 'projects'
                      ? 'Projektállapot, részfeladatok és pénzügy egy közös munkafelületen.'
                      : 'Innen kerülnek be az elérhető tervezők a csapatokhoz.'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex rounded-lg border border-input bg-card p-1">
                    <button
                      onClick={() => setSection('projects')}
                      className={`h-8 rounded-md px-3 text-xs font-black ${section === 'projects' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Projektek
                    </button>
                    <button
                      onClick={() => setSection('designers')}
                      className={`h-8 rounded-md px-3 text-xs font-black ${section === 'designers' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      Tervezők
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setTemplatesOpen(true)}
                  >
                    <Zap /> Sablonok
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setNewTaskOpen(true)}
                  >
                    <Plus /> Részfeladat
                  </Button>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard
                  icon={FolderKanban}
                  label="Aktív projektek"
                  value="18"
                  note="3 új ebben a hónapban"
                  tone="#48d7a4"
                />
                <StatCard
                  icon={AlertTriangle}
                  label="Figyelmet igényel"
                  value="5"
                  note="2 lejárt, 3 kockázatos"
                  tone="#f0786c"
                />
                <StatCard
                  icon={CheckCircle2}
                  label="E havi kiadás"
                  value="7"
                  note="4 projekt terv szerint"
                  tone="#62a4ff"
                />
                <StatCard
                  icon={CircleDollarSign}
                  label="Számlázható"
                  value="3"
                  note="1 TIG jóváhagyásra vár"
                  tone="#c9f257"
                />
              </div>
            </div>
          </section>
          <section className="mx-auto max-w-[1640px] px-3 py-4 sm:px-6">
            {section === 'designers' ? (
              <DesignersDirectory
                members={teamMembers}
                setMembers={setTeamMembers}
              />
            ) : (
              <>
            <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row">
                <label className="flex h-9 min-w-0 max-w-md flex-1 items-center gap-2 rounded-lg border border-input bg-card px-3 text-sm">
                  <Search className="size-4 shrink-0 text-muted-foreground" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                    placeholder="Projekt vagy projektszám…"
                  />
                  {query && (
                    <button
                      onClick={() => setQuery('')}
                      aria-label="Keresés törlése"
                    >
                      <X className="size-3.5 text-muted-foreground" />
                    </button>
                  )}
                </label>
                <label className="relative flex items-center">
                  <Filter className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
                  <select
                    value={teamFilter}
                    onChange={(event) => setTeamFilter(event.target.value)}
                    className="h-9 appearance-none rounded-lg border border-input bg-card pl-8 pr-8 text-xs font-semibold outline-none focus:border-ring"
                  >
                    <option>Minden csapat</option>
                    <option>A csapat</option>
                    <option>B csapat</option>
                    <option>C csapat</option>
                    <option>Közös</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground" />
                </label>
                <label className="relative flex items-center">
                  <SlidersHorizontal className="pointer-events-none absolute left-3 size-3.5 text-muted-foreground" />
                  <select
                    value={stateFilter}
                    onChange={(event) => setStateFilter(event.target.value)}
                    className="h-9 appearance-none rounded-lg border border-input bg-card pl-8 pr-8 text-xs font-semibold outline-none focus:border-ring"
                  >
                    <option>Minden állapot</option>
                    {projectStateOptions.map((state) => (
                      <option key={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 size-3.5 text-muted-foreground" />
                </label>
              </div>
              <div className="flex rounded-lg border border-input bg-card p-1">
                <button
                  onClick={() => setView('list')}
                  className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold ${view === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <List className="size-3.5" />
                  Lista
                </button>
                <button
                  onClick={() => setView('board')}
                  className={`flex h-7 items-center gap-1.5 rounded-md px-2.5 text-xs font-bold ${view === 'board' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Columns3 className="size-3.5" />
                  Tábla
                </button>
              </div>
            </div>
            {view === 'list' ? (
              <div className="grid min-h-[680px] overflow-hidden rounded-2xl border border-border bg-card shadow-[0_18px_50px_rgb(0_0_0/12%)] xl:grid-cols-[440px_minmax(0,1fr)]">
                <div className="border-b border-border xl:border-b-0 xl:border-r">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3">
                    <div>
                      <h3 className="text-sm font-bold">Projektek</h3>
                      <p className="text-[11px] text-muted-foreground">
                        {filtered.length} találat
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        showToast('Rendezés: legközelebbi határidő.')
                      }
                      aria-label="Projektek rendezése"
                    >
                      <MoreHorizontal />
                    </Button>
                  </div>
                  <div className="max-h-[700px] space-y-1 overflow-y-auto p-2 nina-scroll">
                    {filtered.map((project) => (
                      <article
                        key={project.id}
                        onClick={() => selectProject(project.id)}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            selectProject(project.id);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className={`group relative w-full overflow-hidden rounded-xl border p-3 text-left transition-all ${selected.id === project.id ? 'border-primary/60 bg-primary/[.07]' : 'border-transparent hover:border-border hover:bg-muted/30'}`}
                      >
                        <span
                          className="absolute inset-y-3 left-0 w-0.5 rounded-r"
                          style={{
                            backgroundColor:
                              selected.id === project.id
                                ? project.color
                                : 'transparent',
                          }}
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold">
                              {project.name}
                            </p>
                            <p className="mt-1 text-[11px] text-muted-foreground">
                              {project.code}
                            </p>
                          </div>
                          <TeamSelectPill
                            value={project.team}
                            onChange={(team) =>
                              updateProjectTeamForProject(project.id, team)
                            }
                          />
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${project.progress}%`,
                                backgroundColor: project.color,
                              }}
                            />
                          </div>
                          <span className="w-7 text-right text-[10px] font-bold text-muted-foreground">
                            {project.progress}%
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span
                            className={`rounded-full border px-2 py-0.5 text-[10px] font-bold ${stateTone[project.state]}`}
                          >
                            {project.state}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground">
                            <Clock3 className="size-3" />
                            {project.due}
                          </span>
                        </div>
                      </article>
                    ))}
                    {filtered.length === 0 && (
                      <div className="grid min-h-56 place-items-center px-8 text-center">
                        <div>
                          <Search className="mx-auto mb-3 size-6 text-muted-foreground" />
                          <p className="text-sm font-bold">Nincs találat</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            Próbálj másik keresést vagy csapatszűrőt.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <ProjectDetail
                  project={selected}
                  tab={tab}
                  setTab={setTab}
                  groups={groups}
                  openGroups={openGroups}
                  setOpenGroups={setOpenGroups}
                  toggleTask={toggleTask}
                  taskProgress={taskProgress}
                  taskDone={taskDone}
                  taskTotal={taskTotal}
                  teamMembers={teamMembers}
                  stateLog={stateLog}
                  releases={releases}
                  setReleases={setReleases}
                  comments={comments}
                  comment={comment}
                  setComment={setComment}
                  addComment={addComment}
                  onNewTask={() => setNewTaskOpen(true)}
                  onStateChange={updateProjectState}
                  onProjectTeamChange={updateProjectTeam}
                  onProjectMembersChange={updateProjectMembers}
                  onApproveCommitmentTasks={approveCommitmentTasks}
                />
              </div>
            ) : (
              <BoardView
                projects={filtered}
                onTeamChange={updateProjectTeamForProject}
                selectProject={(id) => {
                  selectProject(id);
                  setView('list');
                }}
              />
            )}
              </>
            )}
          </section>
        </div>

        <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Új tervezési projekt
              </DialogTitle>
              <DialogDescription>
                Hozd létre az alapadatokat; a feladatcsoportok sablonból is
                felvehetők később.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <label className="grid gap-1.5 text-xs font-bold">
                Projekt neve
                <Input
                  autoFocus
                  value={newProjectName}
                  onChange={(event) => setNewProjectName(event.target.value)}
                  placeholder="pl. Projekt Ióta"
                  className="h-10 font-normal"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-bold">
                  Csapat
                  <select
                    value={newProjectTeam}
                    onChange={(event) => setNewProjectTeam(event.target.value)}
                    className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none"
                  >
                    <option>A csapat</option>
                    <option>B csapat</option>
                    <option>C csapat</option>
                    <option>Közös</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-bold">
                  Prioritás
                  <select
                    value={newProjectPriority}
                    onChange={(event) =>
                      setNewProjectPriority(
                        event.target.value as Project['priority'],
                      )
                    }
                    className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none"
                  >
                    <option>Közepes</option>
                    <option>Magas</option>
                    <option>Alacsony</option>
                  </select>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setNewProjectOpen(false)}
              >
                Mégse
              </Button>
              <Button onClick={addProject} disabled={!newProjectName.trim()}>
                <Plus />
                Projekt létrehozása
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        <Dialog open={templatesOpen} onOpenChange={setTemplatesOpen}>
          <DialogContent className="sm:max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Projektsablonok
              </DialogTitle>
              <DialogDescription>
                Demó sablonok létrehozása és projekt indítása előkészített
                munkarészekkel.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2 lg:grid-cols-[1fr_1fr]">
              <section className="space-y-3">
                <h3 className="text-sm font-black">Meglévő sablonok</h3>
                {templates.map((template) => (
                  <article
                    key={template.id}
                    className="rounded-xl border border-border bg-card p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold">{template.name}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          {template.team} · {template.items.length} munkarész
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startProjectFromTemplate(template)}
                      >
                        Projekt
                      </Button>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {template.items.map((item) => (
                        <Badge
                          key={item}
                          variant="outline"
                          className="text-[10px]"
                        >
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </article>
                ))}
              </section>
              <section className="rounded-xl border border-primary/25 bg-primary/[.05] p-4">
                <h3 className="text-sm font-black">Új sablon</h3>
                <div className="mt-3 space-y-3">
                  <label className="grid gap-1.5 text-xs font-bold">
                    Sablon neve
                    <Input
                      value={templateName}
                      onChange={(event) => setTemplateName(event.target.value)}
                      placeholder="pl. Kiviteli tervcsomag"
                      className="h-10 font-normal"
                    />
                  </label>
                  <label className="grid gap-1.5 text-xs font-bold">
                    Alap csapat
                    <select
                      value={templateTeam}
                      onChange={(event) => setTemplateTeam(event.target.value)}
                      className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none"
                    >
                      {teamOptions.map((team) => (
                        <option key={team}>{team}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1.5 text-xs font-bold">
                    Munkarészek
                    <Textarea
                      value={templateItems}
                      onChange={(event) => setTemplateItems(event.target.value)}
                      className="min-h-36 font-normal"
                    />
                  </label>
                  <Button
                    onClick={createTemplate}
                    disabled={!templateName.trim()}
                    className="w-full"
                  >
                    <Plus />
                    Sablon létrehozása
                  </Button>
                </div>
              </section>
            </div>
          </DialogContent>
        </Dialog>
        <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold">
                Új részfeladat rögzítése
              </DialogTitle>
              <DialogDescription>
                A feladat a Dokumentáció csoportba kerül.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <label className="grid gap-1.5 text-xs font-bold">
                Cím
                <Input
                  autoFocus
                  value={newTaskTitle}
                  onChange={(event) => setNewTaskTitle(event.target.value)}
                  placeholder="Feladat megnevezése"
                  className="h-10 font-normal"
                />
              </label>
              <label className="grid gap-1.5 text-xs font-bold">
                Leírás
                <Textarea
                  placeholder="Rövid leírás vagy elvárt eredmény…"
                  className="min-h-24 font-normal"
                />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-1.5 text-xs font-bold">
                  Felelős
                  <select
                    value={newTaskOwner}
                    onChange={(event) => setNewTaskOwner(event.target.value)}
                    className="h-10 rounded-lg border border-input bg-background px-3 font-normal outline-none"
                  >
                    <option value="T01">Tervező 01</option>
                    <option value="T02">Tervező 02</option>
                    <option value="T03">Tervező 03</option>
                  </select>
                </label>
                <label className="grid gap-1.5 text-xs font-bold">
                  Határidő
                  <Input
                    value={newTaskDue}
                    onChange={(event) => setNewTaskDue(event.target.value)}
                    type="date"
                    className="h-10 font-normal"
                  />
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
                Mégse
              </Button>
              <Button onClick={addTask} disabled={!newTaskTitle.trim()}>
                <Plus />
                Feladat hozzáadása
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        {toast && (
          <div
            role="status"
            className="fixed bottom-5 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-2 rounded-xl border border-primary/30 bg-popover px-4 py-3 text-sm font-semibold shadow-2xl"
          >
            <CheckCircle2 className="size-4 text-primary" />
            {toast}
          </div>
        )}
      </main>
    </PageComments>
  );
}

function ProjectDetail({
  project,
  tab,
  setTab,
  groups,
  openGroups,
  setOpenGroups,
  toggleTask,
  taskProgress,
  taskDone,
  taskTotal,
  teamMembers,
  stateLog,
  releases,
  setReleases,
  comments,
  comment,
  setComment,
  addComment,
  onNewTask,
  onStateChange,
  onProjectTeamChange,
  onProjectMembersChange,
  onApproveCommitmentTasks,
}: {
  project: Project;
  tab: DetailTab;
  setTab: (tab: DetailTab) => void;
  groups: TaskGroup[];
  openGroups: Set<string>;
  setOpenGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleTask: (group: string, task: string, checked: boolean) => void;
  taskProgress: number;
  taskDone: number;
  taskTotal: number;
  teamMembers: TeamMember[];
  stateLog: StateLogEntry[];
  releases: ReleaseEntry[];
  setReleases: React.Dispatch<React.SetStateAction<ReleaseEntry[]>>;
  comments: {
    who: string;
    when: string;
    text: string;
    icon: typeof MessageSquare;
  }[];
  comment: string;
  setComment: (value: string) => void;
  addComment: () => void;
  onNewTask: () => void;
  onStateChange: (state: ProjectState) => void;
  onProjectTeamChange: (team: string) => void;
  onProjectMembersChange: (initials: string[]) => void;
  onApproveCommitmentTasks: (titles: string[]) => void;
}) {
  const tabs: { value: DetailTab; label: string; icon: typeof Activity }[] = [
    { value: 'áttekintés', label: 'Áttekintés', icon: Activity },
    {
      value: 'feladatok',
      label: `Feladatok ${taskDone}/${taskTotal}`,
      icon: CheckCircle2,
    },
    { value: 'csapat', label: 'Csapat', icon: Users },
    { value: 'vállalás', label: 'Vállalás', icon: ClipboardList },
    { value: 'napló', label: 'Naplók', icon: GitBranch },
    { value: 'pénzügy', label: 'Pénzügy', icon: CircleDollarSign },
    { value: 'tevékenység', label: 'Tevékenység', icon: MessageSquare },
  ];
  return (
    <div className="min-w-0 bg-background/30">
      <div className="border-b border-border px-4 pt-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Badge className="h-6 rounded-md bg-primary/15 text-primary">
                {project.code}
              </Badge>
              <TeamSelectPill
                value={project.team}
                onChange={onProjectTeamChange}
              />
            </div>
            <h2 className="truncate text-xl font-black sm:text-2xl">
              {project.name}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Ajánlat: {project.offer}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="grid gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Tervezési állapot
              <span className="relative">
                <select
                  value={project.state}
                  onChange={(event) =>
                    onStateChange(event.target.value as ProjectState)
                  }
                  className={`h-9 appearance-none rounded-lg border py-0 pl-3 pr-9 text-xs font-bold outline-none focus:ring-2 focus:ring-primary/35 ${stateTone[project.state]}`}
                  aria-label="Tervezési állapot kézi beállítása"
                >
                  {projectStateOptions.map((state) => (
                    <option
                      key={state}
                      value={state}
                      className="bg-slate-900 text-white"
                    >
                      {state}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2" />
              </span>
            </label>
            <AvatarStack initials={project.initials} />
          </div>
        </div>
        <div className="mt-5 flex gap-1 overflow-x-auto nina-scroll">
          {tabs.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`relative flex h-10 shrink-0 items-center gap-1.5 px-3 text-xs font-bold transition-colors ${tab === value ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              <Icon className="size-3.5" />
              {label}
              {tab === value && (
                <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="max-h-[590px] overflow-y-auto p-4 nina-scroll sm:p-6">
        {tab === 'áttekintés' && (
          <OverviewTab project={project} taskProgress={taskProgress} />
        )}
        {tab === 'feladatok' && (
          <TasksTab
            groups={groups}
            openGroups={openGroups}
            setOpenGroups={setOpenGroups}
            toggleTask={toggleTask}
            onNewTask={onNewTask}
          />
        )}
        {tab === 'csapat' && (
          <TeamTab
            project={project}
            members={teamMembers}
            onProjectTeamChange={onProjectTeamChange}
            onProjectMembersChange={onProjectMembersChange}
          />
        )}
        {tab === 'vállalás' && (
          <CommitmentTab
            project={project}
            existingTaskTitles={groups.flatMap((group) =>
              group.tasks.map((task) => task.title),
            )}
            onApproveCommitmentTasks={onApproveCommitmentTasks}
          />
        )}
        {tab === 'napló' && (
          <PlanningLogTab
            project={project}
            stateLog={stateLog}
            releases={releases}
            setReleases={setReleases}
          />
        )}
        {tab === 'pénzügy' && <FinanceTab project={project} />}
        {tab === 'tevékenység' && (
          <ActivityTab
            comments={comments}
            comment={comment}
            setComment={setComment}
            addComment={addComment}
          />
        )}
      </div>
    </div>
  );
}

function OverviewTab({
  project,
  taskProgress,
}: {
  project: Project;
  taskProgress: number;
}) {
  const milestones = [
    { label: 'Adatok és alapok', value: 100, due: 'Kész' },
    { label: 'Tervezés', value: taskProgress, due: project.due },
    { label: 'Belső ellenőrzés', value: 18, due: 'szept. 16.' },
    { label: 'Kiviteli kiadás', value: 0, due: 'szept. 21.' },
  ];
  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Prioritás
          </p>
          <p className="mt-1 flex items-center gap-2 text-sm font-bold">
            <span
              className={`size-2 rounded-full ${project.priority === 'Magas' ? 'bg-red-400' : project.priority === 'Közepes' ? 'bg-amber-300' : 'bg-sky-400'}`}
            />
            {project.priority}
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Kiadás határideje
          </p>
          <p className="mt-1 text-sm font-bold">{project.dueLong}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-[11px] font-semibold text-muted-foreground">
            Pótmunka
          </p>
          <p className="mt-1 text-sm font-bold">Nem</p>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">
              Teljes projekt
            </p>
            <h3 className="mt-1 text-base font-bold">Előrehaladás</h3>
          </div>
          <span className="text-2xl font-black text-primary">
            {project.id === 1 ? taskProgress : project.progress}%
          </span>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{
              width: `${project.id === 1 ? taskProgress : project.progress}%`,
            }}
          />
        </div>
        <div className="mt-5 space-y-3">
          {milestones.map((milestone) => (
            <div
              key={milestone.label}
              className="grid grid-cols-[120px_1fr_72px] items-center gap-3 text-xs"
            >
              <span className="font-semibold">{milestone.label}</span>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/80"
                  style={{ width: `${milestone.value}%` }}
                />
              </div>
              <span className="text-right text-muted-foreground">
                {milestone.due}
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold">Következő határidők</h3>
            <CalendarDays className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {[
              ['Villámvédelem kockázatelemzés', 'Ma'],
              ['Költségvetés', 'szept. 13.'],
              ['Belső ellenőrzés', 'szept. 16.'],
            ].map(([title, due], index) => (
              <div key={title} className="flex items-center gap-3">
                <span
                  className={`grid size-8 place-items-center rounded-lg ${index === 0 ? 'bg-red-400/10 text-red-300' : 'bg-muted text-muted-foreground'}`}
                >
                  <Clock3 className="size-3.5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold">{title}</p>
                  <p className="text-[10px] text-muted-foreground">{due}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold">Projektcsapat</h3>
            <Users className="size-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {[
              ['T01', 'PM 01', 'PM'],
              ['T09', 'Tervező 02', 'Épületvillamossági tervező'],
              ['T02', 'Tervező 03', 'Épületvillamossági tervező gyakornok'],
            ].map(([initial, name, role], index) => (
              <div key={initial} className="flex items-center gap-3">
                <span
                  className={`grid size-8 place-items-center rounded-full text-[9px] font-black text-slate-950 ${avatarTones[index]}`}
                >
                  {initial}
                </span>
                <div className="flex-1">
                  <p className="text-xs font-bold">{name}</p>
                  <p className="text-[10px] text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TasksTab({
  groups,
  openGroups,
  setOpenGroups,
  toggleTask,
  onNewTask,
}: {
  groups: TaskGroup[];
  openGroups: Set<string>;
  setOpenGroups: React.Dispatch<React.SetStateAction<Set<string>>>;
  toggleTask: (group: string, task: string, checked: boolean) => void;
  onNewTask: () => void;
}) {
  const toggleGroup = (id: string) =>
    setOpenGroups((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  return (
    <div className="space-y-3">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold">Feladatcsoportok</h3>
          <p className="text-[11px] text-muted-foreground">
            A teljes Trello-checklista egy strukturált nézetben.
          </p>
        </div>
        <Button size="sm" onClick={onNewTask}>
          <Plus />
          Feladat
        </Button>
      </div>
      {groups.map((group) => {
        const done = group.tasks.filter((task) => task.done).length;
        const progress = Math.round((done / group.tasks.length) * 100);
        const isOpen = openGroups.has(group.id);
        return (
          <section
            key={group.id}
            className="overflow-hidden rounded-xl border border-border bg-card"
          >
            <button
              onClick={() => toggleGroup(group.id)}
              className="flex w-full items-center gap-3 p-4 text-left"
            >
              <span
                className="grid size-8 place-items-center rounded-lg"
                style={{
                  backgroundColor: `${group.tone}18`,
                  color: group.tone,
                }}
              >
                <CheckCircle2 className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-sm font-bold">{group.title}</h4>
                  <span className="text-[11px] font-bold text-muted-foreground">
                    {done}/{group.tasks.length}
                  </span>
                </div>
                <div className="mt-2 h-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${progress}%`,
                      backgroundColor: group.tone,
                    }}
                  />
                </div>
              </div>
              <ChevronDown
                className={`size-4 text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`}
              />
            </button>
            {isOpen && (
              <div className="border-t border-border px-4 py-1">
                {group.tasks.map((task) => (
                  <label
                    key={task.id}
                    className="group flex cursor-pointer items-center gap-3 border-b border-border/60 py-3 last:border-0"
                  >
                    <Checkbox
                      checked={task.done}
                      onCheckedChange={(checked) =>
                        toggleTask(group.id, task.id, Boolean(checked))
                      }
                    />
                    <span
                      className={`min-w-0 flex-1 text-xs font-semibold ${task.done ? 'text-muted-foreground line-through' : ''}`}
                    >
                      {task.title}
                    </span>
                    <span
                      className={`hidden items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold sm:flex ${task.late && !task.done ? 'bg-red-400/12 text-red-300' : 'bg-muted text-muted-foreground'}`}
                    >
                      <Clock3 className="size-3" />
                      {task.due}
                    </span>
                    <span className="grid size-6 place-items-center rounded-full bg-primary/15 text-[8px] font-black text-primary">
                      {task.owner}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

function CommitmentTab({
  project,
  existingTaskTitles,
  onApproveCommitmentTasks,
}: {
  project: Project;
  existingTaskTitles: string[];
  onApproveCommitmentTasks: (titles: string[]) => void;
}) {
  const columns = [
    {
      title: 'Tartalmazza',
      items: commitmentContent.included,
      tone: 'border-emerald-400/25 bg-emerald-400/[.04]',
    },
    {
      title: 'Nem tartalmazza',
      items: commitmentContent.excluded,
      tone: 'border-amber-400/25 bg-amber-400/[.04]',
    },
    {
      title: 'Nem jelenik meg',
      items: commitmentContent.notShown,
      tone: 'border-slate-400/25 bg-slate-400/[.04]',
    },
  ];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/[.06] p-4">
        <div className="flex items-center gap-3">
          <span className="grid size-9 place-items-center rounded-lg bg-primary/15 text-primary">
            <Database className="size-4" />
          </span>
          <div>
            <h3 className="text-sm font-bold">
              Projektvállalás · {project.code}
            </h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Integrációs előnézet a meglévő vállalatirányítási rendszer
              adataiból.
            </p>
          </div>
        </div>
        <Badge className="bg-primary/15 text-primary">
          Automatikus átvételre előkészítve
        </Badge>
      </div>
      <div className="grid gap-3 xl:grid-cols-3">
        {columns.map((column) => (
          <section
            key={column.title}
            className={`rounded-xl border p-4 ${column.tone}`}
          >
            <h3 className="mb-3 text-sm font-black">{column.title}</h3>
            <ul className="space-y-2 pl-4 text-[11px] leading-relaxed text-foreground/85 marker:text-primary">
              {column.items.map((item) => (
                <li key={item} className="list-disc pl-1">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-black">Megjegyzés</h3>
        <p className="mt-2 text-xs leading-relaxed text-foreground/85">
          {commitmentContent.note}
        </p>
      </section>
      <CommitmentTaskSuggestions
        includedItems={commitmentContent.included}
        existingTaskTitles={existingTaskTitles}
        onApprove={onApproveCommitmentTasks}
      />
    </div>
  );
}

function FinanceTab({ project }: { project: Project }) {
  const current = Math.max(
    0,
    financeSteps.findIndex((step) =>
      project.finance.includes(step.split(' ')[0]),
    ),
  );
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/25 bg-primary/[.06] p-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Tervezési állapot hivatkozás
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A pénzügyi munkatársak a tervezők által kézzel beállított állapotot
            látják.
          </p>
        </div>
        <span
          className={`rounded-lg border px-3 py-2 text-xs font-bold ${stateTone[project.state]}`}
        >
          {project.state}
        </span>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="mb-5">
            <h3 className="text-sm font-bold">Pénzügyi folyamat</h3>
            <p className="mt-1 text-[11px] text-muted-foreground">
              A projekt szerződésétől a számla rendezéséig.
            </p>
          </div>
          <div className="space-y-0">
            {financeSteps.map((step, index) => {
              const complete = index < current;
              const active = index === current;
              return (
                <div key={step} className="relative flex gap-3 pb-4 last:pb-0">
                  <div
                    className="relative z-10 grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-black"
                    style={{
                      borderColor:
                        complete || active ? '#48d7a4' : 'var(--border)',
                      background: complete
                        ? '#48d7a4'
                        : active
                          ? 'rgb(72 215 164 / 14%)'
                          : 'var(--card)',
                      color: complete
                        ? '#10221f'
                        : active
                          ? '#48d7a4'
                          : 'var(--muted-foreground)',
                    }}
                  >
                    {complete ? <Check className="size-3" /> : index + 1}
                  </div>
                  {index < financeSteps.length - 1 && (
                    <span className="absolute left-[11px] top-6 h-full w-px bg-border" />
                  )}
                  <div className="pt-0.5">
                    <p
                      className={`text-xs font-semibold ${active ? 'text-primary' : complete ? 'text-foreground' : 'text-muted-foreground'}`}
                    >
                      {step}
                    </p>
                    {active && (
                      <p className="mt-1 text-[10px] text-muted-foreground">
                        Jelenlegi állapot · frissítve augusztus 29.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Ajánlati szám
            </p>
            <p className="mt-1 text-sm font-bold">{project.offer}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Szerződésszám
            </p>
            <p className="mt-1 text-sm font-bold">SZE26/{project.code}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Tervezési díj
            </p>
            <p className="mt-1 text-xl font-black">4 850 000 Ft</p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              nettó érték
            </p>
          </div>
          <div className="rounded-xl border border-lime-400/20 bg-lime-400/[.06] p-4">
            <p className="flex items-center gap-2 text-xs font-bold text-lime-300">
              <CircleDollarSign className="size-4" />
              Számlázási előfeltétel
            </p>
            <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
              A dokumentáció lezárása után a projekt automatikusan átkerül a
              számlázható listába.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityTab({
  comments,
  comment,
  setComment,
  addComment,
}: {
  comments: {
    who: string;
    when: string;
    text: string;
    icon: typeof MessageSquare;
  }[];
  comment: string;
  setComment: (value: string) => void;
  addComment: () => void;
}) {
  const allItems = [...comments, ...activityItems];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-5 rounded-xl border border-border bg-card p-3">
        <Textarea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Megjegyzés írása…"
          className="min-h-20 border-0 bg-transparent p-1 focus-visible:ring-0"
        />
        <div className="mt-2 flex justify-end border-t border-border pt-3">
          <Button size="sm" onClick={addComment} disabled={!comment.trim()}>
            <Send />
            Küldés
          </Button>
        </div>
      </div>
      <div className="relative space-y-5 before:absolute before:bottom-4 before:left-4 before:top-4 before:w-px before:bg-border">
        {allItems.map(({ who, when, text, icon: Icon }, index) => (
          <div key={`${who}-${when}-${index}`} className="relative flex gap-4">
            <span className="relative z-10 grid size-8 shrink-0 place-items-center rounded-full border border-border bg-background text-primary">
              <Icon className="size-3.5" />
            </span>
            <div className="flex-1 rounded-xl border border-border bg-card p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-xs font-bold">{who}</p>
                <p className="text-[10px] text-muted-foreground">{when}</p>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-foreground/85">
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BoardView({
  projects,
  selectProject,
  onTeamChange,
}: {
  projects: Project[];
  selectProject: (id: number) => void;
  onTeamChange: (projectId: number, team: string) => void;
}) {
  const columns = projectStateOptions;
  return (
    <div className="overflow-x-auto pb-3 nina-scroll">
      <div className="grid min-w-[1900px] grid-cols-8 gap-3">
        {columns.map((state) => {
          const items = projects.filter((project) => project.state === state);
          return (
            <section
              key={state}
              className="rounded-xl border border-border bg-card/45 p-2"
            >
              <div className="mb-2 flex items-center justify-between px-2 py-2">
                <h3 className="text-xs font-bold">{state}</h3>
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                  {items.length}
                </span>
              </div>
              <div className="space-y-2">
                {items.map((project) => (
                  <article
                    key={project.id}
                    onClick={() => selectProject(project.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        selectProject(project.id);
                      }
                    }}
                    role="button"
                    tabIndex={0}
                    className="w-full rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-transform hover:-translate-y-0.5 hover:border-primary/40"
                  >
                    <span
                      className="mb-3 block h-1 w-10 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <p className="text-xs font-bold leading-snug">
                      {project.name}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {project.code}
                    </p>
                    <div className="mt-3">
                      <TeamSelectPill
                        value={project.team}
                        onChange={(team) => onTeamChange(project.id, team)}
                      />
                    </div>
                    <div className="my-3 h-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${project.progress}%`,
                          backgroundColor: project.color,
                        }}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <AvatarStack initials={project.initials} limit={2} />
                      <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock3 className="size-3" />
                        {project.due}
                      </span>
                    </div>
                  </article>
                ))}
                {items.length === 0 && (
                  <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-border text-[10px] text-muted-foreground">
                    Nincs projekt
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
