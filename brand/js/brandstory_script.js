// a 태그 기본동작 막기
$(document).on('click', 'a[href="#"]', function(e){
  e.preventDefault();
});

// header footer
window.addEventListener('load', () => {
  // 1. 헤더 로직
  const header = document.querySelector('header');
  let lastY = 0;
  window.addEventListener('scroll', () => {
      const currY = window.scrollY;
      if (currY <= 50) header.classList.remove('hide');
      else if (currY > lastY) header.classList.add('hide');
      else header.classList.remove('hide');
      lastY = currY;
  }, { passive: true });

  // 2. 푸터 로직
  const footerH3 = document.querySelector('footer .top h3');
  if (footerH3) {
      gsap.fromTo(footerH3, 
          { webkitClipPath: "inset(0% 100% 0% 0%)", 
          clipPath: "inset(0% 100% 0% 0%)" },
          { 
              clipPath: "inset(0% 0% 0% 0%)", 
              webkitClipPath: "inset(0% 0% 0% 0%)",
              duration: 0.8,
              scrollTrigger: {
                  trigger: "footer",
                  start: "top 80%",
              }
          }
      );
  }})
  
  // 마지막에 딱 한 번만 실행
  ScrollTrigger.refresh();

$(function() {
  // scrolla
  $('.animate').scrolla({
    mobile: true,
    once: false
  });

  // Splitting
  Splitting();

  // GSAP
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

  // ===============================
  // 메뉴 오픈 / 닫기
  // ===============================
  $('.menuOpen button').on('click', function(){
    $('.menuOpen .menuWrap').addClass('on');
  });
  $('.menuOpen .menuWrap .close').on('click', function(){
    $('.menuOpen .menuWrap').removeClass('on');
  });

  // ===============================
  // 헤더 고정 + 스크롤 방향에 따라 숨김/등장
  // ===============================
  (function () {
    const header = document.querySelector('header');
    if (!header) return;

    let lastScrollY = window.scrollY;
    const scrollTolerance = 5;
    let ticking = false;

    function updateHeader() {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        header.classList.remove('fixed-state', 'header-hidden');
      } else {
        header.classList.add('fixed-state');

        if (currentScrollY > lastScrollY + scrollTolerance) {
          header.classList.add('header-hidden');
        } else if (currentScrollY < lastScrollY - scrollTolerance) {
          header.classList.remove('header-hidden');
        }
      }

      lastScrollY = currentScrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(updateHeader);
        ticking = true;
      }
    });
  })();

  

  // ======================================================
  // middle_re 위치 계산 함수 ✅ (그대로 유지)
  // ======================================================
  function positionMiddleRe(widthRatio) {
    const visualInner = document.querySelector('.visual .visual-inner');
    const leftPar     = document.querySelector('.visual .left_par');
    const rightPar    = document.querySelector('.visual .right_par');
    const middleRe    = document.querySelector('.visual .middle_re');

    if (!visualInner || !leftPar || !rightPar || !middleRe) return;

    const vBox = visualInner.getBoundingClientRect();
    const lBox = leftPar.getBoundingClientRect();
    const rBox = rightPar.getBoundingClientRect();

    const left      = lBox.right - vBox.left;
    const right     = rBox.left  - vBox.left;
    const fullWidth = right - left;

    const ratio       = (typeof widthRatio === 'number') ? widthRatio : 0.25;
    const middleWidth = fullWidth * ratio;
    const centerX     = left + fullWidth / 2;

    gsap.set(middleRe, {
      position: 'absolute',
      left: centerX,
      top: '50%',
      width: middleWidth,
      xPercent: -50,
      transformOrigin: '50% 50%'
    });
  }

  // ======================================================
  // VISUAL (반응형 옵션별 생성) ✅ middle_re 로직 건드리지 않음
  // ======================================================
  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      return buildVisual({
        endPin: 2500,
        endFrame: 2000,
        frames: Array.from({length:18}, (_,i)=>`img/brandstory/visual_${i+1}.png`),
        natuScale: 2,
        cipeScale: 1.6,
        cipeMarginTop: '14%',
        visualInner : { gap : '0%' },
        middleReRatio: 0.7
      });
    },

    "(min-width: 769px) and (max-width: 1024px)": function () {
      return buildVisual({
        endPin: 2000,
        endFrame: 2000,
        frames: Array.from({length:18}, (_,i)=>`img/brandstory/visual_${i+1}.png`),
        natuScale: 2.5,
        cipeScale: 2.1,
        cipeMarginTop: '17%',
        visualInner : { gap : '0%' },
        middleReRatio: 0.7
      });
    },

    "(min-width: 391px) and (max-width: 768px)": function () {
      return buildVisual({
        endPin: 2000,
        endFrame: 2000,
        frames: Array.from({length:18}, (_,i)=>`img/brandstory/visual_${i+1}_768.png`),
        natuScale: 2.5,
        cipeScale: 2.1,
        cipeMarginTop: '17%',
        visualInner : { gap : '0%' },
        middleReRatio: 0.8
      });
    },

    "(max-width: 390px)": function () {
      return buildVisual({
        endPin: 2000,
        endFrame: 2000,
        frames: Array.from({length:18}, (_,i)=>`img/brandstory/visual_${i+1}_390.png`),
        natuScale: 3.8,
        cipeScale: 3.4,
        cipeMarginTop: '28%',
        visualInner : { gap : '2.8%' },
        middleReRatio: 0.7
      });
    }
  });

  // ======================================================
  // VISUAL 타임라인 생성 함수 ✅ (그대로 유지)
  // ======================================================
  function buildVisual(opt) {
    const middleImg = document.getElementById('changeImg');
    if (!middleImg) return;

    const frames = opt.frames;
    const frameCount = frames.length;

    // 기존 visual ST 제거
    ScrollTrigger.getAll().forEach(st => {
      if (st.vars && st.vars.trigger === ".visual") st.kill();
    });

    // 초기 이미지
    middleImg.setAttribute('src', frames[0]);

    const visualInner = document.querySelector('.visual .visual-inner');
    let initialGap;

    if (opt.visualInner && ('gap' in opt.visualInner)) {
      initialGap = opt.visualInner.gap;
    } else {
      initialGap = visualInner ? getComputedStyle(visualInner).gap || '0%' : '0%';
    }

    gsap.set(visualInner, { gap: initialGap });

    const ratio = (typeof opt.middleReRatio === 'number') ? opt.middleReRatio : 0.25;

    // 시작 위치 한번 보정
    positionMiddleRe(ratio);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.visual',
        start: 'top top',
        end: '+=' + opt.endPin,
        scrub: true,
        pin: '.visual-scroll',
        pinSpacing: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: () => { positionMiddleRe(ratio); },
        onUpdate:  () => { positionMiddleRe(ratio); }
      }
    });

    tl.fromTo('.visual .middle img',
      { scale: 1, transformOrigin: '50% 50%' },
      { scale: 1, duration: 0.3, ease: 'none' },
      0
    );

    tl.fromTo('.visual .natu',
      { x: '-40vw', opacity: 0, scale: 1 },
      { x: '0vw', opacity: 1, scale: opt.natuScale, duration: 0.7, ease: 'none' },
      0.3
    );

    tl.fromTo('.visual .cipe',
      { x: '40vw', opacity: 0, scale: 1 },
      { x: '0vw', opacity: 1, scale: opt.cipeScale, marginTop: opt.cipeMarginTop, duration: 0.7, ease: 'none' },
      0.3
    );

    tl.fromTo('.visual .visual-inner .left_par',
      { scale: 1, width: '100%', xPercent: -85 },
      { scale: 0.5, width: '50%', xPercent: -5, duration: 0.7, ease: 'none' },
      0.3
    );

    tl.fromTo('.visual .visual-inner .right_par',
      { scale: 1, width: '100%', xPercent: 65 },
      { scale: 0.5, width: '50%', xPercent: 10, duration: 0.7, ease: 'none' },
      0.3
    );

    tl.fromTo('.visual .visual-inner',
      { scale: 1 },
      { scale: 1, gap: initialGap, duration: 0.7, ease: 'none' },
      0.3
    );

    tl.fromTo('.visual .middle',
      { width: '62%' },
      { width: '0%', duration: 0.7, ease: 'none' },
      0.3
    );

    tl.to('.visual .middle', { opacity: 0, duration: 0.01 }, 0.9);

    tl.fromTo('.visual .middle_re',
      { yPercent: 100, opacity: 0 },
      { yPercent: -50, opacity: 1, duration: 0.6, ease: 'power2.out', zIndex: 100 },
      1
    );

    tl.fromTo('.visual .visual-inner .left',
      { scale: 1.2, transformOrigin: '50% 50%' },
      { scale: 0.7, marginLeft: '150px', duration: 0.7, ease: 'none' },
      0.3
    );

    tl.fromTo('.visual .visual-inner .right',
      { scale: 1.2, transformOrigin: '50% 50%' },
      { scale: 0.7, marginRight: '150px', duration: 0.7, ease: 'none' },
      0.3
    );

    const frameST = ScrollTrigger.create({
      trigger: '.visual',
      start: 'top top',
      end: '+=' + opt.endFrame,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const idx = Math.min(frameCount - 1, Math.max(0, Math.round(self.progress * (frameCount - 1))));
        const src = frames[idx];
        if (middleImg.getAttribute('src') !== src) {
          middleImg.setAttribute('src', src);
        }
      }
    });

    return () => {
      frameST.kill();
      tl.scrollTrigger.kill();
      tl.kill();
    };
  }

  // ======================================================
  // CHANGE TURN IMAGE ✅ (refresh는 여기서 절대 안 함)
  // ======================================================
  function changeTurnImage() {
    var winW = $(window).width();

    if (winW <= 1024) {
      $('.bombee .bombee-inner .veo video').attr('src', 'img/bombee_1024.mp4');
      $('.our-inner .txt-box .top p').html(
        '우리가 지키는 것은 피부 한 겹이 아닙니다.<br>자연이 다시 호흡할 수 있는 균형, 그리고 다음 세대를 위한 환경입니다.<br>파파레서피는 자연에서 얻은 것을 다시 자연으로 돌려주는<br>순환의 가치를 추구하며,재활용 가능한 패키지와 책임 있는<br>원료 채집, 친환경 공정을 꾸준히 실천합니다.<br>이 모든 노력이 결국, 오래도록 남아야 할 품질과 가치를 완성합니다.'
      );
    } else {
      $('.bombee .bombee-inner .veo video').attr('src', 'img/bombee_1920.mp4');
      $('.our-inner .txt-box .top p').html(
        '우리가 지키는 것은 피부 한 겹이 아닙니다.<br>자연이 다시 호흡할 수 있는 귑형, 그리고 다음 세대를 위한 환경입니다.<br>파파레서피는 자연에서 얻은 것을 다시 자연으로 돌려주는 순환의 가치를 추구하며,<br>재활용 가능한 패키지와 책임 있는 원료 채집, 친환경 공정을 꾸준히 실천합니다.<br>이 모든 노력이 결국, 오래도록 남아야 할 품질과 가치를 완성합니다.'
      );
    }

    if (winW <= 768) {
      $('.bombee .bombee-inner .veo video').attr('src', 'img/bombee_768.mp4');
      $('.visual .middle img').attr('src', 'img/brandstory/visual_1_768.png');
    } else {
      $('.visual .middle img').attr('src', 'img/brandstory/visual_1.png');
    }

    if (winW <= 390) {
      $('.history-inner ul li.y2022 .img a.left img').attr('src', 'img/history_2022_2.png');
      $('.history-inner ul li.y2022 .img a.right img').attr('src', 'img/history_2022_1.png');
      $('.bombee .bombee-inner .veo video').attr('src', 'img/bombee_390.mp4');
      $('.visual .middle img').attr('src', 'img/brandstory/visual_1_390.png');

      $('.introduce.first .txt').html(
        '<span class="fff">Natu(re)cipe</span>는 자연이 가진 본래의 흐름을 다시<span class="fff">(re)</span><br>' +
        '되돌려, 가장 순수한 레시피를 지향합니다.<br>' +
        '자연 유래 원료와 회복의 뜻을 더해<br>' +
        '부담 없이 피부에 흡수되는 정직한 공식을 만듭니다.<br>' +
        '그 결과 피부는 스스로 회복하는 힘을 되찾아<br>' +
        '자연스러운 상태로 돌아갑니다.'
      );

      $('.our-inner .txt-box .top .txt').html(
        '우리가 지키는 것은 피부 한 겹이 아닙니다.<br>자연이 다시 호흡할 수 있는 균형, 그리고 다음 세대를 위한 환경입니다.<br>파파레서피는 자연에서 얻은 것을 다시 자연으로.<br>돌려주는 순환의 가치를 추구하며, 재활용 가능한 패키지와 책임 있는 원료 채집, 친환경 공정을 꾸준히 실천합니다.<br>이 모든 노력이 결국, 오래도록 남아야 할 품질과 가치를 완성합니다.'
      );

      $('.our-inner .txt-box .bottom .txt').html(
        '오늘의 작은 선택이 쌓여 더 큰 변화를 만듭니다.<br>우리의 방식은 느리고 조용하지만,<br>가장 확실한 길을 믿습니다.<br>파파레서피는 그 믿음을<br>지구와 피부 모두를 위한 실천으로 이어갑니다.'
      );
    } else {
      $('.history-inner ul li.y2022 .img a.left img').attr('src', 'img/history_2022_1.png');
      $('.history-inner ul li.y2022 .img a.right img').attr('src', 'img/history_2022_2.png');

      $('.introduce.first .txt').html(
        '<span class="fff">Natu(re)cipe</span>는 자연이 가진 본래의 흐름을 다시<span class="fff">(re)</span> 되돌려, 가장 순수한 레시피를 지향합니다.<br>' +
        '자연 유래 원료와 회복의 뜻을 더해 부담 없이 피부에 흡수되는 정직한 공식을 만듭니다.<br>' +
        '그 결과 피부는 스스로 회복하는 힘을 되찾아 자연스러운 상태로 돌아갑니다.'
      );

      $('.our-inner .txt-box .bottom .txt').html(
        '오늘의 작은 선택이 쌓여 더 큰 변화를 만듭니다.<br>우리의 방식은 느리고 조용하지만, 가장 확실한 길을 믿습니다.<br>파파레서피는 그 믿음을 지구와 피부 모두를 위한 실천으로 이어갑니다.'
      );
    }
  }

  changeTurnImage();
  $(window).on('resize', function() {
    changeTurnImage(); // ✅ refresh는 공통 resize fix가 처리
  });

});


