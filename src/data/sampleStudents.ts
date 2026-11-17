import type { GroupResult } from '../utils/groupDivider';

export const SAMPLE_STUDENT_TEXT = [
  'Nguyễn Minh Anh',
  'Trần Quốc Bảo',
  'Lê Hoàng Châu',
  'Phạm Gia Hân',
  'Vũ Đức Khang',
  'Đặng Thảo Linh',
  'Bùi Tuấn Kiệt',
  'Hoàng Ngọc Mai',
  'Đỗ Quang Minh',
  'Ngô Khánh Ngân',
  'Dương Hải Nam',
  'Phan Bảo Ngọc',
  'Lý Nhật Phong',
  'Tạ Phương Quỳnh',
  'Võ Trọng Tấn',
  'Huỳnh Thanh Thảo',
  'Trịnh Anh Thư',
  'Chu Đình Trung',
  'Đinh Cẩm Tú',
  'Mai Xuân Vinh',
].join('\n');

export const SAMPLE_GROUPS: GroupResult[] = [
  {
    id: 1,
    name: 'Nhóm 1',
    members: [
      'Nguyễn Minh Anh',
      'Vũ Đức Khang',
      'Đỗ Quang Minh',
      'Lý Nhật Phong',
      'Trịnh Anh Thư',
    ],
  },
  {
    id: 2,
    name: 'Nhóm 2',
    members: [
      'Trần Quốc Bảo',
      'Đặng Thảo Linh',
      'Ngô Khánh Ngân',
      'Tạ Phương Quỳnh',
      'Chu Đình Trung',
    ],
  },
  {
    id: 3,
    name: 'Nhóm 3',
    members: [
      'Lê Hoàng Châu',
      'Bùi Tuấn Kiệt',
      'Dương Hải Nam',
      'Võ Trọng Tấn',
      'Đinh Cẩm Tú',
    ],
  },
  {
    id: 4,
    name: 'Nhóm 4',
    members: [
      'Phạm Gia Hân',
      'Hoàng Ngọc Mai',
      'Phan Bảo Ngọc',
      'Huỳnh Thanh Thảo',
      'Mai Xuân Vinh',
    ],
  },
];

export interface GroupTheme {
  cardBorder: string;
  headerBg: string;
  headerBorder: string;
  titleText: string;
  countText: string;
  indexText: string;
  hoverRow: string;
}

/**
 * Curated high-contrast classroom-projector-safe color themes (one color per group).
 * Uses subtle tinted headers + crisp 1px borders and deep dark ink for maximum legibility.
 */
export const GROUP_THEMES: GroupTheme[] = [
  {
    cardBorder: 'border-sky-200',
    headerBg: 'bg-sky-50',
    headerBorder: 'border-sky-200',
    titleText: 'text-sky-900',
    countText: 'text-sky-700',
    indexText: 'text-sky-700',
    hoverRow: 'hover:bg-sky-50/50',
  },
  {
    cardBorder: 'border-emerald-200',
    headerBg: 'bg-emerald-50',
    headerBorder: 'border-emerald-200',
    titleText: 'text-emerald-900',
    countText: 'text-emerald-700',
    indexText: 'text-emerald-700',
    hoverRow: 'hover:bg-emerald-50/50',
  },
  {
    cardBorder: 'border-amber-200',
    headerBg: 'bg-amber-50',
    headerBorder: 'border-amber-200',
    titleText: 'text-amber-950',
    countText: 'text-amber-800',
    indexText: 'text-amber-700',
    hoverRow: 'hover:bg-amber-50/50',
  },
  {
    cardBorder: 'border-indigo-200',
    headerBg: 'bg-indigo-50',
    headerBorder: 'border-indigo-200',
    titleText: 'text-indigo-950',
    countText: 'text-indigo-700',
    indexText: 'text-indigo-700',
    hoverRow: 'hover:bg-indigo-50/50',
  },
  {
    cardBorder: 'border-rose-200',
    headerBg: 'bg-rose-50',
    headerBorder: 'border-rose-200',
    titleText: 'text-rose-950',
    countText: 'text-rose-700',
    indexText: 'text-rose-700',
    hoverRow: 'hover:bg-rose-50/50',
  },
  {
    cardBorder: 'border-teal-200',
    headerBg: 'bg-teal-50',
    headerBorder: 'border-teal-200',
    titleText: 'text-teal-950',
    countText: 'text-teal-700',
    indexText: 'text-teal-700',
    hoverRow: 'hover:bg-teal-50/50',
  },
  {
    cardBorder: 'border-orange-200',
    headerBg: 'bg-orange-50',
    headerBorder: 'border-orange-200',
    titleText: 'text-orange-950',
    countText: 'text-orange-700',
    indexText: 'text-orange-700',
    hoverRow: 'hover:bg-orange-50/50',
  },
  {
    cardBorder: 'border-violet-200',
    headerBg: 'bg-violet-50',
    headerBorder: 'border-violet-200',
    titleText: 'text-violet-950',
    countText: 'text-violet-700',
    indexText: 'text-violet-700',
    hoverRow: 'hover:bg-violet-50/50',
  },
  {
    cardBorder: 'border-cyan-200',
    headerBg: 'bg-cyan-50',
    headerBorder: 'border-cyan-200',
    titleText: 'text-cyan-950',
    countText: 'text-cyan-700',
    indexText: 'text-cyan-700',
    hoverRow: 'hover:bg-cyan-50/50',
  },
  {
    cardBorder: 'border-fuchsia-200',
    headerBg: 'bg-fuchsia-50',
    headerBorder: 'border-fuchsia-200',
    titleText: 'text-fuchsia-950',
    countText: 'text-fuchsia-700',
    indexText: 'text-fuchsia-700',
    hoverRow: 'hover:bg-fuchsia-50/50',
  },
];

export function getGroupTheme(index: number): GroupTheme {
  return GROUP_THEMES[index % GROUP_THEMES.length];
}
