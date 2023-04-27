const cursor = document.querySelector("#cursor")

let mouse = { x: -100, y: -100 }
let pos = { x: 0, y: 0 }
const speed = 0.1

const updateCoordinates = (e) => {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

window.addEventListener("mousemove", updateCoordinates)

const updatePosition = () => {
  pos.x += (mouse.x - pos.x) * speed
  pos.y += (mouse.y - pos.y) * speed
  cursor.style.transform =
    "translate3d(" + pos.x + "px ," + pos.y + "px, 0)"
}

const loop = () => {
  updatePosition()
  requestAnimationFrame(loop)
}

requestAnimationFrame(loop)

const cursorModifiers = document.querySelectorAll("[cursor-class]")

cursorModifiers.forEach((cursorModifier) => {
  cursorModifier.addEventListener("mouseenter", function () {
    let attribute = this.getAttribute("cursor-class")
    cursor.classList.add(attribute)
  })
  
  cursorModifier.addEventListener("mouseleave", function () {
    let attribute = this.getAttribute("cursor-class")
    cursor.classList.remove(attribute)
  })
})
$(document).ready(function() {
	let winH = $(window).outerHeight();
	$(window).on('scroll', function() {
		let $check = $('.ani-check');
		$check.each(function() {
		let offset = $(this).length ? $(this).offset().top : null;
			if ($(window).scrollTop() >= offset - (winH/1.5)) {
				console.log(winH/2);
				$(this).addClass('ani');
			} else {
				$(this).removeClass('ani');
			}
		});
	});
  //tit
  let didScroll = false;
  let paralaxTitles = document.querySelectorAll('.paralax-title');
  let paralaxTitles2 = document.querySelectorAll('.paralax-title2');

  const scrollInProgress = () => {
    didScroll = true
  }

  const raf = () => {
    if(didScroll) {
      paralaxTitles.forEach((element, index) => {
        element.style.transform = "translateX("+ window.scrollY / 100 + "%)"
      })
      paralaxTitles2.forEach((element, index) => {
        element.style.transform = "translateX(-"+ window.scrollY / 100 + "%)"
      })
      didScroll = false;
    }
    requestAnimationFrame(raf);
  }


  requestAnimationFrame(raf);
  window.addEventListener('scroll', scrollInProgress)

});