// ===============================
// HISTORY ✅ 전체 복붙용 (원본 유지)
// ===============================
$(function () {
  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".history");
  const inner   = document.querySelector(".history .history-inner");
  const list    = document.querySelector(".history .history-list");
  const line    = document.querySelector(".history .line");

  if (!section || !inner || !list) return;

  let resizeTimer = null;

  function getXRelativeToList(el) {
    if (!el) return 0;
    let x = el.offsetLeft;
    let p = el.offsetParent;
    while (p && p !== list) {
      x += p.offsetLeft;
      p = p.offsetParent;
    }
    if (p !== list) {
      const firstLi = list.querySelector("li");
      if (firstLi) x += firstLi.offsetLeft;
    }
    return x;
  }

  function syncLine() {
    if (!line) return;

    const startEl = list.querySelector(".y2025 .txt-box a.circle");
    const endEl =
      list.querySelector("li:last-child .img a:last-child img") ||
      list.querySelector("li:last-child .img img:last-child");

    if (!startEl || !endEl) return;

    const startX = getXRelativeToList(startEl) + (startEl.offsetWidth / 2);
    const endX   = getXRelativeToList(endEl) + endEl.offsetWidth;

    const listLeftInInner = list.offsetLeft;
    const left  = Math.max(0, startX + listLeftInInner);
    const width = Math.max(0, endX - startX);

    line.style.left  = left + "px";
    line.style.width = width + "px";
  }

  function killHistory() {
    ScrollTrigger.getById("history-horizontal")?.kill(true);

    gsap.killTweensOf([list, line]);
    gsap.set([list, line], { clearProps: "transform" });

    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars && st.vars.containerAnimation) st.kill(true);
    });

    gsap.set(list.querySelectorAll(".img a img"), { clearProps: "filter" });
  }

  function initHorizontal() {
    killHistory();

    const getDistance = () => Math.max(0, list.scrollWidth - window.innerWidth);

    syncLine();

    const mainTween = gsap.to([list, line], {
      x: () => -getDistance(),
      ease: "none",
      scrollTrigger: {
        id: "history-horizontal",
        trigger: section,
        start: "top top",
        end: () => "+=" + getDistance(),
        pin: true,
        scrub: 0.4,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onRefresh: () => requestAnimationFrame(syncLine),
      }
    });

    list.querySelectorAll(".img a img").forEach((img) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: img,
          containerAnimation: mainTween,
          start: "left 80%",
          end: "right 20%",
          scrub: true
        }
      })
      .to(img, { filter: "brightness(1.1)", duration: 0.5 })
      .to(img, { filter: "brightness(0.2)", duration: 0.5 });
    });

    requestAnimationFrame(syncLine);

    return () => {
      mainTween.scrollTrigger?.kill(true);
      mainTween.kill();
      killHistory();
    };
  }

  ScrollTrigger.matchMedia({
    "(min-width: 769px)": function () { return initHorizontal(); },
    "(max-width: 768px)": function () { killHistory(); return () => killHistory(); }
  });

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // 여기서 refresh는 공통 resize fix가 해도 되지만,
      // line 위치 즉시 보정이 필요해서 sync만 가볍게 호출
      requestAnimationFrame(syncLine);
    }, 150);
  });
});


