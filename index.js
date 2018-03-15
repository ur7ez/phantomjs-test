const phantom = require('phantom');
let _ph, _page;

phantom
    .create()
    .then(ph => {
        _ph = ph;
        return _ph.createPage();
    })
    .then(page => {
        _page = page;
        return _page.open('https://www.reddit.com/r/ProgrammerHumor/');
    })
    .then(status => {
        console.log(status);
        return _page.evaluate(function () {
            // noinspection ES6ConvertVarToLetConst
            var array = [];
            $('.thing').each(function () {
                // noinspection ES6ConvertVarToLetConst
                var title = $(this).find('a.title').text();
                // noinspection ES6ConvertVarToLetConst
                var likes = $(this).find('.score.unvoted').attr('title');
                array.push({
                    title: title,
                    likes: likes
                });
            });
            return array;
        })
    })
    .then(array => {
        array = array.map(function (x) {
            if (x.likes === undefined) x.likes = 0;
            x.likes = parseInt(x.likes);
            return x;
        });
        array = array.sort((a, b) => a.likes - b.likes);
        console.log(array);
        _page.close();
        _ph.exit();
    })
    .catch(e => console.log(e));