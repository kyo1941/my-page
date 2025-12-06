export const parseDate = (dateStr: string) => {
  const match = dateStr.match(/(\d{4})年\s*(\d{1,2})月(?:\s*(\d{1,2})日)?/);

  if (!match) return new Date(NaN);

  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = match[3] ? parseInt(match[3], 10) : 1; // 日が指定されていない場合は1日とみなす
  return new Date(year, month, day);
};
