$(document).ready(function() {
  let moCheck = 960;
  let $galleryTabs = $('.bs-gallery-tab li');
  let $box_sec = $(".remodeling-box section");
  $galleryTabs.on('click', function() {
    let index = $(this).index() + 1;
    let active = $(`.slides-main .swiper-slide:not(.swiper-slide-duplicate)[data-set="${index}"]`).eq(0).index();
    swiperMain.slideTo(active);
  })
  swiperMain.on('activeIndexChange', function() {
    let active = swiperMain.activeIndex;
    let index = $(swiperMain.slides[active]).data('set');
    if (index !== null) {
      $galleryTabs.removeClass('active');
      $galleryTabs.eq(index - 1).addClass('active');
    }
  });


  //graph animation
  let $graph = $('.view-graph');
  function grpHeight() {
    if ($graph.length) {
      $('.graph-box').each(function() {
        let afterBar = $(this).find('.after .bar');
        let barVal = afterBar.attr('data-value');
        let widthWidth = $(window).width();
          if(widthWidth < 960){
            let barValM = afterBar.attr('data-value-m');
            afterBar.css('height', barValM);
          }else{
            afterBar.css('height', barVal);
          }
        });
      }
    }
    let $txtAni = $('.bs-txt-ani');
    let $numTit = $('.bs-title-group');

    //모바일 햄버거 버튼
    let $btNav = $('.bt-nav');
    let $mNav = $('.bs-nav');
    $btNav.click(function(e){
      $btNav.toggleClass('active');
      $mNav.toggleClass('active');
      e.preventDefault();
    });

    scrollAni();

    $(window).on('resize', function() {
      let winW = $(window).width();
      if (winW >= moCheck) {
        $btNav.removeClass('active');
        $mNav.removeClass('active');
      }
    })
    $(window).on('load scroll resize', function() {
      let scroll = $(window).scrollTop();
      let winH = $(window).height();
      let graphTop = $graph.length ? $graph.offset().top : null;
      if (scroll >= (graphTop - (winH)/1.6)) {
        $graph.addClass('_ani');
      } else {
        $graph.removeClass(('_ani'));
      }
      
      let $numberCount = $('.number-count');
      let numberReset = 0;
      $numberCount.each(function() {
        let $this = $(this);
        let parents = $this.attr('data-target');
        let offset = $(parents).length ? $(parents).offset().top : $this.offset().top;
        let numberCountTop = $this.length ? offset : null;
        let CountConTxt = Number($this.attr('data-value'));
        let timer = Number($this.attr('data-time'));
        let delay = $this.attr('data-delay') == undefined ? 0 : $this.attr('data-delay');
        if (scroll >= (numberCountTop - (winH)/1.3)) {
          if (!$this.hasClass('_ani')) {
            $({ val : numberReset }).stop().delay(delay).animate({ val : CountConTxt }, {
              duration: timer,
              step: function() {
                let numberReset = numberWithCommas(Math.floor(this.val));
                $this.text(numberReset);
              },
              complete: function() {
                let numberReset = numberWithCommas(Math.floor(this.val));
                $this.text(numberReset);
              }
            });
          }
          numberReset = 1;
          //3자리마다 , 찍기
          function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          $this.addClass('_ani');
        } else {
          $this.removeClass('_ani');
          $this.text('0');
          numberReset = 0;
        }
      });

      //텍스트 떠오르는 인터렉션
      let bsTxtTop = $txtAni.length ? $txtAni.offset().top : undefined;
      if (scroll >= (bsTxtTop - (winH)/2)) {
        $txtAni.addClass('_ani');
      } else {
        $txtAni.removeClass(('_ani'));
      }

      $numTit.each(function() {
        let bsNumTop = $(this).offset().top - (winH/2.5);
        if ( scroll >= (bsNumTop - (winH)/2) ) {
          $(this).addClass('_ani');
        } else {
          $(this).removeClass('_ani');
        }
      });
      scrollAni();
      let windowWidth = $(window).width();
      if(windowWidth > 960){

        let $solutions = $('.launching-ad-solution');
        if ($solutions.length) {
          $solutions.find('.bs-inner').each(function() {
            let $this = $(this);
            let texts = $this.find('.bs-title-group .bs-text');
            let images = $this.find('.exam-img');
            texts.eq(0).addClass('show');
            images.each(function(index) {
              let offset = $(this).offset().top;
              if ( scroll >= offset - (winH/1.8) ) {
                texts.eq(index).addClass('show');
                texts.not(`:eq(${index})`).removeClass('show');
              }
            })
          });
        }
      }

      grpHeight();
    });

  //로컬 경로와 워프 경로를 맞추기 위한 스크립트
  let develop = 'localhost';
  let url = [
    'asset-management',
    'remodeling-consulting',
    'fastfive-launching',
    'contact',
    'submit_buildingsolution-service-introduction',
    'submit_buildingsolution'
  ]
  let currentLink = window.location.pathname;
  let $nav = $('.bs-nav li');
  if (window.location.hostname == develop) {
    $('.bs-nav a, .bt-base, .bt-consulting').each(function() {
      let link = $(this).attr('href');
      let urlCheck = url.includes(link.split('/')[1]);
      urlCheck ? $(this).attr('href', link + '.html') : null;
    });
  }
  $nav.each(function() {
    let navUrl = $(this).find('a').attr('href');
    if (currentLink.includes(navUrl)) {
      let index = $(this).index();
      $nav.eq(index).addClass('active');
    }
  });
  /* 타이핑 도희
 let $i = 0;
 let $liIndex = 0;
 let $newList = $(".consulting-news ul li");
 function typing(){
   if($liIndex < $newList.length){
    let $typingTxt = $newList.eq($liIndex).find("i").text();
    let $sliceTxt = $typingTxt.split("");
      if($i <$sliceTxt.length){
        $newList.eq($liIndex).find("h4").append($sliceTxt[$i]);
        $i++;
      }else{
        if($liIndex<$newList.length -1){
          console.log($liIndex);
          $liIndex++;
          $i = 0;
        }
      }
   }
 }
 setInterval(typing,50); */
}); 
const scrollAni = () => {
  let winH = $(window).height();
  let scroll = $(window).scrollTop();
  $('._scroll').each(function() {
    let posTop = $(this).offset().top;
    if ($(this).hasClass('back')) {
      let scale = 1;
      scale += (scroll - (posTop - (winH)/3)) * -0.002;
      scale = Math.min(Math.max(1, scale), 3);
      $(this).find('img').css('transform', `scale(${scale})`);
    }
    if (scroll >= (posTop - (winH)/1.6)) {
      $(this).addClass('_ani');
    } else {
      $(this).removeClass('_ani');
    }
  });
}
const swiper = new Swiper('.slides-main-thumbs', {
  loop: true,
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesProgress: true,
});

