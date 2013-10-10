var Translation = (function() {


    var t = {
        _id_eng: '3',
        _id_rus: '2',
        _data: {}
    };
    t.get = function(name) {
        return (t._data[DataManager.getLang()] || t._data[t._id_eng])[name];
    };

    t._data[t._id_eng] = {
        'home': 'Home',
        'movie': 'Movies',
        'opera': 'Soap Opera',
        'cartoon': 'Cartoons',
        'tv': 'TV & Shows',
        'news': 'News',
        'seetings': 'Settings'
    };
    t._data[t._id_rus] = {
        'home': 'Home',
        'movie': 'Movies',
        'opera': 'Soap Opera',
        'cartoon': 'Cartoons',
        'tv': 'TV & Shows',
        'news': 'News',
        'seetings': 'Settings'
    };

    return t;
})();

