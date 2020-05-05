$(document).ready( function() {
  var exListText = $("#dlist").text().trim();
  var exList = JSON.parse(exListText);
  var chapListText = $("#clist").text().trim();
  var chapList = JSON.parse(chapListText);

  var main = document.querySelector('main');
  tableInit(exList,main);
  mainInit(chapList,main);

  $('#dlist').remove();
  $('#clist').remove();

  $('article').addClass('hide');
  $('#Discourse-as-Collaborative-Inquiry').removeClass('hide').addClass('show');
  $('#main-nav a').click(function() {
    var item = $(this).attr('href');
    $('article').removeClass('show').addClass('hide');
    $(item).removeClass('hide').addClass('show');

    return false;
  });
});

function tableInit(list,attach) {
  var table = document.querySelector('#extra');
  var cloneEx = table.content.cloneNode(true);
  cloneEx.querySelector('article').setAttribute('id','examples');

  var rowTemplate = document.querySelector('#example-row');

  for (var i = 0; i < list.length; i++) {
    var clone = rowTemplate.content.cloneNode(true);
    var td = clone.querySelectorAll("td");
    for (var j = 0; j < list[i].sentences.length; j++) {
      td[j].innerHTML = list[i].sentences[j];
    }
    cloneEx.querySelector('tbody').appendChild(clone);
  }
  attach.appendChild(cloneEx);
}

function mainInit(list,attach) {
  var chapTemplate = document.querySelector('#chapter');
  var sectTemplate = document.querySelector('#section');
  var partTemplate = document.querySelector('#part');

  for (var i = 0; i < list.length; i++) {
    var clone = chapTemplate.content.cloneNode(true);
    var chapLink = document.createElement('a');
    chapLink.setAttribute('href', '#' + list[i].title.replace(/\s/g,'-'));
    chapLink.innerHTML = list[i].title;
    var chapLinkItem = document.createElement('li');
    chapLinkItem.appendChild(chapLink);
    document.querySelector('#chap-nav ol').appendChild(chapLinkItem);

    var article = clone.querySelector('article');
    var title = article.querySelector('h1');
    var abstract = article.querySelector('blockquote');
    var nav = article.querySelector('nav');

    article.setAttribute('id',list[i].title.replace(/\s/g,'-'));
    title.innerHTML = list[i].title;
    abstract.innerHTML = list[i].abstract;
    for (var j = 0; j < list[i].parts.length; j++) {
      var sect = list[i].parts[j];
      var item = document.createElement('li');
      var link = document.createElement('a');
      link.setAttribute('href','#' + sect.id);
      link.innerHTML = sect.name;
      item.appendChild(link);
      nav.querySelector('ol').appendChild(item);
    }

    for (var j = 0; j < list[i].parts.length; j++) {
      var sect = list[i].parts[j];
      var sectClone = sectTemplate.content.cloneNode(true);
      var sectBody = sectClone.querySelector('section');
      sectBody.setAttribute('id',sect.id);
      sectBody.querySelector('h2').innerHTML = sect.name;

      if (sect.parts) {
        for (var k = 0; k < sect.parts.length; k++) {
          var part = sect.parts[k];
          var partBody = document.createElement('div');
          partBody.setAttribute('class','part');
          if (part.name) {
            var partTitle = document.createElement('h3');            
            partTitle.innerHTML = part.name;
            partBody.appendChild(partTitle);
          }
          if (part.notes) {
            partBody.insertAdjacentHTML('beforeend',marked(part.notes));       
          }
          sectBody.appendChild(partBody);
        }
      }
      
      article.appendChild(sectClone);
    }

    
    attach.appendChild(clone);
  }
}
