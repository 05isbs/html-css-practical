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

  // スクロール連動フェードイン
  (function(){
    var reveals = document.querySelectorAll('.reveal');
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
      reveals.forEach(function(el){ el.classList.add('is-visible'); });
      return;
    }
    /*
      変更: スクロール表示(.reveal)の発火タイミングの基準を、
      「画面の半分(中央)に差し掛かった時点」から「画面の下から1/3の高さに
      差し掛かった時点」に変更(基準を画面のより低い位置に変更=より早いタイミングで表示開始)。
      ・旧: { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
        (要素が20%弱見えた頃、画面下端から40px内側に入った時点で発火)
      ・中間段階: { threshold: 0, rootMargin: '0px 0px -50% 0px' }
        (判定領域の下端を画面下端からビューポート高さの50%分だけ上に引き上げ、
        画面の縦方向中央を基準にしていた)
      ・新: { threshold: 0, rootMargin: '0px 0px -33.3333% 0px' }
        (rootMarginの下端の引き上げ量を50%→33.3333%(1/3)に縮小。
        これにより判定領域の下端が、画面下端から高さの1/3だけ上=
        画面の下から1/3の高さの位置になる。中央より低い位置が基準になるため、
        要素の上端がその高さを通過した時点=画面の半分より早いタイミングで
        isIntersecting=trueとなり、is-visibleが付与される=表示アニメーションが
        より早く開始するようになる)
      ・コールバック内のロジック(is-visible付与 → unobserveで監視終了)自体は変更なし
    */
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px -33.3333% 0px' });
    // 変更ここまで(スクロール表示の発火タイミング)
    reveals.forEach(function(el){ observer.observe(el); });
  })();

  // ヘッダーのスクロール追従演出
  (function(){
    var header = document.querySelector('header');
    if (!header) return;
    function onScroll(){
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();