const swiperMain = new Swiper('.slides-main', {
  loop: true,
  spaceBetween: 0,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  thumbs: {
    swiper: swiper,
  },
});


$('.slides-before').each(function(index){
  let $this = $(this);
  $this.addClass('before-' + index);
});

const swiperThumb1 = new Swiper('.slider-min1', {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 1,
});
const swiperThumb2 = new Swiper('.slider-min2', {
  loop: true,
  spaceBetween: 0,
  slidesPerView: 1,
});
const swiperBefore1 = new Swiper('.before-0', {
  loop: true,
  spaceBetween: 0,
  navigation: {
    nextEl: `.before-nav1 .bt-next`,
    prevEl: `.before-nav1 .bt-prev`,
  },
  pagination: {
    el: `.before-nav1 .slides-paging`,
    type: 'fraction',
    renderCustom: function(swiper, current, total) {
      return `<strong>${current}</strong>/<span>${total}</span>`;
    }
  },
});
const swiperBefore2 = new Swiper('.before-1', {
  loop: true,
  spaceBetween: 0,
  navigation: {
    nextEl: `.before-nav2 .bt-next`,
    prevEl: `.before-nav2 .bt-prev`,
  },
  pagination: {
    el: `.before-nav2 .slides-paging`,
    type: 'fraction',
    renderCustom: function(swiper, current, total) {
      return `<strong>${current}</strong>/<span>${total}</span>`;
    }
  },
});

swiperThumb1.controller.control = swiperBefore1;
swiperBefore1.controller.control = swiperThumb1;

swiperThumb2.controller.control = swiperBefore2;
swiperBefore2.controller.control = swiperThumb2;

let winWidth = $(window).outerWidth();
let swiperExample = undefined;

