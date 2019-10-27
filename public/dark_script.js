$('#switch').on('click', () => {
    if ($('#switch').prop('checked')) {
        $('.wrapper').addClass('dark');
        $('.wrapper').addClass('white');
    } else {
        $('.wrapper').removeClass('dark');
        $('.wrapper').removeClass('white');
    }
});