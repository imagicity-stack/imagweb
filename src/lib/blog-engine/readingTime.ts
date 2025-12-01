const WORDS_PER_MINUTE = 200;

export const estimateReadingTime = (html: string) => {
  const text = html.replace(/<[^>]+>/g, " ");
  const words = text
    .split(/\s+/)
    .map((word) => word.trim())
    .filter(Boolean);
  const minutes = Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));
  return minutes;
};
