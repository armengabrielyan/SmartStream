var DataManager = {
    svc: {
        url: 'http://test2.bigbrain.am/service/server.php',
        purchaseUrl: 'http://test2.bigbrain.am/ajax/front?sec=purchase',
        key: 'ef7978fe-2c3f-4b51-a849-7417b22ab997'
    },
    images: {
        path: 'http://test2.bigbrain.am/menus_images/',
        moviePath:'http://test2.bigbrain.am/files_menus_pics/'
    },
    /**
     * 
     * @param {type} f
     * @param {type} mode 1-apple, 2-mobile, 0-others
     * @returns {unresolved}
     */
    getStreamURL:function(f, mode){
        mode = mode || 0;
    	var p = jQuery('<div/>').html(f).text().split('/');
        if(mode == 1){
            p.pop();
            var fname = p.pop().replace('mp4', 'smil');
            p.push(fname);
        	p.push(-1,1,'playlist.m3u8');
        } else if(mode == 2) {
            p.pop();
            var fname = p.pop().replace('.mp4', 'mov');
            p.push(fname);
        } else {
        	p.splice(-1,1,'playlist.m3u8|COMPONENT=HLS');
        }
    	console.log(p)
    	return p.join('/');
    },
    lang: '3', // eng
    user: null,
    storage: {movies:{}},
    currThumbsData: [],
    currThumbsPage: 1,
    thumbPerPage: 12,
    thumbPerRow: 4,
    
    config:{
        homeId:-1,
        settingsId:-2
    }
};

DataManager.getLang = function() {
    return this.lang;
};

DataManager.mainMenu = [
    {uid: DataManager.config.homeId, id: 'home', subs: [], title: Translation.get('home')},
    {uid: 100, id: 'films', subs: [], title: Translation.get('movie')},
    {uid: 101, id: 'soapoperas', subs: [], title: Translation.get('opera')},
    {uid: 102, id: 'multfilms', subs: [], title: Translation.get('cartoon')},
    {uid: 103, id: 'transfer-show', subs: [], title: Translation.get('tv')},
    {uid: 10, id: 'news', subs: [], title: Translation.get('news')},
    {uid: DataManager.config.settingsId, id: 'seetings', subs: [], title: Translation.get('seetings')}
];

DataManager.getMainMenu = function() {
    var menuArr = [];
    for (var i = 0; i < this.mainMenu.length; i++) {
        menuArr.push(this.mainMenu[i].title);
    }
    return menuArr;
};

DataManager.initSubMenus = function() {

    $.ajax({
        url: DataManager.svc.url,
        type: 'GET',
        data: {
            method: 'getmenus',
            lang_id: DataManager.lang,
            guid: DataManager.svc.key
        },
        dataType: 'json',
        success: function(data) {
            if (!data)
                return;
            for (var i = 0; i < DataManager.mainMenu.length; i++) {
                var parent = DataManager.mainMenu[i].uid;
                var subsInfoArr = data[parent] || [];
                if (!subsInfoArr)
                    continue;
                for (var k = 0; k < subsInfoArr.length; k++) {
                    var subsInfo = subsInfoArr[k];
                    var sub = {
                        uid: subsInfo.id,
                        menu_type: subsInfo.menu_type,
                        title: subsInfo.name,
                        uri: subsInfo.uri
                    };
                    DataManager.mainMenu[i].subs.push(sub);
                }
            }
        }
    });
};

DataManager.createResponse = function(data) {
    if (data) {
        return {_ok: true, data: data};
    } else {
        return {_ok: false, data: null};
    }
};
DataManager.responseOk = function(data) {
    if (data.hasOwnProperty('_ok')) 
        return data._ok;
    return !!data;
};

DataManager.getMovies = function(catId, cb) {
    if(DataManager.storage.movies[catId]){
        cb(DataManager.createResponse(DataManager.storage.movies[catId]));
        //console.log('from cache', DataManager.storage.movies[catId]);
        return;
    }
    $.ajax({
        url: DataManager.svc.url,
        type: 'GET',
        data: {
            method: 'getAll_categories',
            lang_id: DataManager.lang,
            guid: DataManager.svc.key,
            id: catId
        },
        dataType: 'json',
        success: function(data) {
            var r = DataManager.createResponse(data);
            if(r._ok){
                DataManager.storage.movies[catId] = r.data;
            }
            //console.log('Movies loaded ', r, DataManager.storage.movies);
            cb(r);
        }
    });

};

DataManager.getMovie = function(id, cb) {
    $.ajax({
        url: DataManager.svc.url,
        type: 'GET',
        data: {
            method: 'getfilmdata',
            lang_id: DataManager.lang,
            guid: DataManager.svc.key,
            id: id
        },
        dataType: 'json',
        success: function(data) {
            var r = DataManager.createResponse(data);
           // console.log('Movie loaded ', r, DataManager.storage.movies);
            cb(r);
        }
    });
};

DataManager.getMovieStream = function(movie, cb) {
    $.ajax({
        url: DataManager.svc.url,
        type: 'GET',
        data: {
            method: 'getfilm',
            guid: DataManager.svc.key,
            text: movie.uri
        },
        dataType: 'json',
        success: function(data) {
            var r = DataManager.createResponse(data);
          //  console.log('Movie loaded ', r, DataManager.storage.movies);
            cb(r);
        }
    });
};

DataManager.getMoviePurchased = function(movie, sessid, cb) {
    $.ajax({
        url: DataManager.svc.purchaseUrl,
        type: 'POST',
        data: {
            p: movie.id,
			SESSID:sessid
        },
        /*headers :{
            Cookie:'PHPSESSID='+sessid
        },*/
        dataType: 'json',
        success: function(data) {
            var r = DataManager.createResponse(data);
            console.log('getMoviePurchased', r);
            cb(r);
        }
    });
};

DataManager.getMovieImages = function(movie, cb) {
    $.ajax({
        url: DataManager.svc.url,
        type: 'GET',
        data: {
            method: 'getfilmimages',
            guid: DataManager.svc.key,
            text: movie.uri
        },
        dataType: 'json',
        success: function(data) {
            var r = DataManager.createResponse(data);
            if(r._ok){
                for(var i=0; i<data.length; i++){
                    data[i].url = DataManager.images.moviePath + data[i].image;
                }
            }
          //  console.log('Images loaded ', r, DataManager.storage.movies);
            cb(r);
        }
    });
};


DataManager.login = function(user, pass, cb) {
    $.ajax({
        url: DataManager.svc.url,
        type: 'GET',
        data: {
            method: 'login_client',
            guid: DataManager.svc.key,
            username: user,
            pass_hash: pass
        },
        dataType: 'json',
        success: function(data) {
            var r = DataManager.createResponse(data);
            if(r._ok){
                for(var i=0; i<data.length; i++){
                    data[i].url = DataManager.images.moviePath + data[i].image;
                }
            }
            //console.log('Images loaded ', r, DataManager.storage.movies);
            cb(r);
        }
    });
};