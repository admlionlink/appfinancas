export const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export interface MonthRange {
  year: number;
  month: number;
  startDate: string;
  endDate: string;
  label: string;
}

export function getMonthRange(year: number, month: number): MonthRange {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 0));

  const pad = (n: number) => n.toString().padStart(2, "0");
  const startDate = `${start.getUTCFullYear()}-${pad(start.getUTCMonth() + 1)}-${pad(
    start.getUTCDate()
  )}`;
  const endDate = `${end.getUTCFullYear()}-${pad(end.getUTCMonth() + 1)}-${pad(
    end.getUTCDate()
  )}`;

  return {
    year,
    month,
    startDate,
    endDate,
    label: `${MONTH_NAMES[month - 1]} de ${year}`,
  };
}

export function getCurrentMonth(): { year: number; month: number } {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

export function parseMonthParam(value?: string | null): { year: number; month: number } {
  if (!value) return getCurrentMonth();
  const [yearStr, monthStr] = value.split("-");
  const year = Number(yearStr);
  const month = Number(monthStr);
  if (!year || !month || month < 1 || month > 12) return getCurrentMonth();
  return { year, month };
}

export function formatMonthValue(year: number, month: number): string {
  return `${year}-${month.toString().padStart(2, "0")}`;
}

export function listAvailableMonths(): { value: string; label: string }[] {
  const months: { value: string; label: string }[] = [];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  for (let i = 0; i < 24; i++) {
    let m = currentMonth - i;
    let y = currentYear;
    while (m <= 0) {
      m += 12;
      y -= 1;
    }
    months.push({
      value: formatMonthValue(y, m),
      label: `${MONTH_NAMES[m - 1]} de ${y}`,
    });
  }

  return months;
}
