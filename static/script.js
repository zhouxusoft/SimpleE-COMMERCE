const poncon = new Poncon()

poncon.setPageList(['login', 'registration'])

let currentpage = 'buyer'

$('#loginbutton').click(function () {
    $(this).addClass('chooseactive')
    $('#registrationbutton').removeClass('chooseactive')
})

$('#registrationbutton').click(function () {
    $(this).addClass('chooseactive')
    $('#loginbutton').removeClass('chooseactive')
})

poncon.start()

