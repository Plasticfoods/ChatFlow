export const formatTime = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  const now = new Date();

  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  const isYesterday =
    date.getDate() === now.getDate() - 1 &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    // Return time (e.g., "4:19 PM")
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  } else if (isYesterday) {
    return "Yesterday";
  } else {
    // Return date (e.g., "09/01/2026")
    return date.toLocaleDateString([], {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }
};