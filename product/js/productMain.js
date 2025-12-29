$(document).on('click', 'a[href="#"]:not(.topBtn)', function(e){
    e.preventDefault();
});


// 모바일 메뉴 open/close
$(function () {
  $('.menuOpen button').on('click', function () {
    $('.menuOpen .menuWrap').addClass('on');
  });

  $('.menuOpen .menuWrap .close').on('click', function (e) {
    e.preventDefault();
    $('.menuOpen .menuWrap').removeClass('on');
  });
});

// 헤더 고정 + 스크롤 다운 시 숨김 / 업 시 표시
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    let lastY = 0;

    window.addEventListener('scroll', () => {
        const currY = window.scrollY;

        // 1. 페이지 맨 위(0~50px 사이)에 있을 때는 무조건 보이게 함
        if (currY <= 50) {
            header.classList.remove('hide');
        } 
        // 2. 아래로 스크롤 시 숨김
        else if (currY > lastY) {
            header.classList.add('hide');
        } 
        // 3. 위로 스크롤 시 나타남
        else {
            header.classList.remove('hide');
        }

        lastY = currY;
    });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // 최초 실행
});


// 베스트셀러 스와이프
// BestSeller 전용
const $bestBar = $('.bestSeller .b_bar');

const bestSwiper = new Swiper('.bestSeller .best-swiper', {
  loop: true,
  slidesPerView: 'auto',
  spaceBetween: 12,
  direction: 'horizontal',
  slidesPerGroup: 1,
  on: {
    init: function () { updateBestBar(this); },
    slideChange: function () { updateBestBar(this); }
  }
});

function updateBestBar(sw) {
  // loop 때문에 복제 슬라이드 제외한 "진짜 개수"
  const total = sw.slides.length - (sw.loopedSlides * 2);

  // realIndex: 0 ~ total-1 (loop에서도 정확)
  const idx = sw.realIndex;

  // 한 칸씩 채우기 (1/total, 2/total ...)
  const step = 100 / total;
  const width = (idx + 1) * step;

  $bestBar.css('width', width + '%');
}

// 베스트 동영상

$(function () {

  const hoverFiles = [
    'best_hover_1.png',
    'best_hover_2.png',
    'best_hover_3.png',
    'best_hover_4.png',
    'best_hover_5.png',
    'best_hover_6.png',
    'best_hover_7.mp4', // 7번째는 동영상
    'best_hover_8.png',
    'best_hover_9.png',
    'best_hover_10.png',
    'best_hover_11.png',
    'best_hover_12.png'
  ];

  // loop 때문에 duplicate 제외
  $('.bestSeller .swiper-slide:not(.swiper-slide-duplicate)').each(function (i) {

    // data-index 추가
    $(this).attr('data-index', i + 1);

    const $imgBox = $(this).find('.img');
    const file = hoverFiles[i];

    if (!file) return;

    // overlay container
    const $overlay = $('<div class="hoverMedia"></div>');

    if (file.endsWith('.mp4')) {
      const video = $(`
        <video class="hoverVideo" muted loop playsinline preload="metadata">
            <source src="img/productMain/${file}" type="video/mp4">
        </video>
      `);
      $overlay.append(video);
    } else {
      const img = $(`<img class="hoverImg" src="img/productMain/${file}">`);
      $overlay.append(img);
    }

    $imgBox.append($overlay);
  });


  /** mp4만 hover 재생 */
  $('.bestSeller .swiper-slide').on('mouseenter focusin', function () {
    const v = $(this).find('video.hoverVideo').get(0);
    if (!v) return;
    v.currentTime = 0;
    const p = v.play();
    if (p) p.catch(()=>{});
  });

  $('.bestSeller .swiper-slide').on('mouseleave focusout', function () {
    const v = $(this).find('video.hoverVideo').get(0);
    if (!v) return;
    v.pause();
  });

});









// 신제품 슬라이드

const $bar = $('.NewArrival .b_bar');
const total = 6;                 // 슬라이드 개수
const step = 100 / total;        // 16.66% 한칸당 width 비율을 가져옴

const swiper = new Swiper('.list-swiper', {
  loop: true,
  slidesPerView: 1,

  on: {
    init: function () {
      updateBar(this.realIndex);
    },
    slideChange: function () {
      updateBar(this.realIndex);
    }
  }
});

