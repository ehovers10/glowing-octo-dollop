exports.glossary = glossary;
exports.stuff = stuff;
exports.data = data;
exports.fix = fixList;
exports.order = organizeList;
exports.mail = mail;
exports.accountBlock = accountBlock;

function data(list) {
  return JSON.stringify(list);
}
function fixList(list) {
  for (var i = 0; i < list.length; i++) {
    for (var j = 0; j < list[i].length; j++) {
      list[i][j] = (typeof list[i][j] == 'undefined') ? '<i class="fas fa-question-circle"></i>' : list[i][j];
    }
  }
  return list;
}

function getId(spot) {
  var parts = spot.split('.');
  var cid = 'c';
  for (var k = 0; k < parts.length; k++) {
    var temp = (parseInt(parts[k]) < 10) ? '0' + parts[k] : parts[k];
    cid += temp;
  }
  return cid;
}

function organizeList(list) {
  var chapters = [];
  var zeroPad = '0';
  var zeroCount = 3 - Math.ceil(Math.log10(list.length));

  for (var j = 0; j < list.length; j++) {
    var num = j + 1;
    var exid = 'ex' + zeroPad.repeat(zeroCount) + num;
    chapters.push({"id": exid, "sentences": list[j]});
  }

  return chapters;
}
function organizeList(list) {
  var chapters = [];
  var zeroPad = '0';
  var zeroCount = 3 - Math.ceil(Math.log10(list.length));

  for (var j = 0; j < list.length; j++) {
    var num = j + 1;
    var exid = 'ex' + zeroPad.repeat(zeroCount) + num;
    chapters.push({"id": exid, "sentences": list[j]});
  }

  return chapters;
}

function sortParts(parts) {
  return parts.sort(function(a,b) {
        if (a.number && b.number) {
          if (a.number < b.number) {
            return -1;
          } 
          if (b.number < a.number) {
            return 1;
          }
        }
        return 0;  
      });
}

function glossary(list,lang) {
  var check = [];
  var gloss = "";

  for (var i = 0; i < list.length; i++) {
    if (check.includes(list[i].two)) {
      continue;
    } else {
      gloss += '<div class="row">';
      for (var j = 0; j < lang.length; j++) {
        switch (typeof list[i][lang[j].num]) {
          case 'undefined':
            var sortSnippet = 'zz';
            break;
          case 'object':
            var sortSnippet = list[i][lang[j].num][0].toLowerCase().substring(0,5);
            break;
          case 'string':
            var sortSnippet = (list[i][lang[j].num].substring(0,1) == '<') ? 'zy' : list[i][lang[j].num].toLowerCase().substring(0,5);
            break;
          default:
            var sortSnippet = 'zz';
        }
        gloss += `<div class="element" data-language="${lang[j].name}" data-sort="${sortSnippet}"><span class="type">${lang[j].name}</span><span class="value">${list[i][lang[j].num]}</span></div>`;
      }
      gloss += '</div>';
      check.push(list[i].two);
    }
  }
  console.log("Glossary filtered!",check.length,'entries');
  return gloss;
}

function stuff(list,words) {
  var body = '';

  var orgList = organizeList(list);
  //orgList = sortParts(orgList);
  for (var i = 0; i < orgList.length; i++) {
    body += `<div class="chapter"><div class="chapter-title" data-chapter="${orgList[i].number}">${orgList[i].number}</div>`;
       
    var theTerms = orgList[i].terms;
    body += '<div class="terms">';
    for (var k = 0; k < theTerms.length; k++) {
      var word = '';
      var cid = theTerms[k].id;
      for (var w = 0; w < words.length; w++) {
        word += '<span class="text hide" data-language="' + words[w] + '">' + theTerms[k][words[w]] + '</span>';
      }

      var info = '<div class="info-box"><a href="#" onclick="return false" class="comment close"><i class="fas fa-window-close"></i></a>';
      for (var item in theTerms[k]) {
        if (item != 'id') {
          info += `<div class="info-group" data-element="${item}"><div class="title">${item}</div><div class="info">${theTerms[k][item]}</div></div>`;
        }
      }
      info += '</div>';

      body += '<span class="word">' + 
        `<a href="#" onclick="return false" id="${cid}" class="tooled note">` + word + '</a>' +
        `<div id="${cid}-tip" class="tooltip hide">` + info + '</div>' +
      '</span>';
    } 
    body += '</div></div>';    
  }

  return body;
}

