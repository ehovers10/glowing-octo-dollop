$(document).ready( function() {
  var exListText = $("#dlist").text().trim();
  var exList = JSON.parse(exListText);
  var chapListText = $("#clist").text().trim();
  var chapList = JSON.parse(chapListText);

  tableInit(exList);
  mainInit(chapList);

  $('#dlist').remove();
  $('#clist').remove();
});

function tableInit(list) {
  var table = document.querySelector('#examples').lastChild;
  var template = document.querySelector('#example-row');

  for (var i = 0; i < list.length; i++) {
    var clone = template.content.cloneNode(true);
    var td = clone.querySelectorAll("td");
    for (var j = 0; j < list[i].sentences.length; j++) {
      td[j].innerHTML = list[i].sentences[j];
    }
    table.appendChild(clone);
  }
}

function mainInit(list) {
  var main = document.querySelector('#chapters');
  var template = document.querySelector('#chapter');
  for (var i = 0; i < list.length; i++) {
    var clone = template.content.cloneNode(true);

    var article = clone.querySelector('article');
    var title = article.querySelector('h1');
    var abstract = article.querySelector('blockquote');
    var nav = article.querySelector('nav');

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

    var sectTemplate = document.querySelector('#section');
    for (var j = 0; j < list[i].parts.length; j++) {
      var sect = list[i].parts[j];
      var sectClone = sectTemplate.content.cloneNode(true);
      var sectBody = sectClone.querySelector('section');
      sectBody.setAttribute('id',sect.id);
      sectBody.querySelector('h2').innerHTML = sect.name;

      if (sect.parts) {
        partTemplate = document.querySelector('#part');
        for (var k = 0; k < sect.parts.length; k++) {
          var part = sect.parts[k];
          var partClone = partTemplate.content.cloneNode(true);
          var partBody = partClone.querySelector('.part');
          partBody.querySelector('h3').innerHTML = part.name;
          if (part.notes) {
            var partContent = document.createElement('div');
            partContent.innerHTML = part.notes;            
            partBody.appendChild(partContent);
          }

          sectBody.appendChild(partClone);
        }
      }
      
      article.appendChild(sectClone);
    }

    
    main.appendChild(clone);
  }
}
