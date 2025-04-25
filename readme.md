```
javascript:(() => {
  const s = document.createElement('script');
  s.src = 'https://exemplo.com/course-processor.js';
  s.type = 'text/javascript';
  s.onload = () => console.log('Script carregado com sucesso');
  document.head.appendChild(s);
})();
```
