export type SplitMode = 'byGroups' | 'bySize';

export interface GroupResult {
  id: number;
  name: string;
  members: string[];
}

/**
 * Parses a raw multiline string of student names.
 * Trims whitespace around each line and removes empty lines.
 */
export function parseStudentNames(rawText: string): string[] {
  return rawText
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

/**
 * Computes the balanced group count and min/max sizes for previewing.
 */
export function computeDistributionPreview(
  totalStudents: number,
  mode: SplitMode,
  inputValue: number
): { groupCount: number; minSize: number; maxSize: number; isValid: boolean } {
  if (totalStudents <= 0 || !Number.isFinite(inputValue) || inputValue < 1) {
    return { groupCount: 0, minSize: 0, maxSize: 0, isValid: false };
  }

  const sanitizedValue = Math.floor(inputValue);
  let groupCount =
    mode === 'byGroups'
      ? Math.min(sanitizedValue, totalStudents)
      : Math.ceil(totalStudents / sanitizedValue);

  groupCount = Math.max(1, Math.min(groupCount, totalStudents));

  const minSize = Math.floor(totalStudents / groupCount);
  const remainder = totalStudents % groupCount;
  const maxSize = remainder > 0 ? minSize + 1 : minSize;

  return { groupCount, minSize, maxSize, isValid: true };
}

/**
 * Fisher-Yates in-place shuffle returning a new array.
 */
export function shuffleArray<T>(items: readonly T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Canonical signature of groups (sorted members within each group, sorted groups)
 * to detect if a reshuffle accidentally produced the exact same team composition.
 */
function getGroupingSignature(groups: GroupResult[]): string {
  return groups
    .map((g) => [...g.members].sort((a, b) => a.localeCompare(b, 'vi')).join('|'))
    .sort()
    .join('||');
}

/**
 * Splits students randomly into balanced groups whose sizes differ by at most 1.
 * When `previousGroups` is provided, retries a few times to guarantee a different assignment if possible.
 */
export function divideIntoGroups(
  students: string[],
  mode: SplitMode,
  inputValue: number,
  previousGroups?: GroupResult[]
): GroupResult[] {
  const { groupCount, isValid } = computeDistributionPreview(students.length, mode, inputValue);
  if (!isValid || groupCount === 0) {
    return [];
  }

  const baseSize = Math.floor(students.length / groupCount);
  const remainder = students.length % groupCount;
  const previousSig = previousGroups ? getGroupingSignature(previousGroups) : null;

  let bestAttempt: GroupResult[] = [];
  const maxAttempts = previousSig && students.length >= 2 && groupCount >= 2 ? 12 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const shuffled = shuffleArray(students);
    const groups: GroupResult[] = [];
    let cursor = 0;

    for (let i = 0; i < groupCount; i++) {
      const size = baseSize + (i < remainder ? 1 : 0);
      const members = shuffled.slice(cursor, cursor + size);
      cursor += size;
      groups.push({
        id: i + 1,
        name: `Nhóm ${i + 1}`,
        members,
      });
    }

    bestAttempt = groups;
    if (!previousSig || getGroupingSignature(groups) !== previousSig) {
      break;
    }
  }

  return bestAttempt;
}

/**
 * Formats groups as clean plain text ready to paste into Zalo, Email, Docs, or LMS.
 */
export function formatGroupsForClipboard(groups: GroupResult[]): string {
  return groups
    .map((group) => {
      const header = `${group.name} (${group.members.length} thành viên):`;
      const lines = group.members.map((member, idx) => `${idx + 1}. ${member}`);
      return [header, ...lines].join('\n');
    })
    .join('\n\n');
}
