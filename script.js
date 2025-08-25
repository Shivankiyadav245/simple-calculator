const screen = document.getElementById('screen');
const hist = document.getElementById('history');
const list = document.getElementById('list');
const clearHist = document.getElementById('clearHist');

function addToScreen(val){ screen.value += val; }
function setHistory(text){ hist.textContent = text || ''; }
function sanitize(expr){
  // Allow only digits, operators, parentheses, decimal point, spaces
  if(!/^[0-9+\-*/%.()\s]*$/.test(expr)) throw new Error('Invalid input');
  return expr;
}
function calculate(){
  try{
    const expr = sanitize(screen.value || '0');
    const res = Function('return (' + expr + ')')();
    if(Number.isFinite(res)){
      setHistory(expr + ' =');
      screen.value = String(res);
      pushItem(expr + ' = ' + res);
    }else{ throw new Error('Math error'); }
  }catch(e){
    setHistory('Error');
  }
}
function pushItem(text){
  const items = JSON.parse(localStorage.getItem('calc_history')||'[]');
  items.unshift(text);
  localStorage.setItem('calc_history', JSON.stringify(items.slice(0,50)));
  renderList();
}
function renderList(){
  const items = JSON.parse(localStorage.getItem('calc_history')||'[]');
  list.innerHTML='';
  items.forEach(t=>{
    const li = document.createElement('li');
    const [exp, ans] = t.split(' = ');
    const left = document.createElement('span'); left.textContent = exp;
    const right = document.createElement('strong'); right.textContent = ans;
    li.append(left,right);
    li.addEventListener('click', ()=>{ screen.value = exp; setHistory(exp + ' ='); });
    list.appendChild(li);
  });
}
function press(e){
  const t = e.target;
  if(t.dataset.val){ addToScreen(t.dataset.val); }
  if(t.dataset.act==='ac'){ screen.value=''; setHistory(''); }
  if(t.dataset.act==='del'){ screen.value = screen.value.slice(0,-1); }
  if(t.dataset.act==='eq'){ calculate(); }
}
document.querySelector('.keys').addEventListener('click', press);
document.addEventListener('keydown', (e)=>{
  const k = e.key;
  if('0123456789+-*/().%'.includes(k)){ addToScreen(k); }
  if(k==='Enter'){ e.preventDefault(); calculate(); }
  if(k==='Backspace'){ screen.value = screen.value.slice(0,-1); }
  if(k==='Escape'){ screen.value=''; setHistory(''); }
});
clearHist.addEventListener('click', ()=>{ localStorage.removeItem('calc_history'); renderList(); });
renderList();