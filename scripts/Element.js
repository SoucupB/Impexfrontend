const path = "prodImages/";
var offsetTop = 0;
var offsetLeft = 0;
var magnified = 0;

function getFormatedStyle(photo) {
  console.log(window.innerWidth, window.innerHeight)
  var img = new Image();
  img.src = path + photo;
  img.id = 'ana';
  img.onload = function () {
    var imge = document.getElementById('img1');
    var newHeight = Math.min(500, img.height), newWidth= Math.min(500, img.width);
    var newPosition = Math.floor(window.innerWidth / 2) - Math.floor(newWidth / 2);
    imge.style = 'left: ' + newPosition + 'px; height: ' + newHeight + 'px; width: ' + newWidth + 'px;';
   // imge.style = 'position: relative; left: ' + newPosition + 'px; height: ' + newHeight + 'px; width: ' + newWidth + 'px;';
    var topPosition = imge.getBoundingClientRect().top - document.getElementById('portfolio').getBoundingClientRect().top;
   // offsetTop = newPosition;
    offsetLeft = Math.floor(topPosition / 2);
  };
}

function activateMagnifier() {
  if(!magnified) {
    magnify('img1', 2, offsetTop, offsetLeft);
    magnified = 1;
  }
  return false;
}

function loadImage(photo) {
  var parent = document.getElementById('portfolio');
  //var newElement = createElementFromHTML("<div><img class='img-responsive img-rounded' style='max-height:360px; max-width: 320px;' src=" +
  //                                       path + photo + " ></div>");
  var newElement = createElementFromHTML(
                                         "<div class='col-md-4 col-sm-4 col-xs-12' style='width: 350px; height:150px margin-right: 20px;'>"+
                                         "<div class='service-widget'>"+
                                         "<div class='post-media wow fadeIn' style='visibility: visible; animation-name: fadeIn;'>"+
                                         "<a target='_blank' rel='noopener noreferrer' href='"+path+photo+"' data-rel='prettyPhoto[gal]' class='hoverbutton global-radius'><i class='flaticon-unlink'></i></a><img id='plm' src='"+path+photo+"' alt='' style='max-height:320px; max-width: 320px;'></div></div></div>");
  parent.appendChild(newElement);
  getFormatedStyle(photo);
}


function loadTitle(data) {
  var title =  capitalizeFirstLetter(data['categorie'])+" "+ capitalizeFirstLetter(data['colectie']);
  document.getElementById('title').innerHTML = title;
}

function loadData(data) {
  if(data['culoare']){
    document.getElementById('2').innerHTML = 'Culoare: '+ capitalizeFirstLetter(data['culoare']);
  }
  else{
    document.getElementById('2').remove();
  }
  document.getElementById('1').innerHTML = 'Tip placa: '+ capitalizeFirstLetter(data['categorie']);
  document.getElementById('3').innerHTML = 'Dimensiune: '+ data['dimensiuni']+' cm';
  document.getElementById('4').innerHTML ="Colectie: "+ capitalizeFirstLetter(data['colectie']);

}

function getElement() {
  $.ajax({
    type: "GET",
    url: 'http://' + publicIP + ':' + publicPort + '/getElementByID?id=' + getSearchParameters()['id'],
    data: {},
    success: function( data ) {
      loadImage(data['record']['img']);
      loadTitle(data['record']);
      loadData(data['record']);
    },
    dataType: 'json'
  });
}

getElement();