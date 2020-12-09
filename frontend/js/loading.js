document.onreadystatechange = function () {
  if (document.readyState == 'complete') {
    var b = document.getElementsByTagName('BODY')[0];
    b.style.overflow = 'visible';
    document.getElementById('preloading').style.display = 'none';
    document.getElementById('loaded').style.visibility = 'visible';
  }
};
