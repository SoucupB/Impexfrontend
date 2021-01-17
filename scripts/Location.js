var mapApiQuery =
{
  "Cluj": "https://maps.google.com/maps?q=impexcera%20cluj&t=&z=13&ie=UTF8&iwloc=&output=embed",
  "Bucuresti": "https://maps.google.com/maps?q=impexcera%20bucuresti&t=&z=13&ie=UTF8&iwloc=&output=embed",
  "Sibiu": "https://maps.google.com/maps?q=impexcera%20sibiu&t=&z=13&ie=UTF8&iwloc=&output=embed"
};
function alliniateMiddle() {
  let w = window.innerWidth;
  $('.map-pointer').each(function() {
    let startWidth = Math.max(0, w / 2.0 - $(this).width() / 2.0);
    let stW = (startWidth / w * 100).toString();
    $(this).css({left: stW + '%'})
    $('.map-pointer-test').each(function() {
      $(this).css({left: stW + '%'})
      let selector = $("#selected");
      selector.css({left: Math.max(0, startWidth)})
    })
  })
  console.log($('#mapgfg').offset().top, $('#maps').offset().top)
}
function createMap(position) {
  var map = '<div id = "mapgfg" class="mapouter map-pointer">' +
            ' <div class="gmap_canvas"><iframe width="1200" height="500" id="gmap_canvas" src="' + position + '" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe></div>' +
            '</div>';
  document.getElementById('maps').appendChild(createElementFromHTML(map));
  return true;
}
function selectLocality() {
  if($('#mapgfg').length) {
    console.log($('#mapgfg').offset().top, $('#maps').offset().top)
    $('#mapgfg').remove();
  }
  var element = document.getElementById('selected').value;
  createMap(mapApiQuery[element])
  alliniateMiddle();

  return false;
}
selectLocality();
window.addEventListener('resize', alliniateMiddle);