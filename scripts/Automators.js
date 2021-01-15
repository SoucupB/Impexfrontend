var lasthighlighted = -1;

function regulateButtons() {
  var elements = 0;
  var totalSize = 0;
  var w = window.innerWidth;
  var buttonsCounter = $('.btn-load').length;
  $('.btn-load').each(function() {
    var newID = 'crt_' + elements.toString();
    this.id = newID;
    elements++;
    return this.innerHTML;
  });
  elements = 0;
  $('.btn-load').each(function() {
    var newID = 'crt_' + elements.toString();
    totalSize += $("#" + newID).width()
    elements++;
  });
  var initialStart = w / 2 - totalSize / 2 - 10 * (buttonsCounter - 1);
  elements = 0;
  var currentPosition = initialStart;
  $('.btn-load').each(function() {
    var newID = 'crt_' + elements.toString();
    var element = $("#" + newID);
    element.css({position: 'absolute', left: currentPosition + 'px', top: "-59px"})
    currentPosition += element.width() + 10;
    elements++;
  });
}

function colorItself(element) {
  if(lasthighlighted !== 0) {
    $('#' + lasthighlighted).css({"background-color": "white", "color": "red"});
  }
  $('#' + element).css({"background-color": "red", "color": "white"});
  lasthighlighted = element;
}

function firstColoring() {
  lasthighlighted = "dtr_0";
  $('#' + lasthighlighted).css({"background-color": "red", "color": "white"});
}

function coloringButton() {
  var index = 0;
  $('.btn-color').each(function() {
    var id = "dtr_" + index.toString();
    this.id = id;
    $(this).attr("onClick", 'filterByName("' + id + '", "' + this.innerHTML + '")')
    index++;
  });
}

window.addEventListener('resize', regulateButtons);
