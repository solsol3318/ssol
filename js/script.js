$(document).on('click', 'a[href="#"]', function(e){
    e.preventDefault();
});

// 라이브러리 초기화
$(function() {
    $('.animate').scrolla({ mobile: true, once: false });
    if (typeof Splitting === "function") Splitting(); 
});

$(function(){
    $('.menuOpen button').on('click', function(){ $('.menuOpen .menuWrap').addClass('on'); });
    $('.menuOpen .menuWrap .close').on('click',function(){ $('.menuOpen .menuWrap').removeClass('on'); });
});

document.addEventListener('DOMContentLoaded', function() {
    gsap.registerPlugin(ScrollTrigger);

    // --- 로고 모션 & 비주얼 고정 ---
    const header = document.querySelector('header');
    const visual = document.querySelector('.visual');
    const visualLogo = document.querySelector('.visual a.logo');
    const headerLogoContainer = document.querySelector('header .logo');
    
    if (visual && visualLogo && headerLogoContainer) {
        ScrollTrigger.create({
            trigger: visual, start: "top top", pin: true, end: "+=1000", scrub: true
        });

        const lerp = (s, e, p) => s + (e - s) * p;
        const calcPos = () => {
            headerLogoContainer.style.opacity = '1';
            const rect = headerLogoContainer.getBoundingClientRect();
            headerLogoContainer.style.opacity = '0';
            return {
                initX: window.innerWidth / 2, initY: window.innerHeight / 2, initW: visualLogo.offsetWidth,
                targetX: rect.left + (rect.width / 2), targetY: rect.top + (rect.height / 2), targetW: rect.width
            };
        };

        let pos = calcPos();
        window.addEventListener('resize', () => { pos = calcPos(); });

        let lastY = 0;
        window.addEventListener('scroll', () => {
            const currY = window.scrollY;
            let prog = Math.min(1, Math.max(0, currY / 1000));
            if (prog < 1) {
                const curW = lerp(pos.initW, pos.targetW, prog);
                visualLogo.style.cssText = `position:fixed; opacity:1; width:${curW}px; left:${lerp(pos.initX, pos.targetX, prog)-(curW/2)}px; top:${lerp(pos.initY, pos.targetY, prog)-(visualLogo.offsetHeight/2)}px; transform:none; z-index:9999;`;
                headerLogoContainer.style.opacity = '0';
                header.classList.remove('fixed-state');
            } else {
                header.classList.add('fixed-state');
                visualLogo.style.opacity = '0';
                headerLogoContainer.style.opacity = '1';
            }
            if (currY > lastY && currY > 1100) header.classList.add('hide');
            else header.classList.remove('hide');
            lastY = currY;
        });
    }

    // --- Visual Gradient & Bottom Image ---
    gsap.timeline({
        scrollTrigger: { trigger: ".visual", start: "top top", end: "+=1000", scrub: true }
    })
    .to(".visual .grad", { y: -500, ease: "none" }, 0)
    .fromTo(".visual .img-bottom", { y: 100, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out" }, 0.2);

    // --- Intro 텍스트 애니메이션 ---
    function splitText(sel) {
        const el = document.querySelector(sel);
        if(!el) return;
        const nodes = Array.from(el.childNodes);
        el.innerHTML = ""; 
        nodes.forEach(n => {
            if (n.nodeType === 3) { 
                [...n.textContent].forEach(c => { const s = document.createElement("span"); s.innerText = c === " " ? "\u00A0" : c; el.appendChild(s); });
            } else if (n.nodeType === 1) {
                const w = document.createElement("span"); w.className = n.className;
                [...n.textContent].forEach(c => { const s = document.createElement("span"); s.innerText = c === " " ? "\u00A0" : c; w.appendChild(s); });
                el.appendChild(w);
            }
        });
    }
    splitText(".tit"); splitText(".txt");
    gsap.to(".tit span", { opacity: 1, color: "#fff", stagger: 0.05, scrollTrigger: { trigger: ".intro", start: "top 60%", end: "top 20%", scrub: 1 } });
    gsap.to(".txt span", { opacity: 1, color: "#eaeaea", stagger: 0.02, scrollTrigger: { trigger: ".intro", start: "top 40%", end: "top 0%", scrub: 1 } });

    

// --- Product 스크롤 수정본 ---
// --- Product 스크롤 수정본 ---
const productSec = document.querySelector('.scroll-item');
if (productSec) {
    const items = gsap.utils.toArray('.product-list li');
    const titles = gsap.utils.toArray('.product-title');
    const mainImgs = gsap.utils.toArray('.img-wrap img');

    // 초기 세팅
    gsap.set(titles, { opacity: 0 }); 
    gsap.set(titles[0], { opacity: 1 });
    gsap.set(mainImgs, { opacity: 0 }); 
    gsap.set(mainImgs[0], { opacity: 1 });

    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: productSec,
            start: "top top",
            end: window.innerWidth <= 768 ? "+=1500" : "+=12000", 
            pin: true,          
            scrub: 1.5,     
            invalidateOnRefresh: true,
            onEnter: () => {
                if(window.innerWidth > 768) gsap.to('body', { backgroundColor: '#1A1A1E', duration: 0.5 });
            },
            onLeaveBack: () => {
                if(window.innerWidth > 768) gsap.to('body', { backgroundColor: '#fff', duration: 0.5 }); // 배경색 복구
            }
        }
    });

    items.forEach((item, i) => {
        gsap.set(item, { xPercent: -50, yPercent: -50, top: "50%", left: "50%", position: "absolute" });

        // 인덱스 계산 (타이틀은 6개당 1개, 이미지는 3개당 1개라고 가정하신 로직 유지)
        let aT = Math.floor(i / 6);
        let aI = Math.floor(i / 3);

        tl.fromTo(item, 
            { autoAlpha: 0, y: window.innerWidth <= 768 ? 150 : 500, scale: 0.8 },
            { 
                autoAlpha: 1, y: 0, duration: 2, scale: 1.1, ease: "none",
                // 역재생 시에도 감지하기 위해 onUpdate 또는 적절한 시점에 실행
                onStart: () => {
                    // 앞으로 갈 때 변경
                    updateMedia(aT, aI);
                },
                onReverseComplete: () => {
                    // 뒤로 갈 때(역재생) 이전 아이템의 미디어로 복구
                    if (i > 0) {
                        let prevAT = Math.floor((i - 1) / 6);
                        let prevAI = Math.floor((i - 1) / 3);
                        updateMedia(prevAT, prevAI);
                    }
                }
            }, 
            i === 0 ? 0 : ">-1.5" 
        )
        .to(item, { duration: 1 }, ">") 
        .to(item, { 
            autoAlpha: 0, 
            y: window.innerWidth <= 768 ? -150 : -500, 
            scale: 0.8, 
            duration: 1.5, 
            ease: "none" 
        }, ">-0.5");
    });

    // 미디어 업데이트 함수 분리
    function updateMedia(titleIdx, imgIdx) {
        titles.forEach((t, idx) => {
            gsap.to(t, { opacity: idx === titleIdx ? 1 : 0, duration: 0.3, overwrite: true });
        });
        mainImgs.forEach((m, idx) => {
            gsap.to(m, { opacity: idx === imgIdx ? 1 : 0, duration: 0.3, overwrite: true });
        });
    }
}

    // --- Skin Concern: 텍스트 단어별 등장 + 이미지 애니메이션 ---

const splitWordsForSkin = (selector) => {
    const targets = document.querySelectorAll(selector);
    targets.forEach(target => {
        const text = target.innerText;
        target.innerHTML = '';
        

        text.split(' ').forEach(word => {
            const span = document.createElement('span');
            span.classList.add('word');
            span.innerText = word;
            target.appendChild(span);

            target.appendChild(document.createTextNode(' '));
        });
    });
};

// 분리 실행 (span.label과 h3를 대상으로 함)
splitWordsForSkin('.skin-concern .left .label, .skin-concern .left h3');

// 단어들이 한 줄씩/한 단어씩 서서히 보이는 애니메이션
gsap.utils.toArray('.skin-concern .left').forEach((container) => {
    const words = container.querySelectorAll('.word');
    
    gsap.to(words, {
        opacity: 1,
        y: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: container,
            start: "top 85%",
            toggleActions: "play none none reverse"
        }
    });
});

