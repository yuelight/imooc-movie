$(function() {
    $('.del').click(function(e) {
        var target = $(e.target);
        var id = target.data('id');
        var tr = $('.item-id-' + id);
        $.ajax({
                url: '/admin/movie/list?id=' + id,
                type: 'DELETE'
            })
            .done(function(result) {
                if (result.success === 1) {
                    if (tr.length > 0)
                        tr.remove();
                }
            });
    });

    $('#douban').blur(function () {
        var douban = $(this);
        var id = douban.val();

        if (id) {
            $.ajax({
                url: 'https://api.douban.com/v2/movie/subject/' + id,
                cache: true,
                type: 'GET',
                dataType: 'jsonp',
                crossDomain: true,
                jsonp: 'callback'
            })
            .done(function(data) {
                $('#inputTitle').val(data.title);
                $('#inputDoctor').val(data.directors[0].name);
                $('#inputCountry').val(data.countries[0]);
                $('#inputPoster').val(data.images.large);
                $('#inputYear').val(data.year);
                $('#inputSummary').val(data.summary);
            })
            .fail(function() {
                console.log("error");
            })
            .always(function() {
                console.log("complete");
            });
        }
    });

})
