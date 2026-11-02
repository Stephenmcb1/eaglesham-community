/*
  Adds "That's N days away." to the deadline strip.
  Without JavaScript the strip still shows the date, so this is only a bonus.
*/

const MS_PER_DAY = 24 * 60 * 60 * 1000;

for (const el of document.querySelectorAll<HTMLElement>("[data-countdown]")) {
  const deadline = el.dataset.deadline;
  if (!deadline) continue;

  // Compare calendar days only, using the visitor's own date, so the count
  // changes at midnight rather than at the time of day the page was opened.
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  const [year, month, day] = deadline.split("-").map(Number);
  const deadlineDay = Date.UTC(year, month - 1, day);
  const days = Math.round((deadlineDay - today) / MS_PER_DAY);

  if (days > 1) el.textContent = ` That's ${days} days away.`;
  else if (days === 1) el.textContent = " That's tomorrow.";
  else if (days === 0) el.textContent = " That's today.";
  // After the deadline, say nothing: the next rebuild shows the "closed" message.
}