// ===============================
// 배경색 타임라인 (기존 유지, refresh 제거)
// ===============================
window.addEventListener('load', () => {
  gsap.registerPlugin(ScrollTrigger);

  ScrollTrigger.matchMedia({
    "(min-width: 1025px)": function () {
      const tl1 = gsap.timeline({
        scrollTrigger: { trigger: '.bombee', start: 'top 100%', end: '50% bottom', scrub: 1 }
      }).to('.introduce.first', { backgroundColor: '#D8C2B6', ease: 'none' }, 0);

      const tl2 = gsap.timeline({
        scrollTrigger: { trigger: '.story', start: 'top 50%', end: '0% 100%', scrub: 1 }
      }).to('.bombee', { backgroundColor: '#F0E5E0', ease: 'none' }, 0);

      const tl3 = gsap.timeline({
        scrollTrigger: { trigger: '.ingredient', start: 'top 60%', end: '0% 100%', scrub: 1 }
      })
      .to('.story', { backgroundColor: '#1A1817', ease: 'none' }, 0)
      .to('.story', { '--story-after-bg': 'transparent', ease: 'none' }, 0);

      const tl4 = gsap.timeline({
        scrollTrigger: { trigger: '.our', start: 'top 50%', end: '0% 100%', scrub: 1 }
      }).to('.history', { backgroundColor: '#F0E5E0', ease: 'none' }, 0);

      return () => { tl1.kill(); tl2.kill(); tl3.kill(); tl4.kill(); };
    },

    "(max-width: 1024px)": function () {
      gsap.set('.introduce.first', { clearProps: "backgroundColor" });
      gsap.set('.bombee', { clearProps: "backgroundColor" });

      ScrollTrigger.getAll().forEach(st => {
        const trg = st.vars && st.vars.trigger;
        if (trg === '.bombee' || trg === '.story' || trg === '.ingredient' || trg === '.our') st.kill();
      });
    }
  });
}, { once: true });


// ===============================
// ✅ GSAP / ScrollTrigger Resize Fix (안정 버전 1개만)
// ===============================
$(function () {
  if (!window.gsap || !window.ScrollTrigger) return;

  gsap.registerPlugin(ScrollTrigger);

  let t = null;
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;

  function safeRefresh() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const dw = Math.abs(w - lastW);
    const dh = Math.abs(h - lastH);

    if (dw < 2 && dh < 2) return;

    lastW = w; lastH = h;

    requestAnimationFrame(() => {
      ScrollTrigger.refresh(true);
    });
  }

  function debounceRefresh(delay) {
    clearTimeout(t);
    t = setTimeout(safeRefresh, delay);
  }

  window.addEventListener("resize", () => debounceRefresh(200), { passive: true });
  window.addEventListener("orientationchange", () => debounceRefresh(350), { passive: true });

  window.addEventListener("load", () => debounceRefresh(0), { once: true });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => debounceRefresh(0));
  }
});
