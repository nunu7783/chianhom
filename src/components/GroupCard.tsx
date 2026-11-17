import { motion } from 'motion/react';
import { getGroupTheme } from '../data/sampleStudents';
import type { GroupResult } from '../utils/groupDivider';

interface GroupCardProps {
  group: GroupResult;
  index: number;
  largeText: boolean;
  shuffleKey: number;
}

export function GroupCard({ group, index, largeText, shuffleKey }: GroupCardProps) {
  const theme = getGroupTheme(index);

  return (
    <motion.article
      key={`${shuffleKey}-${group.id}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.18,
        delay: Math.min(index * 0.03, 0.2),
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`flex flex-col overflow-hidden rounded-xl border bg-white shadow-xs ${theme.cardBorder}`}
    >
      <header
        className={`flex items-baseline justify-between gap-4 border-b px-6 py-4 ${theme.headerBg} ${theme.headerBorder}`}
      >
        <h3
          className={`font-display font-bold tracking-tight ${theme.titleText} ${
            largeText ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
          }`}
        >
          {group.name}
        </h3>
        <span
          className={`shrink-0 font-medium tabular-nums ${theme.countText} ${
            largeText ? 'text-lg' : 'text-base'
          }`}
        >
          {group.members.length} sinh viên
        </span>
      </header>

      <ol className="flex-1 divide-y divide-slate-100 px-6 py-3">
        {group.members.map((member, memberIdx) => (
          <li
            key={`${group.id}-${memberIdx}-${member}`}
            className={`flex items-baseline gap-3.5 py-2.5 transition-colors duration-150 ${theme.hoverRow}`}
          >
            <span
              className={`w-7 shrink-0 text-right font-semibold tabular-nums ${theme.indexText} ${
                largeText ? 'text-xl' : 'text-lg'
              }`}
            >
              {memberIdx + 1}.
            </span>
            <span
              className={`font-medium leading-snug text-slate-900 ${
                largeText ? 'text-2xl' : 'text-xl'
              }`}
            >
              {member}
            </span>
          </li>
        ))}
      </ol>
    </motion.article>
  );
}
