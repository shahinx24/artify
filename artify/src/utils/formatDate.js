export default function formatDate(date, options = {}) {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  return d.toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    ...options,
  });
}