const poncon = new Poncon()
console.log(poncon)

poncon.setPageList(['loginpage', 'registrationpage'])

let currentpage = 'loginbuyer'

$('#loginbutton').click(function () {
    $(this).addClass('chooseactive')
    $('#registrationbutton').removeClass('chooseactive')
    console.log(66);
})

$('#registrationbutton').click(function () {
    $(this).addClass('chooseactive')
    $('#loginbutton').removeClass('chooseactive')
})

poncon.start()

