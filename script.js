'use strict';
// Task 1 — Form validation
const form = document.getElementById('registrationForm');
form.addEventListener('submit', function(event) {
  event.preventDefault();
  const email = document.getElementById('emailRegistration').value.trim();
  const password = document.getElementById('passwordRegistration').value;
  const confirm = document.getElementById('passwordCheck').value;
  const emailError = !email ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email.' : '';
  const passwordError = !password ? 'Password is required.' : password.length < 8 ? 'Use at least 8 characters.' : '';
  const confirmError = !confirm ? 'Confirm your password.' : confirm !== password ? 'Passwords do not match.' : '';
  document.getElementById('emailError').textContent = emailError;
  document.getElementById('passwordError').textContent = passwordError;
  document.getElementById('confirmError').textContent = confirmError;
  const valid = !emailError && !passwordError && !confirmError;
  const status = document.getElementById('registrationStatus');
  status.textContent = valid ? '✓ Validation passed! Demo only: no account was created.' : 'Please correct the errors above.';
  status.style.color = valid ? '#287c36' : '#b22e2e';
});
// Task 2 — Accordion (smooth open/close)
document.querySelectorAll('.faq button').forEach(button => {
  button.addEventListener('click', () => {
    const answer = document.getElementById(button.getAttribute('aria-controls'));
    const opening = button.getAttribute('aria-expanded') !== 'true';
    button.setAttribute('aria-expanded', String(opening));
    button.querySelector('span').textContent = opening ? '−' : '+';
    if (opening) {
      answer.hidden = false;
      answer.animate([{opacity:0,transform:'translateY(-10px)'},{opacity:1,transform:'translateY(0)'}], {duration:250,easing:'ease-out'});
    } else {
      answer.hidden = true;
    }
  });
});
// Task 3 — Popup form
const backdrop = document.getElementById('modalBackdrop');
const openModal = document.getElementById('openModal');
const closeModal = document.getElementById('closeModal');
let previousFocus;
function showModal() { previousFocus = document.activeElement; backdrop.hidden = false; document.getElementById('contactName').focus(); }
function hideModal() { backdrop.hidden = true; if (previousFocus) previousFocus.focus(); }
openModal.addEventListener('click', showModal);
closeModal.addEventListener('click', hideModal);
backdrop.addEventListener('click', e => { if (e.target === backdrop) hideModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !backdrop.hidden) hideModal(); });
document.getElementById('contactForm').addEventListener('submit', e => {
  e.preventDefault();
  document.getElementById('contactStatus').textContent = '✓ Demo message validated! Nothing was sent.';
});
// Task 4 — Background color cycle
const colors = ['#f6f8f2','#e9f4ff','#fff0e7','#f4edff','#f7f5dc'];
let colorIndex = 0;
document.getElementById('colorButton').addEventListener('click', () => {
  colorIndex = (colorIndex + 1) % colors.length;
  document.body.style.backgroundColor = colors[colorIndex];
});
// Task 5 — Current date and time
function updateDateTime() {
  document.getElementById('dateTime').textContent = '● ' + new Date().toLocaleString('en-US', {year:'numeric',month:'long',day:'numeric',hour:'numeric',minute:'2-digit',second:'2-digit'});
}
updateDateTime();
setInterval(updateDateTime, 1000);