function updateBar(index) {
  // index: 0,1,2,3,4,5
  const width = (index + 1) * step;   // 16.66, 33.32, 49.98 ...
  $bar.css('width', width + '%');
}


// allProduct img >video

$(function () {
  // ✅ video-target 이미지마다 hover용 video를 삽입
  $('.allProduct img.video-target').each(function () {
    const $img = $(this);

    // 이미지 파일명에서 번호 추출: allProduct_4.png -> 4
    const m = ($img.attr('src') || '').match(/allProduct_(\d+)\./);
    if (!m) return;

    const num = m[1]; // "4", "6", "10", "11", "14", "17" ...
    const videoSrc = `img/productMain/allProduct_hover_${num}.mp4`; // 네가 만들 mp4 경로 규칙

    // a 태그 안에 overlay 넣기
    const $a = $img.closest('a');
    if (!$a.length) return;

    // 이미 생성돼 있으면 중복 방지
    if ($a.find('.hoverMedia').length) return;

    const $overlay = $('<div class="hoverMedia"></div>');
    const $video = $(`
      <video class="hoverVideo" muted loop playsinline preload="metadata">
        <source src="${videoSrc}" type="video/mp4">
      </video>
    `);

    $overlay.append($video);
    $a.append($overlay);
  });

  // ✅ hover/focus 시 재생, 벗어나면 정지
  $('.allProduct .list_product li ul li')
    .on('mouseenter focusin', function () {
      const v = $(this).find('video.hoverVideo').get(0);
      if (!v) return;
      const p = v.play();
      if (p) p.catch(() => {});
    })
    .on('mouseleave focusout', function () {
      const v = $(this).find('video.hoverVideo').get(0);
      if (!v) return;
      v.pause();
      v.currentTime = 0; // 원하면 제거
    });
});







$(function () {

  function changeTurnImage() {
    var winW = $(window).width();

    if (winW <=1024) {

            $('.allProduct .inner .list_product .turn .product video')
            .attr('src', 'img/productMain/turn_1024.mp4');
    }

    if (winW <= 768) {
        $('.visual .inner>.img img').attr('src', 'img/productMain/visualMain_768.png');
        // $('.allProduct .inner .list_product .turn .text img')
        //     .attr('src', 'img/productMain/allProduct_turn_text2.svg');
        $('.allProduct .inner .list_product .turn .product video')
            .attr('src', 'img/productMain/turn_768.mp4');
        $('.allProduct .inner .list_product li.line6 li.veo .veo video')
            .attr('src', 'img/productMain/allProduct_video2_768.mp4');
        $('.top h2').html('Embracing beauty<br>that begins in nature');
        $('.top p').html('자연에서 시작된 아름다움이 시간과 일상 속에서<br>천천히 스며들어 나를 더욱 빛나게 합니다.');
    } else {
        $('.top h2').html('Embracing beauty that begins in nature');
        $('.top p').html('자연에서 시작된 아름다움이<br>시간과 일상 속에서 천천히 스며들어 나를 더욱 빛나게 합니다.');
        $('.allProduct .inner .list_product li.line6 li.veo .veo video')
            .attr('src', 'img/productMain/allProduct_video2.mp4');
        $('.allProduct .inner .list_product .turn .product video')
            .attr('src', 'img/productMain/turn_1920.mp4');
    }
    if (winW <= 390 ) {
      $('.visual .inner>.img img').attr('src', 'img/productMain/visualMain_390.png');
      $('.allProduct .inner .list_product .turn .product video')
            .attr('src', 'img/productMain/turn_390.mp4');
    }

    
  }
  

// footer
const footerH3 = document.querySelector('footer .top h3');
if (footerH3) {
    // 트랜지션 충돌을 막기 위해 초기화
    gsap.set(footerH3, { backgroundColor: "transparent", transition: "none" });

    gsap.to(footerH3, { 
        clipPath: "inset(0 0% 0 0)", 
        webkitClipPath: "inset(0 0% 0 0)",
        duration: 1.5, 
        ease: "power2.inOut",
        scrollTrigger: { 
            trigger: "footer", 
            start: "top 90%",
            onEnter: () => {
                // 부모 요소인 footer .top의 배경색이 body색인지 확인하고 강제 교정
                const parent = document.querySelector('footer .top');
                if (parent) {
                    parent.style.setProperty();
                }
            }
        }
    });
}

  // 최초 실행
  changeTurnImage();

  // 리사이즈 시 다시 체크
  $(window).on('resize', changeTurnImage);

});
