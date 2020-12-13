function l(args) {
  console.log(args);
}
$(document).ready(function () {
  (function () {
    let country_population = $('.big-number-value');
    if (!country_population) return;
    let values = country_population.text().split(' ');
    if (values.length < 2) return;
    country_population.html('<b class="number">' + values[0] + '</b>');
    values.shift();
    let dataAfter = '';
    if (country_population.get(0).hasAttribute('data-after')) {
      dataAfter = country_population.attr('data-after');
    }
    country_population.append('<span class="text">' + values.join(' ') + ' ' + dataAfter + '</span>');
  });

  // Mobile Menu
  /*(function () {
    let menu = $('.mobile-nav .mobile-menu'),
      menuItems = menu.find('li'),
      menuWidth = menu.width(),
      menuItemsWidth = 0,
      menuNextItem = $('.mobile-nav .next-icon'),
      menuPrevItem = $('.mobile-nav .prev-icon');
    menuItems.each(function () {
      menuItemsWidth += $(this).outerWidth();
    });
    if (menuItemsWidth < menuWidth) {
      menuNextItem.removeClass('active');
    } else {
      menuNextItem.addClass('active');
    }
    // Scroll Menu to Next Item
    let scrollLeft = 0,
      maxScrollLeft = menu.get(0).scrollWidth - menu.get(0).clientWidth;
    menuNextItem.on('click', function () {
      scrollLeft += 151;
      menu.animate(
        {
          scrollLeft: scrollLeft,
        },
        100
      );
      setTimeout(function () {
        if (menu.scrollLeft() > 0) menuPrevItem.addClass('active');
        if (menu.scrollLeft() >= maxScrollLeft) menuNextItem.removeClass('active');
        else menuNextItem.addClass('active');
      }, 300);
    });
    // Scroll Menu to Prev Item
    menuPrevItem.on('click', function () {
      scrollLeft -= 150;
      if (scrollLeft < 0) scrollLeft = 0;
      menu.animate(
        {
          scrollLeft: scrollLeft,
        },
        100
      );
      setTimeout(function () {
        if (menu.scrollLeft() < 1) {
          menuPrevItem.removeClass('active');
        }
        if (menu.scrollLeft() >= maxScrollLeft) menuNextItem.removeClass('active');
        else menuNextItem.addClass('active');
      }, 300);
    });
    menuItems.children('a').on('click', function (e) {
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
    });
  })();*/
});