// Assignment 5: dynamic article library, keyboard navigation, callbacks, audio.
const wikiSettings = {
  nightMode: false, soundEnabled: false,
  toggleTheme() {
    this.nightMode = !this.nightMode;
    document.body.classList.toggle('night', this.nightMode);
    return this.nightMode;
  }
};
const articles = [
  {id:'html', title:'HTML', symbol:'</>', description:'The structure and meaning of every webpage.', detail:'Semantic HTML tags organize accessible content.', url:'https://developer.mozilla.org/en-US/docs/Web/HTML'},
  {id:'css', title:'CSS', symbol:'✺', description:'Colors, spacing, and responsive layouts.', detail:'Flexbox, Grid, and media queries help create responsive designs.', url:'https://developer.mozilla.org/en-US/docs/Web/CSS'},
  {id:'javascript', title:'JavaScript', symbol:'JS', description:'The language that makes the web interactive.', detail:'JavaScript listens to events and updates the DOM dynamically.', url:'https://developer.mozilla.org/en-US/docs/Web/JavaScript'}
];
let audioContext;
function playClickSound() {
  if (!wikiSettings.soundEnabled) return;
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    audioContext = audioContext || new AudioCtx();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.frequency.value = 520;
    gain.gain.setValueAtTime(0.04, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.10);
    oscillator.connect(gain); gain.connect(audioContext.destination);
    oscillator.start(); oscillator.stop(audioContext.currentTime + 0.11);
  } catch (error) { console.warn('Audio not available', error); }
}
function makeArticleCard(article) {
  const card = document.createElement('article');
  const graphic = document.createElement('div');
  graphic.className = `graphic ${article.id}`;
  graphic.textContent = article.symbol;
  const title = document.createElement('h3'); title.textContent = article.title;
  const summary = document.createElement('p'); summary.textContent = article.description;
  const more = document.createElement('button');
  more.className = 'read-more'; more.textContent = 'Read more +'; more.setAttribute('aria-expanded','false');
  const detail = document.createElement('p'); detail.className = 'card-details'; detail.textContent = article.detail; detail.hidden = true;
  const link = document.createElement('a'); link.href = article.url; link.target='_blank'; link.rel='noopener noreferrer'; link.textContent='Open MDN ↗';
  more.addEventListener('click', () => {
    const open = detail.hidden;
    detail.hidden = !open;
    more.textContent = open ? 'Read less −' : 'Read more +';
    more.setAttribute('aria-expanded', String(open));
    if (open && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      detail.animate([{opacity:0,transform:'translateY(-8px)'},{opacity:1,transform:'translateY(0)'}], {duration:250});
    }
    playClickSound();
  });
  card.append(graphic,title,summary,more,detail,link);
  return card;
}
function filterArticles(category) {
  let selected;
  switch (category) {
    case 'html': selected = articles.filter(item => item.id === 'html'); break;
    case 'css': selected = articles.filter(item => item.id === 'css'); break;
    case 'javascript': selected = articles.filter(item => item.id === 'javascript'); break;
    default: selected = articles;
  }
  const container = document.querySelector('.cards');
  container.replaceChildren();
  for (const article of selected) container.append(makeArticleCard(article));
  document.getElementById('articleCount').textContent = `Showing ${selected.length} of ${articles.length} articles`;
}
document.querySelectorAll('.filter').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.filter').forEach(item => {
      item.classList.toggle('active', item === button);
      item.setAttribute('aria-pressed', String(item === button));
    });
    filterArticles(button.dataset.category);
    playClickSound();
  });
});
filterArticles('all');
const navLinks = Array.from(document.querySelectorAll('#mainNav a'));
document.getElementById('mainNav').addEventListener('keydown', event => {
  if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
  event.preventDefault();
  const index = navLinks.indexOf(document.activeElement);
  const offset = event.key === 'ArrowRight' ? 1 : -1;
  navLinks[(index + offset + navLinks.length) % navLinks.length].focus();
});
document.getElementById('themeToggle').addEventListener('click', event => {
  const on = wikiSettings.toggleTheme();
  event.currentTarget.textContent = on ? '☀ Day mode' : '☾ Night mode';
  event.currentTarget.setAttribute('aria-pressed',String(on));
  playClickSound();
});
document.getElementById('soundToggle').addEventListener('click', event => {
  wikiSettings.soundEnabled = !wikiSettings.soundEnabled;
  event.currentTarget.textContent = wikiSettings.soundEnabled ? '♪ Sound on' : '♪ Sound off';
  event.currentTarget.setAttribute('aria-pressed',String(wikiSettings.soundEnabled));
  playClickSound();
});
function showWizardStep(step, callback) {
  document.getElementById('wizardStep1').hidden = step !== 1;
  document.getElementById('wizardStep2').hidden = step !== 2;
  if (typeof callback === 'function') callback(step);
}
document.getElementById('wizardNext').addEventListener('click', () => {
  showWizardStep(2, () => document.getElementById('wizardResult').textContent = ''); playClickSound();
});
document.getElementById('wizardBack').addEventListener('click', () => {
  showWizardStep(1, () => document.getElementById('wizardResult').textContent = ''); playClickSound();
});
document.getElementById('wizardFinish').addEventListener('click', () => {
  const chosen = articles.find(item => item.id === document.getElementById('interest').value);
  const beginner = document.getElementById('experience').value === 'beginner';
  document.getElementById('wizardResult').textContent = `${beginner ? 'Start with' : 'Explore'} ${chosen.title}: ${chosen.description}`;
  playClickSound();
});
document.getElementById('surpriseButton').addEventListener('click', () => {
  const random = articles[Math.floor(Math.random() * articles.length)];
  document.getElementById('surpriseResult').textContent = `Try ${random.title}: ${random.detail}`;
  playClickSound();
});


