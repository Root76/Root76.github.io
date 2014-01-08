App.ApplicationAdapter = DS.RESTAdapter.extend({
    host: 'http://localhost:3000',
    headers: { 
        'X-AUTHENTICATION-TOKEN': 'hYDV_SEzzs1ybT71GpT5',
        'X-AUTHENTICATION-EMAIL': 'bonner.jp@gmail.com'
    },
});

App.Store = DS.Store.extend({
    adapter:  App.ApplicationAdapter.create()
});