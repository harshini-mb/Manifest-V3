const DEFAULT_TASKS = [
  { id: 'core', name: 'Core study block' },
  { id: 'pyq', name: 'PYQs / practice questions' },
  { id: 'code', name: 'Programming practice' },
  { id: 'rev', name: 'Revise + error log' }
];
const pad = n => String(n).padStart(2, '0');
const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const fromKey = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); x.setDate(x.getDate() + n); return x; };
const weekStart = d => addDays(d, -((d.getDay() + 6) % 7)); // Monday

async function load() {
  const s = await chrome.storage.local.get(['tasks', 'log']);
  const tasks = s.tasks || DEFAULT_TASKS;
  const log = s.log || {};
  // keep today's entry in sync with the current task list
  const tk = key(new Date());
  if (log[tk] && !log[tk].rest) {
    const ids = new Set(tasks.map(t => t.id));
    log[tk] = { done: log[tk].done.filter(i => ids.has(i)), total: tasks.length };
  }
  return { tasks, log };
}
const save = o => chrome.storage.local.set(o);
const isRest = (log, k) => !!(log[k] && log[k].rest);
const isFull = (log, k) => { const e = log[k]; return !!e && !e.rest && e.total > 0 && e.done.length >= e.total; };

// Full day = +1. Rest day = streak kept, nothing added. Today unfinished = pending, not broken.
function streaks(log, today = new Date()) {
  const keys = Object.keys(log).sort();
  if (!keys.length) return { cur: 0, best: 0 };
  const tk = key(today);
  let run = 0, best = 0;
  for (let d = fromKey(keys[0]); key(d) <= tk; d = addDays(d, 1)) {
    const k = key(d);
    if (isFull(log, k)) { run++; best = Math.max(best, run); }
    else if (isRest(log, k)) { /* bridge */ }
    else if (k !== tk) run = 0;
  }
  return { cur: run, best };
}
function restUsedInWeek(log, date) {
  const ws = weekStart(date); let n = 0;
  for (let i = 0; i < 7; i++) if (isRest(log, key(addDays(ws, i)))) n++;
  return n;
}
