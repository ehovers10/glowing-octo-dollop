var express = require('express');
var router = express.Router();
var ListEm = require('../air.js');
var Build = require('../builder.js');

var config = {
      title: "Discourse as Collaborative Inquiry",
      assets: [
        {
          type: 'style',
          url: "/css/style.css"
        },{ 
          type: 'script',
          url: "https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"
        },{
          type: 'script',
          url: "/js/main.js"
        },{
          type: 'script',
          url: 'https://cdn.jsdelivr.net/npm/marked/marked.min.js'
        }/*,{
          type: 'script',
          url: 'https://kit.fontawesome.com/a6b5fe2a26.js'
        }*/
      ]
    };

const airData = {
        apiKey: 'keyfU67GsYwqe3dgG',
        baseId: "appi1XzlXxiSkuLHI"
      };

var ordList = "";
var chapData = "";

ListEm.base(airData.apiKey,airData.baseId)
  .then(function(base) {
    ListEm.examples(base).then(function(exList) {
      ordList = Build.data(Build.order(Build.fix(exList)));
    }, function(error) {
    console.error("Page build failure: ", error);
    });
    ListEm.chapters(base).then(async function(chapList) {
      var hydratedChapters = [];
      for (var i = 0; i < chapList.length; i++) {
        hydratedChapters.push(await ListEm.parts(base,chapList[i],'Sections'));
      }
      console.time('Chapters hydrated');
      return hydratedChapters;
    }, function(error) {
      console.error("Page build failure: ", error);
    }).then(async function(chapList) {
      for (var i = 0; i < chapList.length; i++) {
        if (chapList[i].parts) {
          var hydratedSections = [];
          for (var j = 0; j < chapList[i].parts.length; j++) {
            hydratedSections.push(await ListEm.parts(base,chapList[i].parts[j],'Parts'));
          }
          chapList[i].parts = hydratedSections;
        }
      }
      chapData = Build.data(chapList);
      console.time('Sections hydrated');
      return chapData;
    }).then(function() {
      console.log('Page ready to go');
    });
  })
  .then(function(response) {
    router.get('/', function(req, res, next) {
      res.render('index', { config, ordList, chapData });
    });
  }, function(error) {
    console.error("Page render failure: ", error);
  });

module.exports = router;
