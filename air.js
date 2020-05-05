var Airtable = require('airtable');

exports.base = getBase;
exports.examples = getEx;
exports.chapters = getChap;
exports.parts = hydrateElement;

async function getBase(key,base) {
  return new Airtable({apiKey: key}).base(base);
}

function getEx(base) {
  
  return new Promise(function(resolve, reject) {
    var cols = ['sent 1', 'sent 2', 'sent 3', 'sent 4', 'sent 5'];
    var glossData = [];

    console.log('Airtable data being acquired');

    base('Examples').select({
      view: 'Grid view'
    }).eachPage(function page(records, fetchNextPage) {
        records.forEach(function(record) {
          var temp = [];            
          for (var i = 0; i < cols.length; i++) {
            temp.push(record.get(cols[i]));
          }
          glossData.push(temp);
        });

        fetchNextPage();

    }, function done(err) {
        if (err) {
          reject(Error("Error gathering data from Airtable: ",err));
        } else {
          console.log("Example data acquired!",glossData.length,'records');
          resolve(glossData);
        }
    });

  });
}

function getChap(base) {
  var sectData = [];
  
  return new Promise(function(resolve, reject) {

    console.log('Airtable data being acquired');

    base('Chapters').select({
      view: 'Grid view'
    }).firstPage(function(err, records) {
      if (err) { console.error(err); return; }
      records.forEach(function(record) {
        var temp = {};
        temp['title'] = record.get('Title');
        temp['abstract'] = record.get('Abstract'); 
        temp['parts'] = record.get('Parts');
        sectData.push(temp);  
      });
      console.log("Chapter data acquired!",sectData.length,'records');
      resolve(sectData);
    });
  });
}

async function hydrateElement(base,element,type) {
  if (!element.parts) return element;
  let partIds = element.parts;
  let partDetails = [];
  for (var i = 0; i < partIds.length; i++) {
    partDetails.push(await getPartById(base,partIds[i],type));
  }
  element.parts = partDetails;
  return element;
}

function getPartById(base,id,type) {
  var detail = {};
  return new Promise(function(resolve,reject) {
    base(type).find(id, function(err, record) {
      if (err) { console.error(err); return; }
      detail.id = id; 
      detail.name = record.get('Name');
      if (record.get('Parts')) detail.parts = record.get('Parts'); 
      detail.notes = (record.get('Notes')) ? record.get('Notes') : 'Nothing to show here';
      resolve(detail);
    });
  });
}
