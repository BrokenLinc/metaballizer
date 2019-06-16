function getCursorPosition(element, event) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  return {x, y};
}

export default getCursorPosition;
