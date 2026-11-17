import { useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  Copy,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  Shuffle,
  Trash2,
  Users,
} from 'lucide-react';
import { MotionConfig } from 'motion/react';
import { GroupCard } from './components/GroupCard';
import { SAMPLE_GROUPS, SAMPLE_STUDENT_TEXT } from './data/sampleStudents';
import {
  computeDistributionPreview,
  divideIntoGroups,
  formatGroupsForClipboard,
  parseStudentNames,
  type GroupResult,
  type SplitMode,
} from './utils/groupDivider';

export default function App() {
  const [rawText, setRawText] = useState<string>(SAMPLE_STUDENT_TEXT);
  const [mode, setMode] = useState<SplitMode>('byGroups');
  const [numberInput, setNumberInput] = useState<string>('4');

  const [groups, setGroups] = useState<GroupResult[]>(SAMPLE_GROUPS);
  const [isSampleView, setIsSampleView] = useState<boolean>(true);
  const [shuffleKey, setShuffleKey] = useState<number>(0);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [projectionMode, setProjectionMode] = useState<boolean>(false);
  const [largeText, setLargeText] = useState<boolean>(false);

  const students = useMemo(() => parseStudentNames(rawText), [rawText]);
  const parsedNumber = Number.parseInt(numberInput, 10);

  const preview = useMemo(
    () => computeDistributionPreview(students.length, mode, parsedNumber),
    [students.length, mode, parsedNumber]
  );

  const totalDisplayedMembers = useMemo(
    () => groups.reduce((acc, g) => acc + g.members.length, 0),
    [groups]
  );

  function validateInputs(): number | null {
    if (students.length === 0) {
      setErrorMessage('Vui lòng nhập hoặc dán ít nhất 1 tên sinh viên vào danh sách.');
      return null;
    }
    if (!Number.isFinite(parsedNumber) || parsedNumber < 1) {
      setErrorMessage(
        mode === 'byGroups'
          ? 'Số nhóm phải là số nguyên lớn hơn hoặc bằng 1.'
          : 'Số người mỗi nhóm phải là số nguyên lớn hơn hoặc bằng 1.'
      );
      return null;
    }
    setErrorMessage(null);
    return parsedNumber;
  }

  function handleDivide() {
    const validNum = validateInputs();
    if (validNum === null) return;

    const nextGroups = divideIntoGroups(students, mode, validNum);
    setGroups(nextGroups);
    setIsSampleView(false);
    setShuffleKey((prev) => prev + 1);
    setCopied(false);
  }

  function handleReshuffle() {
    const validNum = validateInputs();
    if (validNum === null) {
      setProjectionMode(false);
      return;
    }

    const nextGroups = divideIntoGroups(
      students,
      mode,
      validNum,
      isSampleView ? undefined : groups
    );
    setGroups(nextGroups);
    setIsSampleView(false);
    setShuffleKey((prev) => prev + 1);
    setCopied(false);
  }

  async function handleCopyResults() {
    if (groups.length === 0) return;
    const text = formatGroupsForClipboard(groups);

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      } finally {
        document.body.removeChild(textarea);
      }
    }
  }

  function handleStepNumber(delta: number) {
    const current = Number.isFinite(parsedNumber) && parsedNumber >= 1 ? parsedNumber : 1;
    const maxAllowed = Math.max(1, students.length || 99);
    const next = Math.max(1, Math.min(maxAllowed, current + delta));
    setNumberInput(String(next));
    setErrorMessage(null);
  }

  function handleClearList() {
    setRawText('');
    setErrorMessage(null);
  }

  function handleRestoreSample() {
    setRawText(SAMPLE_STUDENT_TEXT);
    setMode('byGroups');
    setNumberInput('4');
    setGroups(SAMPLE_GROUPS);
    setIsSampleView(true);
    setErrorMessage(null);
    setShuffleKey((prev) => prev + 1);
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-slate-50 text-slate-900">
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8 px-6 py-4 sm:px-8">
            <h1 className="font-display text-xl font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 sm:text-2xl">
              Chia Nhóm Lớp Học
            </h1>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setProjectionMode((prev) => !prev)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap shrink-0"
              >
                {projectionMode ? (
                  <>
                    <Minimize2 className="h-4 w-4" aria-hidden="true" />
                    <span>Hiện bảng nhập</span>
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4" aria-hidden="true" />
                    <span>Chế độ trình chiếu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="mx-auto max-w-[1440px] px-6 py-6 sm:px-8 sm:py-8">
          <div
            className={`grid gap-8 items-start ${
              projectionMode ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-12'
            }`}
          >
            {!projectionMode && (
              <section
                aria-label="Thiết lập danh sách và cách chia nhóm"
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs lg:col-span-4"
              >
                <div className="space-y-6">
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <label
                        htmlFor="student-list-input"
                        className="font-display text-lg font-bold text-slate-900"
                      >
                        Danh sách sinh viên
                      </label>
                      <span className="text-sm font-medium text-slate-600 tabular-nums">
                        {students.length} sinh viên
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-slate-600">
                      Dán danh sách mỗi dòng một người. Các dòng trống sẽ tự động được bỏ qua.
                    </p>

                    <textarea
                      id="student-list-input"
                      value={rawText}
                      onChange={(e) => {
                        setRawText(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      rows={11}
                      placeholder={'Nguyễn Văn A\nTrần Thị B\nLê Hoàng C...'}
                      className="w-full resize-y rounded-lg border border-slate-300 bg-slate-50/60 px-4 py-3 text-base leading-relaxed text-slate-900 placeholder:text-slate-400 focus:border-sky-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-600/20"
                    />

                    <div className="mt-2.5 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={handleRestoreSample}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap"
                      >
                        <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        <span>Dùng danh sách mẫu</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleClearList}
                        disabled={rawText.length === 0}
                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:bg-rose-50 hover:text-rose-700 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 whitespace-nowrap"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                        <span>Xóa danh sách</span>
                      </button>
                    </div>
                  </div>

                  <hr className="border-slate-200" />

                  <div className="space-y-4">
                    <span className="block font-display text-lg font-bold text-slate-900">
                      Tùy chọn chia nhóm
                    </span>

                    <div
                      role="group"
                      aria-label="Chọn chế độ chia nhóm"
                      className="grid grid-cols-2 gap-1.5 rounded-lg bg-slate-100 p-1"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMode('byGroups');
                          setErrorMessage(null);
                        }}
                        className={`min-h-[42px] rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap ${
                          mode === 'byGroups'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Theo số nhóm
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMode('bySize');
                          setErrorMessage(null);
                        }}
                        className={`min-h-[42px] rounded-md px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap ${
                          mode === 'bySize'
                            ? 'bg-white text-slate-900 shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        Theo số người / nhóm
                      </button>
                    </div>

                    <div>
                      <label
                        htmlFor="split-number-input"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                      >
                        {mode === 'byGroups'
                          ? 'Số nhóm muốn chia'
                          : 'Số sinh viên tối đa mỗi nhóm'}
                      </label>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleStepNumber(-1)}
                          aria-label="Giảm số lượng"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                          −
                        </button>
                        <input
                          id="split-number-input"
                          type="number"
                          min={1}
                          max={Math.max(1, students.length || 999)}
                          value={numberInput}
                          onChange={(e) => {
                            setNumberInput(e.target.value);
                            if (errorMessage) setErrorMessage(null);
                          }}
                          className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-center font-display text-xl font-bold text-slate-900 tabular-nums focus:border-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-600/20"
                        />
                        <button
                          type="button"
                          onClick={() => handleStepNumber(1)}
                          aria-label="Tăng số lượng"
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-xl font-semibold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
                        >
                          +
                        </button>
                      </div>

                      {preview.isValid && (
                        <p className="mt-2.5 flex items-center gap-2 text-sm text-slate-600 tabular-nums">
                          <Users className="h-4 w-4 shrink-0 text-slate-500" aria-hidden="true" />
                          <span>
                            Dự kiến: <strong className="font-semibold text-slate-900">{preview.groupCount} nhóm</strong>
                            {' · '}
                            {preview.minSize === preview.maxSize
                              ? `${preview.minSize} người mỗi nhóm`
                              : `${preview.minSize}–${preview.maxSize} người mỗi nhóm`}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  {errorMessage && (
                    <div
                      role="alert"
                      className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-800"
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" aria-hidden="true" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleDivide}
                    className="inline-flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-xl bg-sky-700 px-6 py-3 font-display text-lg font-bold text-white shadow-xs transition-colors hover:bg-sky-800 active:bg-sky-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 whitespace-nowrap"
                  >
                    <Shuffle className="h-5 w-5" aria-hidden="true" />
                    <span>Chia nhóm</span>
                  </button>
                </div>
              </section>
            )}

            <section
              aria-label="Kết quả chia nhóm"
              className={projectionMode ? 'col-span-1' : 'lg:col-span-8'}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {isSampleView ? 'Nhóm mẫu minh họa' : 'Kết quả chia nhóm'}
                  </h2>
                  <p className="mt-1 text-base text-slate-600 tabular-nums">
                    {groups.length} nhóm
                    <span aria-hidden="true"> · </span>
                    {totalDisplayedMembers} sinh viên
                    {isSampleView && (
                      <>
                        <span aria-hidden="true"> · </span>
                        <span>Nhấn &ldquo;Chia nhóm&rdquo; để trộn ngẫu nhiên</span>
                      </>
                    )}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLargeText((prev) => !prev)}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap shrink-0 ${
                      largeText
                        ? 'border-sky-300 bg-sky-50 text-sky-900'
                        : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>{largeText ? 'Cỡ chữ chiếu: Lớn' : 'Cỡ chữ chiếu: Chuẩn'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleReshuffle}
                    className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-base font-semibold text-slate-800 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap shrink-0"
                  >
                    <RefreshCw className="h-4 w-4" aria-hidden="true" />
                    <span>Chia lại</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCopyResults}
                    disabled={groups.length === 0}
                    className={`inline-flex min-h-[44px] items-center gap-2 rounded-lg px-4 py-2 text-base font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 whitespace-nowrap shrink-0 ${
                      copied
                        ? 'bg-emerald-700 text-white'
                        : 'bg-slate-900 text-white hover:bg-slate-800'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" aria-hidden="true" />
                        <span>Đã sao chép</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" aria-hidden="true" />
                        <span>Sao chép kết quả</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div
                className={`grid gap-6 ${
                  projectionMode
                    ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-4'
                    : 'grid-cols-1 md:grid-cols-2'
                }`}
              >
                {groups.map((group, idx) => (
                  <GroupCard
                    key={`${group.id}-${idx}`}
                    group={group}
                    index={idx}
                    largeText={largeText || projectionMode}
                    shuffleKey={shuffleKey}
                  />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </MotionConfig>
  );
}
