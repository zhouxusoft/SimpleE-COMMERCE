const poncon = new Poncon()

poncon.setPageList(['login', 'registration'])

let currentkind = 'buyer'

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
            console.log(response)
            if (response.success == true) {
                alert('Login successful')
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
            } 
        },
        error: function(error) {
            console.log(error)
        }
    })
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
    console.log(currentkind)
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
            console.log(response)
        },
        error: function(error) {
            console.log(error)
        }
    });
})

poncon.start()

