importScripts('shared.js');

async function refreshBadge() {
  const { log } = await load();
  const { cur } = streaks(log);
  chrome.action.setBadgeText({ text: cur ? String(cur) : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#14213D' });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create('hourly', { periodInMinutes: 60 });
  refreshBadge();
});
chrome.runtime.onStartup.addListener(refreshBadge);
chrome.storage.onChanged.addListener(refreshBadge);

// ~8 pm nudge if today isn't finished
chrome.alarms.onAlarm.addListener(async a => {
  if (a.name !== 'hourly') return;
  refreshBadge();
  if (new Date().getHours() !== 20) return;
  const { log } = await load();
  const k = key(new Date());
  if (isFull(log, k) || isRest(log, k)) return;
  const { cur } = streaks(log);
  chrome.notifications.create({
    type: 'basic', iconUrl: 'icon128.png', title: 'GATE Streak',
    message: cur ? `Your ${cur}-day streak ends tonight unless today's checklist is done.` : "Today's checklist isn't done yet."
  });
});
