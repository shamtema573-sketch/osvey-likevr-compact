(() => {
  'use strict';
  const config = window.OSVEY;
  const rubles = new Intl.NumberFormat('ru-RU', {style:'currency', currency:'RUB', maximumFractionDigits:0});
  const money = value => rubles.format(value);
  const lookup = (options, id) => options.find(option => option.id === id);
  const calculate = state => ({
    navigation: config.base,
    exterior: state.exterior ? config.exterior : 0,
    interior: lookup(config.interiors, state.interior).price,
    equipment: lookup(config.equipment, state.equipment).price,
  });
  const total = amounts => Object.values(amounts).reduce((sum, price) => sum + price, 0);
  const comparison = document.querySelector('#comparison');
  if (comparison) {
    const presets = [config.presets.min, config.presets.max];
    const rows = [
      ['Осмотр, навигация и сборка', ...presets.map(() => money(config.base))],
      ['Экстерьер', ...presets.map(() => money(config.exterior))],
      ['Интерьер', ...presets.map(p => lookup(config.interiors,p.interior).label + '<br><small>' + money(lookup(config.interiors,p.interior).price) + '</small>')],
      ['Оборудование', ...presets.map(p => lookup(config.equipment,p.equipment).label + '<br><small>' + money(lookup(config.equipment,p.equipment).price) + '</small>')],
      ['Итого', ...presets.map(p => money(total(calculate(p))))],
      ['Срок', ...presets.map(() => '≈ ' + config.days + ' дней')],
    ];
    comparison.innerHTML = '<table><thead><tr><th scope="col">Состав</th><th scope="col">Минимальный</th><th scope="col">Максимальный</th></tr></thead><tbody>' +
      rows.map(([label,min,max]) => '<tr'+(label==='Итого'?' class="sum"':'')+'><th scope="row">'+label+'</th><td>'+min+'</td><td>'+max+'</td></tr>').join('') +
      '</tbody></table><p class="note">Для автономной гарнитуры потребуется компромисс по качеству графики.</p>';
  }
  const root = document.querySelector('[data-calculator]');
  let selectPreset;
  if (root) {
    const choices = (name, items) => items.map(({id,label,detail,price}) =>
      '<label class="choice"><input type="radio" name="'+name+'" value="'+id+'"><span><strong>'+label+'</strong><small>'+detail+'</small></span><b>'+money(price)+'</b></label>').join('');
    root.innerHTML = `
      <div class="presets" aria-label="Рекомендованные комплектации">
        <button type="button" data-preset="min" aria-pressed="true"><strong>Минимальный рекомендуемый</strong><span>${money(total(calculate(config.presets.min)))}</span></button>
        <button type="button" data-preset="max" aria-pressed="false"><strong>Максимальный рекомендуемый</strong><span>${money(total(calculate(config.presets.max)))}</span></button>
      </div>
      <div class="calc-grid">
        <form class="inputs">
          <div class="fixed"><span><strong>Осмотр, навигация и базовая сборка</strong><small>Обязательная часть</small></span><b>${money(config.base)}</b></div>
          <label class="choice exterior"><input type="checkbox" name="exterior"><span><strong>Экстерьер</strong><small>Внешняя визуализация самолёта</small></span><b>${money(config.exterior)}</b></label>
          <fieldset><legend>Интерьер</legend>${choices('interior', config.interiors)}</fieldset>
          <fieldset><legend>Оборудование</legend>${choices('equipment', config.equipment)}</fieldset>
        </form>
        <aside class="receipt" aria-label="Расчёт стоимости">
          <p class="eyebrow">ВАША КОМПЛЕКТАЦИЯ</p><p id="active-config"></p>
          <output id="total" aria-live="polite" aria-atomic="true"></output>
          <dl><div><dt>Навигация и сборка</dt><dd data-line="navigation"></dd></div><div><dt>Экстерьер</dt><dd data-line="exterior"></dd></div><div><dt>Интерьер</dt><dd data-line="interior"></dd></div><div><dt>Оборудование</dt><dd data-line="equipment"></dd></div></dl>
          <p class="timing">Ориентировочно ${config.days} дней</p><p class="note">Стоимость и срок предварительные. Уточним их после согласования состава работ и исходных материалов.</p>
        </aside>
      </div>`;
    const form = root.querySelector('form');
    const buttons = [...root.querySelectorAll('[data-preset]')];
    let selectedPreset = 'min';
    function render() {
      const state = {exterior:form.elements.exterior.checked, interior:form.elements.interior.value, equipment:form.elements.equipment.value};
      const amounts = calculate(state);
      root.querySelector('#active-config').textContent = selectedPreset ? config.presets[selectedPreset].label : 'Своя конфигурация';
      root.querySelector('#total').textContent = money(total(amounts));
      for (const [name, value] of Object.entries(amounts)) {
        root.querySelector('[data-line="'+name+'"]').textContent = name === 'exterior' && value === 0 ? 'Не включён' : money(value);
      }
      buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.preset === selectedPreset)));
    }
    selectPreset = key => {
      const preset = config.presets[key];
      selectedPreset = key;
      form.elements.exterior.checked = preset.exterior;
      form.elements.interior.value = preset.interior;
      form.elements.equipment.value = preset.equipment;
      render();
    };
    form.addEventListener('submit', event => event.preventDefault());
    form.addEventListener('change', () => {selectedPreset = null; render();});
    buttons.forEach(button => button.addEventListener('click', () => selectPreset(button.dataset.preset)));
    selectPreset('min');
  }
  const slides = [...document.querySelectorAll('[data-slide]')];
  if (slides.length) {
    const labels = ['Проект','Сценарий','Варианты','Калькулятор','Кейсы','Контакты'];
    const slugs = ['project','scope','options','calculator','cases','contact'];
    const steps = document.querySelector('#steps');
    const prev = document.querySelector('#prev');
    const next = document.querySelector('#next');
    let current = 0;
    steps.innerHTML = labels.map((label,i) => '<button type="button" data-step="'+i+'"><small>0'+(i+1)+'</small>'+label+'</button>').join('');
    const buttons = [...steps.children];
    function show(index,{focus=true,update=true}={}) {
      current = Math.min(slides.length - 1, Math.max(0,index));
      slides.forEach((slide,i) => {slide.hidden = i !== current;});
      buttons.forEach((button,i) => i === current ? button.setAttribute('aria-current','step') : button.removeAttribute('aria-current'));
      prev.disabled = current === 0;
      next.disabled = current === slides.length - 1;
      if (update) history.replaceState(null,'','#'+slugs[current]);
      buttons[current].scrollIntoView({block:'nearest',inline:'nearest'});
      window.scrollTo(0,0);
      if (focus) {
        const heading = slides[current].querySelector('h1,h2');
        heading.tabIndex = -1;
        heading.focus({preventScroll:true});
      }
    }
    buttons.forEach(button => button.addEventListener('click', () => show(Number(button.dataset.step))));
    document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click',() => show(Number(button.dataset.go))));
    prev.addEventListener('click',() => show(current-1));
    next.addEventListener('click',() => show(current+1));
    document.addEventListener('keydown', event => {
      if (event.altKey || event.metaKey || event.ctrlKey || event.target.closest('input,textarea,select,button,a')) return;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault(); show(current+(event.key==='ArrowRight'?1:-1));
      }
    });
    let start;
    const main = document.querySelector('.presentation');
    main.addEventListener('touchstart', e => {
      start = e.touches.length === 1 && !e.target.closest('button,a,input,label,form,[data-calculator],.scenario-card') ? e.touches[0] : null;
    },{passive:true});
    main.addEventListener('touchend', e => {
      if (!start) return;
      const end=e.changedTouches[0], x=end.clientX-start.clientX, y=end.clientY-start.clientY;
      if (Math.abs(x)>65 && Math.abs(x)>2*Math.abs(y)) show(current+(x<0?1:-1));
      start=null;
    },{passive:true});
    const sync = () => show(Math.max(0,slugs.indexOf(location.hash.slice(1))),{focus:false,update:false});
    window.addEventListener('hashchange',sync);
    sync();
  }
  const cabinNames = {passenger:'Пассажирская', cargo:'Грузовая', medical:'Медицинская'};
  const cabinButtons = [...document.querySelectorAll('[data-cabin]')];
  cabinButtons.forEach(button => button.addEventListener('click', () => {
    const id = button.dataset.cabin;
    const label = cabinNames[id] + ' компоновка';
    const image = document.querySelector('#cabin-image');
    image.src = 'assets/osvey-' + id + '.webp';
    image.alt = label + ' салона «Освея»';
    document.querySelector('#cabin-label').textContent = label;
    cabinButtons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  }));
  document.querySelectorAll('[data-contact]').forEach(label => {
    label.textContent = config[label.dataset.contact];
  });
  document.querySelectorAll('[data-channel="telegram"]').forEach(anchor => {
    anchor.href = config.telegram;
    anchor.querySelector('span').textContent = '@' + config.telegram.split('/').pop() + ' ↗';
  });
})();