function initExample() {
  let $slides = $('.slides-example .swiper-slide');
  let mainCheck = $slides.parents('.main-example').length;
  let $prev = '.slides-example-container .slides-navigation .bt-prev';
  let $next = '.slides-example-container .slides-navigation .bt-next';
  let $page = '.slides-example-container .slides-navigation .slides-paging';

  /*if (swiperExample != undefined){ 
    swiperExample.destroy();
    swiperExample = undefined;
  }*/
  if ($('.slides-example').length) {
    if (winWidth < 960 ) {
      swiperExample = new Swiper('.slides-example', {
        slidesPerView: 'auto',
        spaceBetween: 30,
        centeredSlides: true,
        loop: true,
        /*autoplay: {
          delay: 3000,
        },*/
        navigation: {
          nextEl: $next ,
          prevEl: $prev ,
        },
        pagination: {
          el: $page,
          type: 'fraction',
          renderCustom: function(swiper, current, total) {
            return `<strong>${current}</strong>/<span>${total}</span>`;
          }
        },
      });
    } else if (winWidth >= 960) {
      swiperExample = new Swiper('.slides-example', {
        slidesPerView: 'auto',
        spaceBetween: 20,
        centeredSlides: false,
        preventClicks: true,
        loop: true,
        autoplay: {
          delay: 3000,
        },
        navigation: {
          nextEl: $next,
          prevEl: $prev,
        },
        pagination: {
          el: $page,
          type: 'fraction',
          renderCustom: function(swiper, current, total) {
            return `<strong>${current}</strong>/<span>${total}</span>`;
          }
        },
        /*
        on: {
          init: function () {
            if(mainCheck) {
              $slides = $('.slides-example .swiper-slide');
              $slides.addClass('changed');
            }
          },
          slideChangeTransitionStart : function() {
            if(mainCheck) {
              $slides.addClass('changing');
              $slides.removeClass('changed');
            }
          },
          slideChangeTransitionEnd : function() {
            if(mainCheck) {
              $slides.removeClass('changing');
              $slides.addClass('changed');
            }
          }
        },
        */
      });
    }
  }
}

let swiperLead = undefined;
function initLead() {
  let $prev = '.consulting-lead .slides-navigation .bt-prev';
  let $next = '.consulting-lead .slides-navigation .bt-next';
  let $page = '.consulting-lead .slides-navigation .slides-paging';
  if (winWidth < 960 && swiperLead == undefined) {
    swiperLead = new Swiper('.consulting-lead', {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      navigation: {
        nextEl: $next,
        prevEl: $prev,
      },
      pagination: {
        el: $page,
        type: 'fraction',
        renderCustom: function(swiper, current, total) {
          return `<strong>${current}</strong>/<span>${total}</span>`;
        }
      },
    });
  }else if (winWidth >= 960 && swiperLead != undefined) {
    swiperLead.destroy();
    swiperLead = undefined;
  }
}
initExample();
initLead();
$(window).on('resize', function() {
  winWidth = $(window).outerWidth();
  initExample();
  initLead();
});
/*
slideChangeTransitionStart: function(swiper) {
  let $wrapperEl = swiper.$wrapperEl;
  let params = swiper.params;
  $wrapperEl.children(('.' + (params.slideClass) + '.' + (params.slideDuplicateClass)))
  .each(function() {
    let idx = this.getAttribute('data-swiper-slide-index');
    this.innerHTML = $wrapperEl.children('.' + params.slideClass + '[data-swiper-slide-index="' + idx + '"]:not(.' + params.slideDuplicateClass + ')').html();
  });
},
slideChangeTransitionEnd: function(swiper) {
  swiper.slideToLoop(swiper.realIndex, 0, false);
}
*/

const swiperMainViual = new Swiper('.slides-visual', {
  effect: 'fade',
  loop: true,
  autoplay: {
    delay: 3000,
  },
});

let $page2 = '.choice-02 .slides-paging';
const swiperChoice = new Swiper('.slides-choice', {
  navigation: {
    nextEl: '.choice-02 .bt-next',
    prevEl: '.choice-02 .bt-prev',
  },
  loop: true,
  effect : 'fade',
  pagination: {
    el: $page2,
    type: 'fraction',
    renderCustom: function(swiper, current, total) {
      return `<strong>${current}</strong>/<span>${total}</span>`;
    }
  },
});
$('.slides-remodeling').each(function(index){
  let $this = $(this);
  $this.addClass('remodeling-' + index);
  const swiperRemodeling = new Swiper('.remodeling-' + index, {
    loop: true,
    spaceBetween: 0,
    navigation: {
      nextEl: `.remodeling-${index} .bt-next`,
      prevEl: `.remodeling-${index} .bt-prev`,
    },
    pagination: {
      el: `.remodeling-${index} .slides-paging`,
      type: 'fraction',
      renderCustom: function(swiper, current, total) {
        return `<strong>${current}</strong>/<span>${total}</span>`;
      }
    },
  });
  let remodelingBoxTxt = $(".remodeling-box section");
  swiperRemodeling.on('activeIndexChange', function() {
    let indexMain = $(".remodeling-0 .swiper-pagination-current").text();
    remodelingBoxTxt.removeClass('active');
    remodelingBoxTxt.eq(indexMain - 1).addClass('active');
  });
});


