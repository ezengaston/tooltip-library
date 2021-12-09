export default function globalEventListener(type, selector, callback) {
  document.addEventListener(type, (e) => {
    if (!e.target.matches(selector)) return;
    callback(e);
  });
}
