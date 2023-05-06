let token = JSON.parse(localStorage.getItem("token"))
let globalcatagroies
let globalproduct

const poncon = new Poncon()

poncon.setPageList(['login', 'registration'])

let currentkind = 'buyer'
let currentcatagroy = 0

$('#loginbutton').click(function () {
    $(this).addClass('chooseactive')
    $('#registrationbutton').removeClass('chooseactive')
})

$('#registrationbutton').click(function () {
    $(this).addClass('chooseactive')
    $('#loginbutton').removeClass('chooseactive')
})

$('#loginenterbutton').click(function () {
    let loginname = $('#input-username-login').val()
    let loginpassword = $('#input-password-login').val()
    let kinds = $('input[name="option"]:checked').val()
    if (kinds == 'option1') {
        currentkind = 'buyer'
    } else {
        currentkind = 'vendor'
    }
    console.log(currentkind)
    let toSend = {
        name: loginname,
        password: loginpassword,
        kinds: currentkind
    }
    $.ajax({
        url: '/login',
        type: 'POST',
        data: JSON.stringify(toSend),
        contentType: 'application/json',
        success: function(response) {
            //  console.log(response)
            if (response.success == true) {
                $('#loginpage').css('display', 'none')
                $('#mainpage').css('display', 'block')
                alert('Login successful')
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
                token = JSON.parse(localStorage.getItem("token"))
            } else {
                alert(response.message)
            }
        },
        error: function(error) {
            console.log(error)
        }
    })
})

$('#gotologin').click(function () {
    $('#mainpage').css('display', 'none')
    $('#loginpage').css('display', 'block')
})

$('#registrationcreatebutton').click(function () {
    let registrationname = $('#input-username-registration').val()
    let registrationpassword = $('#input-password-registration').val()
    let registrationaddress = $('#input-address-registration').val()
    let registrationemail = $('#input-email-registration').val()
    let registrationphone = $('#input-phone-registration').val()
    let kinds = $('input[name="option"]:checked').val()
    if (kinds == 'option1') {
        currentkind = 'buyer'
    } else {
        currentkind = 'vendor'
    }
    // console.log(currentkind)
    let toSend = {
        name: registrationname,
        password: registrationpassword,
        address: registrationaddress,
        email: registrationemail,
        phone: registrationphone,
        kinds: currentkind
    }
    $.ajax({
        url: '/registration',
        type: 'POST',
        data: JSON.stringify(toSend),
        contentType: 'application/json',
        success: function(response) {
            alert(response.message)
        },
        error: function(error) {
            console.log(error)
        }
    });
})

function getNewInfo () {
    $.ajax({
        url: '/getinfo',
        type: 'POST',
        contentType: 'application/json',
        success: function(response) {
            globalcatagroies = response.catagories
            globalproduct = response.product
            console.log(globalcatagroies)
            console.log(globalproduct)
            resetCatagories ()
        },
        error: function(error) {
            console.log(error)
        }
    });
}

function resetCatagories () {
    for (let i = 0; i < globalcatagroies.length; i++) {
        $('#addcatagroiesdatas').html($('#addcatagroiesdatas').html() + `<tr><td class="allcatagroies" id="catagroies${globalcatagroies[i][0]}">${globalcatagroies[i][1]}</td></tr>`);
    }
}

$('#addcatagroiesdatas').click(function (e) {
    catagroyid = $(e.target).attr('id')
    currentcatagroy = catagroyid.slice(-2)
    console.log($(`#catagroies${catagroyid}`))
    console.log($(e.target))
    $('.allcatagroies').removeClass('selected')
    if ($(e.target).hasClass('selected')) {
        currentcatagroy = 0
    }
    $(e.target).addClass('selected')
    
})

getNewInfo()

poncon.start()

