$.i18n = function(options){
    options = $.extend({}, {
        lang: 'tr',
        data: $.i18n,
        sliceLang: false
    }, options);

    var langStore = langStore || {},
        lang = options.lang.indexOf('-') < 0 && !options.sliceLang ? options.lang : options.lang.slice(0, 2);

    if( typeof options.data !== 'string' ){
        langStore = options.data[lang];
    } else {
        var urlParts = options.data.match(/(.*)[\/\\]([^\/\\]+)\.(\w+)$/);
        $.ajax({
            url: urlParts[1] + '/' + lang + '.' + urlParts[3],
            dataType: "json", 
            success: function(data) {
                // console.log(data)
                langStore = data;
            },
            error: function(error) {
                console.log(error);
                $.getJSON(urlParts[1] + '/' + lang + '.' + urlParts[3], function(data) {
                    langStore = data;
                });
            }
        });
    }

    var storeData = function(data){
        if(!data) return;
        if(window.localStorage) {
            localStorage.setItem( "langStore", JSON.stringify(data) );
            langStore = data;          
        } else {
            langStore = data;
        }
    };

    if(window.localStorage) {
        var localLangStore = localStorage.getItem("langStore");
        storeData( localLangStore !== null ? JSON.parse(localLangStore) : langStore);
    } else {
        storeData( langStore );
    }

    this.getLang = function(){ return lang; };
    this.setLang = function(l){ lang = l; storeData(options.data[l]); };

    this.getItem = function(key){ return langStore[key]; };
    this.setItem = function(key, value){ options.data[lang][key] = value; storeData(langStore); };

    return this;
};

$.i18n.en = {
    home: 'Home',
    about: 'About',
    services: 'Services',
    simple_content: 'This is a clean and modern HTML5 template with a video background. You can use this layout for your profile page. Please spread a word about templatemo to your friends. Thank you.'
};

$.i18n.tr = {
    home: 'Ana Sayfa',
    about: 'Hakkımızda',
    services: 'Servisler',
    simple_content: 'Bu, video arka planı olan temiz ve modern bir HTML5 şablonu. Bu düzeni profil sayfanız için kullanabilirsiniz. Lütfen arkadaşlarınıza templatemo hakkında bir şeyler söyleyin. Teşekkür ederim.'
};

$.i18n.ru = {
    home: 'дома',
    about: 'о нас',
    services: 'Сервисы',
    simple_content: 'Это чистый и современный шаблон HTML5 с видео-фоном. Вы можете использовать этот макет для страницы своего профиля. Расскажите, пожалуйста, друзьям о шаблоне. Спасибо.'
}

var i18n = $.i18n();

var changeLabels = function(){
    $('.changeLabels').each(function(){
        var forLabel = $(this).attr('for');
        this.innerText = i18n.getItem(forLabel);
    });
};
changeLabels();

$('#lang').find('a').click(function(e){
    var lang = this.href.slice(-2);
    i18n.setLang(lang);

    changeLabels();
    e.preventDefault();
});