$('.slides-design').each(function(index){
  let $this = $(this);
  $this.addClass('slides-design' + index);
  const swiperRemodeling = new Swiper('.slides-design' + index, {
    loop: true,
    spaceBetween: 20,
    centeredSlides: false,
    slidesPerView: 'auto',
    navigation: {
      nextEl: `.slides-design${index} .bt-next`,
      prevEl: `.slides-design${index} .bt-prev`,
    },
    pagination: {
      el: `.slides-design${index} .slides-paging`,
      type: 'fraction',
      renderCustom: function(swiper, current, total) {
        return `<strong>${current}</strong>/<span>${total}</span>`;
      }
    },
  });
});
$('.solution-imgs-m').each(function(index){
  let $this = $(this);
  $this.addClass('solution-imgs-m' + index);
  let page = '.solution-imgs-m' + index + ' .swiper-pagination';//슬라이드 구분
  const swiperLaunching = new Swiper('.solution-imgs-m' + index, {
    effect: 'fade',
    loop: true,
    pagination: {
      el: page,
      clickable: true,
    },
    /*autoplay: {
      delay: 3000,
    },*/
  });
  let $txtWrap = $(".swiper-txt-wrap"+index);
  swiperLaunching.on('activeIndexChange', function() {
   $($txtWrap).find('.bs-text').removeClass("show");
   $($txtWrap).find(".swiper-txts-"+swiperLaunching.realIndex).addClass("show");
  });
});
$(".slide_tab").each(function(index){
  let $thisTab = $(this);
  $thisTab.addClass('slide_tab' + index);
  $thisTab.click(function(e){
    e.preventDefault();
    $(".slide_tab").removeClass("active");
    $thisTab.addClass('active');
    $('.slides-design').css("display",'none');
    $('.slides-design'+ index).css('display','block');
  }); 
});
let videoThumb = $(".video-thumb");
videoThumb.on('click', function() {
    $(this).css("display","none");
});

  let $win_width = $(window).outerWidth();
  let $addInfo = $('.add-info');
  let $closeBtn = $('.close-btn');
  let $minPop = $('.min_pop');
  let hoverClick = () => {
    let check_mo = $win_width <= 960;
    /* if (!check_mo) {
      $addInfo.on('click', function() {
        $addInfo.off('click');
        $minPop.addClass('show');
     }).on('mouseleave', function() {
        $addInfo.on('click');
        $minPop.removeClass('show');
      });
    } else {*/
      if($minPop.hasClass('show')) $minPop.removeClass('show');
      //$addInfo.off('mouseenter mouseleave');
      $addInfo.on('click', function(e) {
        e.stopImmediatePropagation();
        $minPop.toggleClass('show');
      });
    //}
  }
  $closeBtn.on('click', function() {
    $minPop.removeClass('show');
  });
  hoverClick();
  $(window).on('resize', function() {
    $win_width = $(window).outerWidth();
    hoverClick();
  });

  /*
  $(".quick_btn").click(function(e){
    $(".quick").addClass("ani");
    $(".quick").toggleClass("active");
    e.preventDefault();
  });
  $(document).mouseup(function (e){
    var quick = $(".quick");
    if(quick.has(e.target).length === 0){
      quick.removeClass("active");
    }
  });*/
  $addInfo.on('click', function(e) {
    e.preventDefault();
  });
let $wrapper = $(".bs-wrapper");
let $footer = $(".bs-footer");
let $quick = $(".quick_btn");
let quickGap = parseInt($quick.css('bottom'));
$(window).on('scroll', function() {
  let checkEnd = $wrapper.height() - ($(window).height() + $footer.outerHeight());
  let scrollV = $(window).scrollTop();
  if(scrollV > checkEnd){
    $quick.css("position","absolute");
    $quick.css("bottom",quickGap + $footer.outerHeight());
    /*
    console.log("tt");
    $(".quick_btn").click(function(e){
      $("html").animate({scrollTop:checkEnd},200);
      e.preventDefault();
    });*/
  }else{
    $quick.css("position","fixed");
    $quick.css("bottom",quickGap);
  }
});
let minNum = $(".contact_officeSize .wpcf7-form-control-wrap input");
let maxlength = 5;
minNum.on("change keyup paste", function() {
  let minNumValue = minNum.val();
  if(minNumValue.length > maxlength)  {
    minNumValue = minNum.val(minNumValue.substr(0, maxlength));
   }
});
function clipboard(){
	let url = '';
	let textarea = document.createElement('textarea');
	document.body.appendChild(textarea);
	url = window.document.location.href;
	textarea.value = url;
	textarea.select();
	document.execCommand('copy');
	document.body.removeChild(textarea);
	alert('URL 주소가 복사 되었습니다. 이제 지인에게 공유하세요!')
}
