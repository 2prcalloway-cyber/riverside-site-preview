(function(){
  var d=document;
  if(/[?&]shot=1/.test(location.search)) d.documentElement.classList.add('no-anim','shot');
  // header shadow
  var h=d.querySelector('.site-header');
  function sc(){ if(h) h.classList.toggle('scrolled', window.scrollY>8); }
  window.addEventListener('scroll',sc,{passive:true}); sc();
  // mobile menu
  var mm=d.getElementById('mobile-menu');
  d.querySelectorAll('[data-menu]').forEach(function(b){
    b.addEventListener('click',function(){
      var open=b.getAttribute('data-menu')==='open';
      mm.classList.toggle('open',open); d.body.style.overflow=open?'hidden':'';
      d.querySelectorAll('.burger').forEach(function(x){x.setAttribute('aria-expanded',open)});
    });
  });
  // reveal on scroll
  var els=d.querySelectorAll('.rv');
  if('IntersectionObserver' in window && !d.documentElement.classList.contains('no-anim')){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e)});
  } else els.forEach(function(e){e.classList.add('in')});
  // rail
  d.querySelectorAll('[data-rail]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var r=d.getElementById(btn.getAttribute('data-rail'));
      r.scrollBy({left:(btn.dataset.dir==='prev'?-1:1)*r.clientWidth*0.8,behavior:'smooth'});
    });
  });
  // gallery filters
  d.querySelectorAll('.filters button').forEach(function(b){
    b.addEventListener('click',function(){
      d.querySelectorAll('.filters button').forEach(function(x){x.classList.remove('on')});
      b.classList.add('on'); var f=b.dataset.f;
      d.querySelectorAll('.gallery a').forEach(function(a){a.classList.toggle('hide', f!=='all' && (a.dataset.cat||'').indexOf(f)<0)});
    });
  });
  // lightbox
  var lb=d.querySelector('.lightbox');
  if(lb){
    d.querySelectorAll('.gallery a').forEach(function(a){
      a.addEventListener('click',function(e){e.preventDefault();lb.querySelector('img').src=a.getAttribute('href');lb.querySelector('img').alt=a.querySelector('img').alt;lb.querySelector('p').textContent=a.querySelector('span')?a.querySelector('span').textContent:'';lb.classList.add('open');});
    });
    lb.addEventListener('click',function(e){if(e.target.tagName!=='IMG')lb.classList.remove('open')});
    d.addEventListener('keydown',function(e){if(e.key==='Escape')lb.classList.remove('open')});
  }
  // form: sends to FormSubmit, which emails info@rsfarmvenue.com
  var FORM_ENDPOINT='https://formsubmit.co/ajax/info@rsfarmvenue.com';
  var f=d.getElementById('inquiry');
  if(f){
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var err=d.getElementById('form-error'); if(err)err.style.display='none';
      var req=['name','email','phone','type'],bad=null;
      req.forEach(function(k){var el=f.querySelector('[name='+k+']');if(!bad&&el&&!String(el.value).trim())bad=el;});
      if(!bad&&!f.querySelector('[name=guests]:checked'))bad=f.querySelector('[name=guests]');
      var em=f.querySelector('[name=email]');
      if(!bad&&em&&!/^\S+@\S+\.\S+$/.test(em.value))bad=em;
      if(bad){bad.focus();if(err){err.textContent='Please fill in the required fields (marked *).';err.style.display='block';}return;}
      var fd=new FormData(f),data={};
      fd.forEach(function(v,k){data[k]=v;});
      data.flexible=f.querySelector('[name=flexible]').checked?'Yes':'No';
      data.tour=f.querySelector('[name=tour]').checked?'Yes, wants a free tour':'No';
      data._subject='Check Your Date: '+(data.type||'Inquiry')+' – '+(data.name||'');
      data._replyto=data.email; data._template='table';
      var btn=f.querySelector('button[type=submit]'); if(btn)btn.disabled=true;
      fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(data)})
      .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)==='false')throw new Error(j.message||'send failed');});})
      .then(function(){
        var n=(data.name||'').split(' ')[0];
        d.getElementById('thanks-name').textContent=n?(', '+n):'';
        f.style.display='none'; d.querySelector('.thanks').classList.add('show');
        window.scrollTo({top:d.querySelector('.form-card').offsetTop-120,behavior:'smooth'});
      })
      .catch(function(){if(btn)btn.disabled=false;if(err){err.innerHTML='Sorry, that didn&rsquo;t go through. Please call or text 336-270-9860 or email <a href="mailto:info@rsfarmvenue.com">info@rsfarmvenue.com</a>.';err.style.display='block';}});
    });
    var t=d.getElementById('tour'); var tb=d.getElementById('tour-block');
    if(t&&tb){t.addEventListener('change',function(){tb.style.display=t.checked?'block':'none'})}
  }
  d.querySelectorAll('.slots span').forEach(function(s){s.addEventListener('click',function(){d.querySelectorAll('.slots span').forEach(function(x){x.classList.remove('on')});s.classList.add('on')})});
  if(location.hash==='#tour'){var tt=d.getElementById('tour');if(tt){tt.checked=true;tt.dispatchEvent(new Event('change'));}}
})();
document.querySelectorAll('[data-tour]').forEach(function(a){a.addEventListener('click',function(){var t=document.getElementById('tour');if(t){t.checked=true;t.dispatchEvent(new Event('change'));}})});