// --- Skin Concern: 이미지 차오르는 등장 + 둥둥 애니메이션  ---
gsap.utils.toArray('.skin-concern .imgAni').forEach((box, i) => {
    gsap.fromTo(box, 
        { 
            clipPath: "inset(100% 0 0 0)",   
            webkitClipPath: "inset(100% 0 0 0)",
            y: 50                               
        }, 
        { 
            clipPath: "inset(0% 0 0 0)",      
            webkitClipPath: "inset(0% 0 0 0)",
            y: 0,
            duration: 1.5,
            ease: "power2.inOut",            
            scrollTrigger: {
                trigger: box,
                start: "top 90%",          
                toggleActions: "restart none none reverse"
            }
        }
    );
    // 무한 둥둥 애니메이션
    gsap.to(box, {
        y: i % 2 === 0 ? -20 : 20,
        duration: 2.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: 0.8 
    });
});

    // --- Day6 & Model & Theraphy ---
    ['.day6 .imgAni', '.model .imgAni'].forEach(sel => {
        gsap.utils.toArray(sel).forEach(c => {
            const img = c.querySelector('img');
            if (img) gsap.to(img, { yPercent: -20, scrub: 1, scrollTrigger: { trigger: c, start: "top bottom", end: "bottom top", scrub: 1 } });
        });
    });

    const marqueeList = document.querySelector('.marquee-content');
    if (marqueeList) {
        marqueeList.innerHTML += marqueeList.innerHTML;
        gsap.to(marqueeList, { x: -(marqueeList.offsetWidth/2), duration: 30, ease: "none", repeat: -1 });
        gsap.utils.toArray('.theraphy .imgAni2').forEach((box, i) => {
            gsap.to(box, { y: i % 2 === 0 ? -30 : 30, duration: 2, repeat: -1, yoyo: true, ease: "sine.inOut" });
        });
        gsap.utils.toArray('.theraphy .imgAni2 img').forEach(img => {
            gsap.set(img, { filter: 'brightness(60%)' });
            img.addEventListener('mouseenter', () => gsap.to(img, { filter: 'brightness(100%)', duration: 0.5 }));
            img.addEventListener('mouseleave', () => gsap.to(img, { filter: 'brightness(60%)', duration: 0.5 }));
        });
    }

