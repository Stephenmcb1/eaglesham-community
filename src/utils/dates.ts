/*
  Date helpers. Content stores dates as YYYY-MM-DD; the site shows them as
  "Friday 22 January 2027" (style guide §11).
*/

// Turn "2027-01-22" into "Friday 22 January 2027".
// timeZone "UTC" stops the date shifting by a day depending on where the build runs.
// The weekday is formatted separately because en-GB adds a comma after it ("Friday, 22…").
export function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  const weekday = date.toLocaleDateString("en-GB", { weekday: "long", timeZone: "UTC" });
  const dayMonthYear = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  return `${weekday} ${dayMonthYear}`;
}

// The same without the weekday: "22 January 2027".
export function formatDateShort(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

// True once the deadline day has fully passed. Checked when the site is built,
// so the site needs one rebuild after the deadline to show the "closed" message.
export function isAfterDeadline(isoDate: string, now: Date = new Date()): boolean {
  const endOfDeadlineDay = new Date(`${isoDate}T23:59:59Z`);
  return now > endOfDeadlineDay;
}