// Assignment 6: jQuery interactions (all nine tasks).
$(document).ready(function () {
  console.log('jQuery is ready!'); // Task 0
  const $search = $('#wikiSearch');
  const $suggestions = $('#searchSuggestions');
  let activeQuery = '';
  function escapeHTML(value) { return $('<div>').text(value).html(); }
  function highlight(text, query) {
    const safe = escapeHTML(text);
    if (!query) return safe;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return safe.replace(new RegExp('(' + escaped + ')', 'gi'), '<mark>$1</mark>');
  }
  // Tasks 1–3: live filter, autocomplete, and highlighted matches.
  function updateSearch(query) {
    activeQuery = query.trim();
    const matches = articles.filter(article => [article.title,article.description,article.detail].some(v => v.toLowerCase().includes(activeQuery.toLowerCase())));
    const $cards = $('.cards');
    $cards.children('article').each(function () {
      const title = $(this).find('h3').text();
      const article = articles.find(a => a.title === title);
      const visible = !activeQuery || (article && matches.includes(article));
      $(this).toggle(visible);
      $(this).find('h3, p:not(.card-details)').each(function () {
        const original = $(this).text();
        $(this).html(highlight(original, activeQuery));
      });
    });
    $('#searchStatus').text(activeQuery ? matches.length + ' matching article(s)' : '');
    $suggestions.empty();
    if (activeQuery && matches.length) {
      matches.forEach(a => $('<button type="button" class="suggestion" role="option">').text(a.title).appendTo($suggestions));
      $suggestions.prop('hidden', false);
    } else $suggestions.prop('hidden', true);
  }
  $search.on('input', function () {
    $('.filter[data-category="all"]').trigger('click');
    updateSearch(this.value);
  });
  $suggestions.on('click', '.suggestion', function () {
    $search.val($(this).text()); updateSearch($search.val()); $suggestions.prop('hidden', true);
    showToast('Showing ' + $search.val() + ' articles');
  });
  $search.on('keydown', function(e){if(e.key==='Escape') $suggestions.prop('hidden',true);});
  $(document).on('click', function(e){if(!$(e.target).closest('.search-panel').length) $suggestions.prop('hidden',true);});
  $('.filters').on('click','button',function(){ if(activeQuery) updateSearch($search.val()); });
  // Task 4: reading/scroll progress.
  function updateProgress() {
    const max = $(document).height() - $(window).height();
    $('#scrollProgress').css('width', (max > 0 ? Math.min(100, $(window).scrollTop()/max*100) : 100) + '%');
  }
  $(window).on('scroll resize', updateProgress); updateProgress();
  // Task 5: animate the counters once in view.
  let counted = false;
  function animateCounters() {
    if (counted || !$('.stats-section').length) return;
    if ($('.stats-section').offset().top > $(window).scrollTop() + $(window).height() - 50) return;
    counted = true;
    $('.counter').each(function () {
      const el = this, target = Number($(el).data('target'));
      $({value:0}).animate({value:target},{duration:1100,easing:'swing',step:function(v){$(el).text(Math.floor(v));},complete:function(){$(el).text(target);}});
    });
  }
  $(window).on('scroll resize',animateCounters); animateCounters();
  // Task 7: reusable toast notification.
  let toastTimer;
  function showToast(message) {
    clearTimeout(toastTimer);
    $('#toast').stop(true,true).text(message).fadeIn(180);
    toastTimer = setTimeout(() => $('#toast').fadeOut(350), 2400);
  }
  // Task 6: loading spinner, temporary disable, and restoration on submit.
  $('#contactForm').on('submit',function(e){
    if (!this.checkValidity()) return;
    const $button = $(this).find('[type="submit"]');
    const old = $button.text();
    $button.prop('disabled',true).html('<span class="loading-spinner" aria-hidden="true"></span>Please wait…');
    setTimeout(function(){ $button.prop('disabled',false).text(old);showToast('Demo message validated — nothing was sent.'); },950);
  });
  $('#registrationForm').on('submit',function(){
    if ($('#registrationStatus').text().startsWith('✓')) {
      const $button = $(this).find('[type="submit"]');const old=$button.text();
      $button.prop('disabled',true).html('<span class="loading-spinner" aria-hidden="true"></span>Please wait…');
      setTimeout(function(){$button.prop('disabled',false).text(old);showToast('Validation successful — demo only.');},950);
    }
  });
  // Task 8: copy text with clipboard API, fallback and visual feedback.
  $('.copy-code').on('click',async function(){
    const button=this, text=$(button).siblings('code').text();
    try {
      if (navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(text);
      else { const el=document.createElement('textarea');el.value=text;el.style.position='fixed';el.style.opacity='0';document.body.appendChild(el);el.select();if(!document.execCommand('copy'))throw new Error('Copy failed');el.remove(); }
      $(button).text('✓ Copied').addClass('copied');showToast('Copied to clipboard!');
      setTimeout(()=>$(button).text('Copy').removeClass('copied'),1800);
    } catch(error){showToast('Copy unavailable — select the snippet manually.');}
  });
  // Task 9: lazy loading from data-src as the images enter the viewport.
  const $lazy = $('.lazy-image');
  function loadVisibleImages(){
    $lazy.each(function(){
      const $img=$(this);if(!$img.attr('data-src'))return;
      const top=$img.offset().top;
      if(top < $(window).scrollTop()+$(window).height()+120){
        $img.on('load',function(){$img.addClass('loaded');});
        $img.attr('src',$img.attr('data-src')).removeAttr('data-src');
      }
    });
  }
  $(window).on('scroll resize',loadVisibleImages);loadVisibleImages();
});