// --- 배경색 & 커서 ---

let mm = gsap.matchMedia();

mm.add("(min-width: 769px)", () => {
    const bgMap = [
        { t: ".day6", c: "#F0E5E0" }, 
        { t: ".model", c: "#F0E5E0" }, 
        { t: ".skin-concern", c: "#1A1A1E" }
    ];

    bgMap.forEach(m => {
        if(document.querySelector(m.t)) {
            ScrollTrigger.create({ 
                trigger: m.t, 
                start: "top 50%", 
                onEnter: () => gsap.to('body', { backgroundColor: m.c, duration: 0.8 }), 
                onEnterBack: () => gsap.to('body', { backgroundColor: m.c, duration: 0.8 }) 
            });
        }
    });

    return () => gsap.set('body', { backgroundColor: "" });
});


const cursorImg = document.querySelector('.cursor-texture');
if (cursorImg) {
    window.addEventListener('mousemove', (e) => gsap.to(cursorImg, { x: e.clientX-50, y: e.clientY-50, duration: 0.5 }));
    document.querySelector('.skin-concern')?.addEventListener('mouseenter', () => gsap.to(cursorImg, { autoAlpha: 0.8, scale: 1 }));
    document.querySelector('.skin-concern')?.addEventListener('mouseleave', () => gsap.to(cursorImg, { autoAlpha: 0, scale: 0.5 }));
}

// footer
const footerH3 = document.querySelector('footer .top h3');
const footerTop = document.querySelector('footer .top');

if (footerH3) {
    // 1. 초기 상태 설정
    gsap.set(footerH3, { 
        webkitClipPath: "inset(0 100% 0 0)", 
        clipPath: "inset(0 100% 0 0)" 
    });

    gsap.to(footerH3, {
        clipPath: "inset(0 0% 0 0)",
        webkitClipPath: "inset(0 0% 0 0)",
        duration: 1.2,
        ease: "power2.inOut",
        scrollTrigger: {
            trigger: "footer",
            start: "top 80%", // 뷰포트 80% 지점에 푸터 상단이 보일 때 시작
            end: "bottom top", // 푸터가 완전히 화면을 벗어날 때까지 유지
            toggleActions: "play reverse play reverse", // 내릴 때 재생, 올릴 때 역재생
            onEnter: () => {
                if (footerTop) footerTop.style.backgroundColor = '#F0E5E0';
            },
            onLeaveBack: () => {
                // 다시 위로 올릴 때 배경색을 원래대로 돌리고 싶다면 추가
                if (footerTop) footerTop.style.backgroundColor = ''; 
            }
        }
    });
}

gsap.utils.toArray('.animate').forEach((el) => {
    ScrollTrigger.create({
        trigger: el,
        start: "top 90%",
        onEnter: () => {
            const animationClass = el.getAttribute('data-animate'); 
            el.classList.add(animationClass);
        },
        onLeaveBack: () => el.classList.remove(el.getAttribute('data-animate'))
    });
});

    ScrollTrigger.refresh();
});

