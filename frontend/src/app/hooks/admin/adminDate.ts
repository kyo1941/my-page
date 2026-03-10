const INPUT_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const JA_DATE_PATTERN = /(\d{4})年(\d{1,2})月(\d{1,2})日/;

export function toJaLongDateFromInput(date: string): string {
  const match = date.match(INPUT_DATE_PATTERN);
  if (!match) return "";

  const [, year, month, day] = match;
  const utcDate = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return utcDate.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function toInputDateStringFromJaDate(dateText: string): string {
  const match = dateText.match(JA_DATE_PATTERN);
  if (!match) return "";
  const [, y, m, d] = match;
  return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
}

export function getTodayInputDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