function mail(submissions,notes) {
  var body = '<table>';
  var site = 'https://betsys-dao.herokuapp.com/';
  var bits = ['Number','Original','Submission'];
  
  //body += makeRow('head','Email') + makeRow('body',email);
  body += makeRow('head','Notes') + makeRow('body',notes);
  body += makeRow('head','Translations');

  var subBody = '<tr><td><table><tr>';
  for (var j = 0; j < bits.length; j++) {
    subBody += '<td style="font-weight:bold;">' + bits[j] + '</td>';
  }
  subBody += '</tr>';
  for (var i = 0; i < submissions.length; i++) {
    subBody += makeSubRow(submissions[i].spot,submissions[i].originalTrans,submissions[i].userTrans);
  }
  subBody += '</table></td></tr>';

  return '<table>' + body + subBody + '</table>'

  function makeRow(type,inside) {
    var style = (type == 'head') ? 'text-align:center;font-weight:bold;' : 'text-align:center;';
    return '<tr><td style="' + style + '">' + inside + '</td></tr>';
  }
  function makeSubRow(num,orig,trans) {
    var cid = getId(num);
    var idCol = '<td style="text-align:center;"><a href="' + site + '#' + cid + '">' + num + '</a></td>';
    var origCol = '<td style="text-align:center;">' + orig + '</td>';
    var transCol = '<td style="text-align:center;">' + trans + '</td>';
    return '<tr>' + idCol + origCol + transCol + '</tr>';
  }
}

function accountBlock() {
  var infoStart = '<div class="info-box"><a href="#" onclick="return false" class="comment close"><i class="fas fa-window-close"></i></a>';
  // User actions
  var block = '<div class="user-actions">' + 
                '<div class="title">Your Translations</div>' +
                '<a href="#" class="btn action" data-action="view">View Your Translations</a>' +
                '<a href="#" class="btn action" data-action="pick">Term Picker</a>' +
                '<a id="submit" href="#submit" class="btn tooled">Submit Your Translations</a>' +
                `<a id="about" href="#about" class="btn tooled">About Betsy's Dao</a>` +
              '</div>'; 

  // Term picker
  block += '<div class="term-picker user-tool" data-tool="pick"><div class="picker">';
  var list = ['Chapter','Term'];  
  for (var i = 0; i < list.length; i++) {
    block +=  '<div class="level" data-level="' + list[i] + '">' +
                '<div class="name">' + list[i] + '</div>' +
                '<div class="count">' +
                  '<a class="counter minus" href="#"><i class="fas fa-minus"></i></a>' +
                  '<div class="value"><span class="number">1</span><span class="total"></span></div>' +
                  '<a class="counter plus" href="#"><i class="fas fa-plus"></i></a>' +
                '</div>' +
                '<input class="slider" type="range" min="1" value="1" />' +
              '</div>';
  }
  block +=  '</div><div class="term-set">' + 
              '<div class="term"></div>' + 
              '<a id="add" href="#add" class="btn tooled">Add your own</a>' +
            '</div></div>';

  // User translations
  block += '<div class="trans-list user-tool" data-tool="view"><div class="user-translations"></div></div>';   

  // Add translation
  block +=  '<div id="add-tip" class="tooltip hide">' + infoStart +
              '<div class="title">Insert Your Translation</div>' +
              '<div class="changer"><span class="icon"><i class="fas fa-book"></i></span><textarea class="input enter" rows="3" name="enter" placeholder="Your translation"></textarea></div>' +
              '<div class="picker"><a class="btn icon inject" href="#"><i class="fas fa-plus"></i><span>Add</span></a></div>' +
            '</div></div>';

  // Submit Translations
  block +=  '<div id="submit-tip" class="tooltip hide">' + infoStart + 
              '<div class="title">Submit your translations for review</div>' +
              '<div class="submit-status">' +
                '<div class="confirm hide"></div>' +
                '<div class="working hide">' +
                  '<i class="fas fa-paper-plane"></i>' +
                  '<div class="notice animate"><span class="rise1">Se</span><span class="rise2">nd</span><span class="rise3">ing</span><span class="rise4">...</span></div>' +
                '</div>' +
              '</div>' +
              '<form class="translation-form" method="post">' +
                '<div class="changer"><span class="icon"><i class="fas fa-align-left"></i></span><textarea class="input enter" rows="3" name="notes" placeholder="Include a note"></textarea></div>' +
              '</form>' +
              '<div class="picker"><a class="btn icon send" href="#"><i class="fas fa-paper-plane"></i><span>Submit</span></a></div>' +
            '</div></div>';

  // About
  block += '<div id="about-tip" class="tooltip hide">' + infoStart +
              `<div class="title">Betsy's Dao</div>` +
              '<p>This site lets you explore my translation of the Dao De Ching.</p>' +
            '</div></div>';

  return block;
}

