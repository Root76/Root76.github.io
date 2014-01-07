var authToken;
var userEmail;

function QueryStringToJSON() {            
    var pairs = location.search.slice(1).split('&');
    var result = {};
    pairs.forEach(function(pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
    return JSON.parse(JSON.stringify(result));
}

var query_string = QueryStringToJSON();

authToken = query_string.authentication_token;
userEmail = query_string.user_email;

App.ApplicationAdapter = DS.RESTAdapter.extend({
  host: 'https://ec2-54-204-113-9.compute-1.amazonaws.com/',
  headers: {
    "X-AUTHENTICATION-TOKEN": authToken,
    "X-AUTHENTICATION-EMAIL": userEmail
  }
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});