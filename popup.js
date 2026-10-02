const $ = id => document.getElementById(id);
let state;

async function render() {
  state = await load();
  const { tasks, log } = state;
  const now = new Date(), tk = key(now);
  const e = log[tk] || { done: [], total: tasks.length };
  const rest = isRest(log, tk);
  const { cur, best } = streaks(log);

  $('cur').textContent = cur;
  $('best').textContent = best;
  const used = restUsedInWeek(log, now);
  $('rest').textContent = `Rest day this week: ${used ? 'used' : 'available'}`;
  $('today').textContent = now.toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'short' }) + (rest ? ' (rest day)' : '');

  const ul = $('tasks'); ul.textContent = '';
  tasks.forEach(t => {
    const li = document.createElement('li');
    const checked = !rest && e.done.includes(t.id);
    if (checked) li.className = 'done';
    const label = document.createElement('label');
    const cb = document.createElement('input'); cb.type = 'checkbox'; cb.checked = checked; cb.disabled = rest;
    cb.onchange = () => toggle(t.id, cb.checked);
    const sp = document.createElement('span'); sp.textContent = t.name;
    label.append(cb, sp);
    const x = document.createElement('button'); x.className = 'x'; x.textContent = '×'; x.title = 'Remove task'; x.onclick = () => removeTask(t.id);
    li.append(label, x); ul.append(li);
  });

  const rb = $('restBtn');
  if (rest) { rb.textContent = 'Undo rest day'; rb.disabled = false; }
  else { rb.textContent = used ? 'Rest day already used this week' : 'Use my rest day for today (keeps streak, adds nothing)'; rb.disabled = !!used; }

  drawHeat(log, now);
}

function drawHeat(log, now) {
  const heat = $('heat'); heat.textContent = '';
  const start = addDays(weekStart(now), -11 * 7), tk = key(now);
  for (let i = 0; i < 84; i++) {
    const d = addDays(start, i), k = key(d), en = log[k];
    const c = document.createElement('i');
    let cls = 'c0';
    if (en && en.rest) cls = 'cr';
    else if (en && en.total) { const r = en.done.length / en.total; cls = r >= 1 ? 'c3' : r >= .5 ? 'c2' : r > 0 ? 'c1' : 'c0'; }
    c.className = cls + (k === tk ? ' today' : '') + (k > tk ? ' future' : '');
    c.title = k;
    heat.append(c);
  }
}

async function toggle(id, on) {
  const { tasks, log } = state, k = key(new Date());
  const cur = log[k] && !log[k].rest ? log[k] : { done: [], total: tasks.length };
  const set = new Set(cur.done); on ? set.add(id) : set.delete(id);
  log[k] = { done: [...set], total: tasks.length };
  await save({ log }); render();
}
async function removeTask(id) {
  if (state.tasks.length <= 1) return;
  await save({ tasks: state.tasks.filter(t => t.id !== id) }); render();
}
$('add').onsubmit = async ev => {
  ev.preventDefault();
  const name = $('newTask').value.trim(); if (!name) return;
  await save({ tasks: [...state.tasks, { id: 't' + Date.now(), name }] });
  $('newTask').value = ''; render();
};
$('restBtn').onclick = async () => {
  const { log, tasks } = state, k = key(new Date());
  if (isRest(log, k)) delete log[k];
  else log[k] = { rest: true, done: [], total: tasks.length };
  await save({ log }); render();
};
render();
