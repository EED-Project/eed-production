function l(args) {
  console.log(args)
}

$(document).ready(function () {
  // Mobile Menu
  initMobileMenu()

  document.addEventListener('scroll', handleScroll)
})

function setCountryPopulation() {
  let country_population = $('.big-number-value')
  if (!country_population) return

  let values = country_population.text().split(' ')
  if (values.length < 2) return

  country_population.html('<b class="number">' + values[0] + '</b>')
  values.shift()
  let dataAfter = ''
  if (country_population.get(0).hasAttribute('data-after')) {
    dataAfter = country_population.attr('data-after')
  }

  country_population.append(
    '<span class="text">' + values.join(' ') + ' ' + dataAfter + '</span>'
  )
}

function initMobileMenu() {
  let menu = $('.mobile-nav .mobile-menu')
  let menuItems = menu.find('li')
  let menuWidth = menu.width()
  let menuItemsWidth = 0
  let menuNextItem = $('.mobile-nav .next-icon')
  let menuPrevItem = $('.mobile-nav .prev-icon')

  menuItems.each(function () {
    menuItemsWidth += $(this).outerWidth()
  })

  if (menuItemsWidth < menuWidth) {
    menuNextItem.removeClass('active')
  } else {
    menuNextItem.addClass('active')
  }

  // Scroll Menu to Next Item
  let scrollLeft = 0
  let maxScrollLeft = menu.get(0).scrollWidth - menu.get(0).clientWidth
  menuNextItem.on('click', function () {
    scrollLeft += 151
    menu.animate({ scrollLeft }, 100)

    setTimeout(function () {
      if (menu.scrollLeft() > 0) menuPrevItem.addClass('active')
      if (menu.scrollLeft() >= maxScrollLeft) menuNextItem.removeClass('active')
      else menuNextItem.addClass('active')
    }, 300)
  })

  // Scroll Menu to Prev Item
  menuPrevItem.on('click', function () {
    scrollLeft -= 150
    if (scrollLeft < 0) scrollLeft = 0
    menu.animate({ scrollLeft }, 100)

    setTimeout(function () {
      if (menu.scrollLeft() < 1) {
        menuPrevItem.removeClass('active')
      }
      if (menu.scrollLeft() >= maxScrollLeft) menuNextItem.removeClass('active')
      else menuNextItem.addClass('active')
    }, 300)
  })
  /*menuItems.children('a').on('click', function (e) {
    e.preventDefault();
    let target = $(this).attr('href');
    target = $(target);
    if (target.length < 1) return;
    menuItems.find('a').removeClass('active');
    $(this).addClass('active');
    let scrollTo = target.offset().top - $('header').outerHeight();
    $('html, body').animate(
      {
        scrollTop: scrollTo,
      },
      300
    );
  });*/
}

function handleScroll() {
  const menu = $('.mobile-nav .mobile-menu')
  const menuItem = $('.mobile-nav .mobile-menu .nav-link.active')
  if (!menuItem) return
  if (!menuItem.length) return

  let scrollLeft = menuItem.get(0).offsetLeft - 10
  if (Math.abs(scrollLeft - menu.get(0).scrollLeft) < 100) return
  menu.get(0).scrollLeft = scrollLeft
}