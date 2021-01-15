var colectii = null;
var doneConstructingImages = false;
var totalClasses = 1;
var containerMap = {};
var paginationIndexes = {};
var catIDs = {};
var catExamples = [];
var collectionTabData = {};
$.ajaxSetup({async: false});
const per_page = 12;
let collectionTypesData = null;
const imgFolder = 'prodImages/'

function createHtmlImage(id, colectie, descriere, image, classes) {
    const newId = id.toString();
    let stre = '<div id= "id_'+ newId + '"' + ' class="post-media pitem item-w1 item-h1 cat' + classes.toString() + '">' +
               '    <a id = ida_' + newId + ' href="' + image + '" data-rel="prettyPhoto[gal]">' +
               '        <img id = idb_' + newId + ' src="' + image + '" alt="" class="img-responsive">' +
               '        <div>' +
               '            <h3 id = idc_' + newId + '>' + colectie + ' <small> ' + descriere + ' </small></h3>' +
               '            <i class="flaticon-unlink"></i>' +
               '        </div>' +
               '    </a>' +
               '</div';
    var element = createElementFromHTML(stre);
    return element;
}

function addToCategory(container, cat, number, title) {
    var categ = '<li><a class="btn btn-dark btn-radius btn-brd" data-toggle="tooltip" ' +
                ' data-placement="top" title="' + number.toString() +
                '" data-filter=".cat' + cat.toString() + '">' + title + '</a></li>';
    paginationIndexes[".cat" + cat.toString()] = number;
    catIDs[".cat" + cat.toString()] = cat;
    container.appendChild(createElementFromHTML(categ));
}

function createCategories() {
    let totalClasses = 0;
    let container = document.getElementById("cateories");
    $.ajax({
        type: "GET",
        url: 'http://' + publicIP + ':3000/tips',
        data: {},
        success: function( data ) {
            const containerDiv = document.getElementById("da-thumbs");
            totalClasses = data['tips'].length;
            collectionTypesData = data['tips'];
            for(var i = 0; i < data['tips'].length; i++) {
                collectionTabData[i + 1] = [];
                for(var j = 0; j < per_page; j++) {
                    var element = createHtmlImage(j + i * per_page, "", "", "", i + 1);
                    containerDiv.appendChild(element)
                    var pageSize = Math.floor(data['tips'][i][1] / per_page) + (data['tips'][i][1] % per_page !== 0);
                    collectionTabData[i + 1].push(j + i * per_page)
                }
                addToCategory(container, i + 1, data['tips'][i][1], data['tips'][i][0]);
            }
        },
        dataType: 'json'
    });
    beginAnimation();
    for(var i = 0; i < totalClasses; i++) {
        for(var j = 0; j < per_page; j++) {
            $('#id_' + (j + i * per_page).toString()).hide();
        }
    }
    for(var i = 0; i < totalClasses; i++) {
        fillWithCollectionItems(collectionTypesData[i][0], i, 1);
    }
}

function firstPage() {
    $(function() {
        function refreshWaypoints() {
            setTimeout(function() {
            }, 3000);
        }
        var $container = $('.portfolio');
        createPaginations('.cat1');
        $container.isotope({ filter: '.cat1' }, refreshWaypoints());
        return false;
    });
}

function replaceRecordData(id, IDNum, colectie, descriere, imagine) {
    var currentElement = document.getElementById('id_' + id.toString());
    if(currentElement === undefined) {
        return 0;
    }
    var a = document.getElementById('ida_' + id.toString());
    a.setAttribute('href',"colectie.html?id="+IDNum)
    var collection = document.getElementById('idc_' + id.toString());
    var image = document.getElementById('idb_' + id.toString());
    collection.innerHTML = colectie + ' <small> ' + descriere + ' </small>';
    image.src = imagine;
}

function fillWithCollectionItems(collectionTypesData, idsOffset, page) {
    var realIndex = 0;
    var queryData = "&tip=";
    for(var i = 0; i < per_page; i++) {
        $('#id_' + (idsOffset * per_page + i).toString()).hide();
    }
    if(collectionTypesData !== null) {
        queryData += collectionTypesData;
    }
    else {
        queryData = "";
    }
    $.ajax({
        type: "GET",
        url: 'http://' + publicIP + ':3000/portfolio_all?page=' + page.toString() + '&per_page=' + per_page.toString() + queryData,
        data: {},
        success: function( data ) {
            console.log(idsOffset);
            containerMap[".cat" + (idsOffset + 1).toString()] = data['pages'];
            var parcare = 0;
            for(var i = 0; i < data['data'].length; i++) {
                if(data['data'][i]['img'] !== null) {
                    parcare++;
                    $('#id_' + (idsOffset * per_page + realIndex).toString()).show();
                    replaceRecordData(idsOffset * per_page + realIndex++,data['data'][i]['IDnum'] ,data['data'][i]['colectie'], data['data'][i]['descriere'], imgFolder + data['data'][i]['img'][0]);
                }
                else {
                    console.log('ANA', data['data'][i]['IDnum'])
                }
            }
        },
        dataType: 'json'
    });
}

function highlightPag(pagination, cat_id) {
    fillWithCollectionItems(collectionTypesData[catIDs[cat_id] - 1][0], catIDs[cat_id] - 1, pagination + 1);
    for(var i = 0; i < catExamples.length; i++) {
        document.getElementById(catExamples[i]).removeAttribute("class");
    }
    document.getElementById("pag_" + pagination.toString()).setAttribute("class", "active");
}

function createPaginations(cat_id) {
    if(cat_id === '*')
        return ;
    var element = document.getElementById("pagi");
    for(var i = 0; i < catExamples.length; i++) {
        document.getElementById(catExamples[i]).remove();
    }
    catExamples = [];
    var pagSize = containerMap[cat_id];
    for(var i = 0; i < pagSize; i++) {
        var cId = "pag_" + i.toString();
        catExamples.push(cId);
        var htmlPagination = '<a onClick = "highlightPag(' + i.toString() + ', ' + String.fromCharCode(39) + cat_id + String.fromCharCode(39) + ')" id = ' + cId + '>' + (i + 1).toString() + '</a>';
        var pag = createElementFromHTML(htmlPagination);
        element.appendChild(pag);
    }
    element.appendChild(createElementFromHTML("<a id = pag_" + pagSize.toString() + ">&raquo;</a>"))
    catExamples.push("pag_" + pagSize.toString());
}

function beginAnimation() {
    customs();
    queryTransform();
    hoveriing();
}
createCategories();
firstPage();