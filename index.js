var express = require("express");
var path = require("path");
request = require('request-json');
var app = express();
var postsFile = require('./data/posts.json');
var pagesFile = require('./data/pages.json');
const instagramPosts = require('instagram-posts');
app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'))

// Dit is de route naar de homepage.
// Let erop hoe ik hier de blogposts uit de datafile de ejs-view binnensmokkel
app.get('/', function(req, res) {
  res.render("index", {
    posts: postsFile.blogposts
  });
});

// Dit is de route naar de instagram pagina.
app.get('/instagram', function(req, res) {
  instagramPosts('surfsumo').then(afbeeldingen => {
console.log(afbeeldingen);
      res.render("instagram", {
        afbeeldingen: afbeeldingen
      });
  });
});


// Dit is de route naar de view om een individuele pagina te tonen
// Zie vorige comment over het gebruik van regular expressions
// Jullie mogen hier gerust een ID gebruiken
app.get(/\/(.*)/, function(req, res) {
  var slug = req.params[0];
  var teller = 0;
  var page = "";
  while (teller < pagesFile.pages.length ) {
    if (pagesFile.pages[teller].slug === slug) {
      page = pagesFile.pages[teller];
    }
    teller++;
  }
  if (page !== "") {
    res.render("page", {
      page: page
    });
  } else {
    res.render("404", {});
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
