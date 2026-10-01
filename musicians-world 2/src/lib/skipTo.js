export function skipTo(id) {
  return (e) => {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    target.focus();
    target.scrollIntoView({ block: "start" });
  };
}
