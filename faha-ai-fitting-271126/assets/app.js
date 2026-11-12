(() => { 'use strict';
const init=()=>{
const menu=document.querySelector('.menu-toggle'),mobileNav=document.querySelector('.mobile-nav');
menu?.addEventListener('click',()=>{const opened=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!opened));mobileNav.classList.toggle('open',!opened)});
mobileNav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');mobileNav.classList.remove('open')}));
const modal=document.getElementById('lightbox'),content=document.getElementById('lightbox-content'),caption=document.getElementById('lightbox-caption'),close=modal.querySelector('.lightbox-close');let oldFocus=null;
function show(kind,url,label){oldFocus=document.activeElement;document.querySelectorAll('video').forEach(v=>v.pause());content.replaceChildren();let v=kind==='video'?document.createElement('video'):document.createElement('img');v.src=url;if(kind==='video'){v.controls=true;v.autoplay=true;v.playsInline=true;v.play().catch(()=>{});}else{v.alt=label;}content.appendChild(v);caption.textContent=label;modal.hidden=false;document.body.classList.add('modal-open');close.focus();}
function hide(){if(modal.hidden)return;content.querySelector('video')?.pause();content.replaceChildren();modal.hidden=true;document.body.classList.remove('modal-open');oldFocus?.focus();}
document.querySelectorAll('[data-video]').forEach(btn=>btn.addEventListener('click',()=>show('video',btn.dataset.video,btn.dataset.label||'Видео')));
document.querySelectorAll('[data-image]').forEach(btn=>btn.addEventListener('click',()=>show('image',btn.dataset.image,btn.dataset.alt||'Фото')));
close.addEventListener('click',hide);modal.addEventListener('click',e=>{if(e.target===modal)hide()});window.addEventListener('keydown',e=>{if(e.key==='Escape')hide()});
document.querySelectorAll('video').forEach(v=>v.addEventListener('play',()=>document.querySelectorAll('video').forEach(other=>{if(v!==other)other.pause()})));
}; if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();