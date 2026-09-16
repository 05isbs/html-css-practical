  // Hero slide rotation (自動切替 + 左右矢印 + ドットで手動切替)
  (function(){
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dots button');
    var prevBtn = document.querySelector('.hero-arrow-prev');
    var nextBtn = document.querySelector('.hero-arrow-next');
    var total = slides.length;
    var i = 0;
    var timer = null;
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function show(n){
      i = (n + total) % total;
      slides.forEach(function(s,idx){ s.classList.toggle('is-active', idx===i); });
      dots.forEach(function(d,idx){ d.classList.toggle('is-active', idx===i); });
    }
    function stopAuto(){
      if (timer){ clearInterval(timer); timer = null; }
    }
    function startAuto(){
      if (reduceMotion) return;
      stopAuto();
      timer = setInterval(function(){ show(i + 1); }, 5000);
    }
    function manualShow(n){
      show(n);
      startAuto(); // 手動操作後はタイマーをリセットして再開
    }

    dots.forEach(function(d, idx){ d.addEventListener('click', function(){ manualShow(idx); }); });
    if (prevBtn) prevBtn.addEventListener('click', function(){ manualShow(i - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function(){ manualShow(i + 1); });

    startAuto();
  })();

  // ハンバーガーメニュー（タブレット：オフキャンバス／スマホ：フルスクリーン）
  (function(){
    var toggle = document.getElementById('btn08');
    var menu = document.getElementById('mobile-menu');
    var backdrop = document.getElementById('menuBackdrop');
    var closeBtn = menu ? menu.querySelector('.menu-close') : null;
    if (!toggle || !menu) return;
    function setOpen(open){
      toggle.classList.toggle('active', open);
      toggle.setAttribute('aria-expanded', String(open));
      menu.classList.toggle('is-open', open);
      menu.setAttribute('aria-hidden', String(!open));
      if (backdrop) backdrop.classList.toggle('is-open', open);
      document.body.classList.toggle('menu-open', open);
    }
    toggle.addEventListener('click', function(){
      setOpen(!toggle.classList.contains('active'));
    });
    if (closeBtn) closeBtn.addEventListener('click', function(){ setOpen(false); });
    if (backdrop) backdrop.addEventListener('click', function(){ setOpen(false); });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){ setOpen(false); });
    });
    window.addEventListener('resize', function(){
      if (window.innerWidth > 1279) setOpen(false);
    });
  })();

  // FAQ accordion
  (function(){
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function(item){
      var btn = item.querySelector('.faq-q');
      var panel = item.querySelector('.faq-a');
      function setHeight(open){
        panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
      }
      setHeight(item.classList.contains('is-open'));
      btn.addEventListener('click', function(){
        var willOpen = !item.classList.contains('is-open');
        item.classList.toggle('is-open', willOpen);
        btn.setAttribute('aria-expanded', String(willOpen));
        setHeight(willOpen);
      });
      window.addEventListener('resize', function(){
        if (item.classList.contains('is-open')) setHeight(true);
      });
    });
  })();
