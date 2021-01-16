const per_page = 15;
let numberOfPages = 0;
let idMaps = {};
let totalCheckerIds = [];
var filters = null;
var lastPaginationIndex = 1;
var categorie = "";
const imgFolder = 'prodImages/';

function createMagElement(photo, titlu, id, uniqID) {
  var htmlElement = "<div onclick = 'disableDiv()' class='gallery' id = el_" + id.toString() + ">" +
                    " <a id = trg_ " + id.toString() + " target='_blank' href='element.html?id=" + uniqID + "'>" +
                    "   <img id = imge_ " + id.toString() + " src=" + imgFolder + photo + " alt='Cinque Terre'>" +
                    " </a>" +
                    "<div class='descr' id = dsc_" + id.toString() + ">" + titlu + "</div>";
  var element = createElementFromHTML(htmlElement);
  return element;
}

function addElement(photo, titlu, id, uniqID) {
  var parent = document.getElementById('elements');
  parent.appendChild(createMagElement(photo, titlu, id, uniqID));
}

function createPaginations(number) {
  var parent = document.getElementById('pagi');
  for(var i = 0; i < number; i++) {
    const ci = (i + 1).toString();
    var element = createElementFromHTML('<a onclick = "return changePag(' + ci + ')" id = pag_' + ci + '>' + ci + '</a>');
    parent.appendChild(element);
  }
  parent.appendChild(createElementFromHTML("<a id = finish_pag>&raquo;</a>"))
}

function deletePagination(number) {
  for(var i = 0; i < number; i++) {
    var elements = document.getElementById('pag_' + (i + 1).toString());
    if(elements) {
      elements.remove();
    }
  }
  document.getElementById('finish_pag').remove();
}

function deleteElements() {
  for(var i = 0; i < per_page; i++) {
    var elements = document.getElementById('el_' + i.toString());
    if(elements) {
      elements.remove();
    }
  }
}

function changePag(id) {
  deleteElements();
  populateElements(id, per_page);
  activatePage(id);
  return false;
}

function activatePage(page) {
  if($('#wrng')) {
    $('#wrng').remove();
  }
  if(!document.getElementById('pag_' + lastPaginationIndex)) {
    lastPaginationIndex = 1;
    page = 1;
  }
  if(!numberOfPages) {
    document.getElementById("elements").appendChild(noElementsDiv())
    return 0;
  }
  document.getElementById('pag_' + lastPaginationIndex).removeAttribute("class");
  document.getElementById('pag_' + page).setAttribute("class", "active");
  lastPaginationIndex = page;
  return 1;
}

function regulateDistance() {
  var containerSize = document.getElementById("da-thumbs").getBoundingClientRect().width;
  var containerPosition = getPosY(document.getElementById("da-thumbs"));
  var copyrightsPosition = getPosY(document.getElementById("arca"));
  var maxSize = containerSize;
  if(containerSize + containerPosition > copyrightsPosition - 10) {
    maxSize = copyrightsPosition - containerPosition - 10;
  }
  $("#checkboxes").css({height: Math.max(40, (maxSize / containerSize * 91)).toString() + "%"})
  console.log(containerSize, containerPosition, copyrightsPosition, containerSize + containerPosition, maxSize)
}

function createCheckboxLine(title, id, idPrefix) {
  let c_id = idPrefix + '_' + id.toString();
  idMaps[c_id] = idPrefix;
  totalCheckerIds.push(c_id);
  var htmlChecker = '<div><input id = ' + c_id + ' type="checkbox" name="startingReserves" value="starting" id="starting" onclick="searchFilterData()"> <label id = _' + c_id + ' for="starting">'
                     + title + '</label></div>';
  return createElementFromHTML(htmlChecker);
}

function createFilterString(filters) {
  var stre = "";
  if(filters === null) {
    return stre;
  }
  for(var i = 0; i < filters.length; i++) {
    stre += "&" + filters[i][0] + "[]=" + filters[i][1];
  }
  return stre;
}

function populateElements(page, per_page) {
  const url = 'http://' + publicIP + ':' + publicPort + '/elements?page=' + page.toString() + '&per_page=' + per_page.toString() + createFilterString(filters) + getCateogry();
  $.ajax({
    type: "GET",
    url: url,
    data: {},
    success: function( data ) {
      numberOfPages = data['pages'];
      for(var i = 0; i < data['elements'].length; i++) {
        addElement(data['elements'][i]['img'], data['elements'][i]['categorie'] + " " + data['elements'][i]['culoare'], i, data['elements'][i]['IDnum']);
      }
    },
    dataType: 'json'
  });
}

function getCateogry() {
  if(categorie === "") {
    return "";
  }
  return "&categorie[]=" + categorie;
}

function disableDiv() {
  $('#portfolio').attr("disabled", false);
}

function addTitle(title) {
  var checkers = document.getElementById('checkboxes');
  var htmlChecker = '<h2>' + title + '</h2>';
  checkers.appendChild(createElementFromHTML(htmlChecker));
}

function getAllSelectedData() {
  var selectedData = [];
  for(var i = 0; i < totalCheckerIds.length; i++) {
    let element = document.getElementById(totalCheckerIds[i]);
    if(element.checked === true) {
      selectedData.push([idMaps[totalCheckerIds[i]], document.getElementById('_' + totalCheckerIds[i]).innerHTML]);
    }
  }
  return selectedData;
}

function createElementsType() {
  $.ajax({
    type: "GET",
    url: 'http://' + publicIP + ':' + publicPort + '/elementsAttrs?atr=categorie',
    data: {},
    success: function( data ) {
      createDivButton("All", 5);
      data['records'].forEach(element => {
        createDivButton(element, 5);
      });
    },
    dataType: 'json'
  });
}

function populateCheckboxes(atr) {
  $.ajax({
    type: "GET",
    url: 'http://' + publicIP + ':' + publicPort + '/elementsAttrs?atr=' + atr,
    data: {},
    success: function( data ) {
      var checkers = document.getElementById('checkboxes');
      for(var i = 0; i < data['records'].length; i++) {
        if(data['records'][i] != "null")checkers.appendChild(createCheckboxLine(data['records'][i], i, atr));
      }
    },
    dataType: 'json'
  });
}

function searchFilterData() {
  var selData = getAllSelectedData();
  filters = selData;
  if(selData.length === 0) {
    filters = null;
  }
  deleteElements();
  deletePagination(numberOfPages);
  populateElements(1, per_page);
  createPaginations(numberOfPages);
  activatePage(1);
  regulateDistance();
  return false;
}

function createDivButton(title, quant) {
  var categ = '<li class = "btn-load" style="position: absolute;"><a class="btn btn-dark btn-radius btn-brd btn-color" data-toggle="tooltip" ' +
                ' data-placement="top"' +
                'style = "color:red;">' + title + '</a></li>';
  document.getElementById('da-thumbs').appendChild(createElementFromHTML(categ));
}

function filterByName(id, name) {
  if(id === "dtr_0") {
    categorie = "";
  }
  else {
    categorie = name;
  }
  searchFilterData();
  colorItself(id);
}

$.ajaxSetup({async: false});
populateElements(1, per_page);
createPaginations(numberOfPages);
addTitle('Dimensiuni');
populateCheckboxes('dimensiuni');
addTitle('Culoare');
populateCheckboxes('culoare');
activatePage(1);
createElementsType();

regulateButtons();
coloringButton();
firstColoring();
regulateDistance();