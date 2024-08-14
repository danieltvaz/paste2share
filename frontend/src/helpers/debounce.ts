export function debounce(func: (...args: any) => any, delay = 1000) {
  let id: NodeJS.Timeout;

  return (...args: any[]) => {
    if (id) clearTimeout(id);

    id = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
