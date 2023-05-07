let token = JSON.parse(localStorage.getItem("token"))
let globalcatagroies
let globalproduct

const poncon = new Poncon()

poncon.setPageList(['home', 'login', 'registration'])

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
        success: function (response) {
            //  console.log(response)
            if (response.success == true) {
                window.location.hash = ''
                $('#loginpage').css('display', 'none')
                $('#mainpage').css('display', 'block')
                alert('Login successful')
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
                token = JSON.parse(localStorage.getItem("token"))
                resetLoginBtn()
            } else {
                alert(response.message)
            }
        },
        error: function (error) {
            console.log(error)
        }
    })
})

function resetLoginBtn() {
    if (token) {
        $('#gotologin').text('Logout')
    } else {
        $('#gotologin').text('Login')
    }
}

resetLoginBtn()

$('#gotologin').click(function () {
    if ($('#gotologin').text() == 'Logout') {
        if (confirm("确定退出当前账号")) {
            localStorage.clear()
            token = JSON.parse(localStorage.getItem("token"))
            resetLoginBtn()
        }
    } else {
        window.location.hash = '#/login'
        $('#mainpage').css('display', 'none')
        $('#loginpage').css('display', 'block')
    }
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
        success: function (response) {
            alert(response.message)
        },
        error: function (error) {
            console.log(error)
        }
    });
})

function getNewInfo() {
    $.ajax({
        url: '/getinfo',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            globalcatagroies = response.catagories
            globalproduct = response.product
            // console.log(globalcatagroies)
            // console.log(globalproduct)
            resetCatagories()
            resetProductList()
        },
        error: function (error) {
            console.log(error)
        }
    })
}
getNewInfo()

function resetCatagories() {
    $('#addcatagroiesdatas').empty()
    for (let i = 0; i < globalcatagroies.length; i++) {
        $('#addcatagroiesdatas').html($('#addcatagroiesdatas').html() + `<tr><td class="allcatagroies" id="catagroies${globalcatagroies[i][0]}">${globalcatagroies[i][1]}</td></tr>`);
    }
}

function resetProductList() {
    let productlist = []
    for (let i = 0; i < globalproduct.length; i++) {
        if (globalproduct[i][11] == currentcatagroy || currentcatagroy == 0) {
            productlist.push(globalproduct[i])
        }
    }
    // console.log(productlist)
    resetProduct(productlist)
}

function resetProduct(productlist) {
    $('#allshopdatas').empty()
    if (productlist.length > 0) {
        for (let i = 0; i < productlist.length; i++) {
            let imglist = getImgList(globalproduct[i][2])
            if (imglist.length > 0) {
                $('#allshopdatas').html($('#allshopdatas').html() + `
                <div class="col-md-6 col-xl-4 col-xxl-3 databox mb-3">
                    <div class="shopdata" id="product${productlist[i][0]}">
                        <div class="shopinfos">
                            <div class="shopimgborder">
                                <div class="shopimg">
                                    <img src="../static/productimg/${imglist[0]}" alt="" width="100px">
                                </div>
                            </div>
                            <div class="shopinfoborder">
                                <div class="shopinfo">
                                    <div class="productname">${productlist[i][1]}</div>
                                    <div class="productprice">$${productlist[i][5]}</div>
                                </div>
                            </div>
                        </div>
                        <div class="shoplikes">
                            <div class="shoplike"><span class="shopfont">&#xf164</span>${productlist[i][7]}</div>
                            <div class="shopdislike"><span class="shopfont">&#xf165</span>${productlist[i][8]}</div>
                            <div class="shopcomment"><span class="shopfont">&#xf4ad</span>${productlist[i][9]}</div>
                        </div>
                    </div>
                </div>`)
            } else {
                $('#allshopdatas').html($('#allshopdatas').html() + `
                <div class="col-md-6 col-xl-4 col-xxl-3 databox mb-3">
                    <div class="shopdata" id="product${productlist[i][0]}">
                        <div class="shopinfos">
                            <div class="shopimgborder">
                                <div class="shopimg">
                                    No picture
                                </div>
                            </div>
                            <div class="shopinfoborder">
                                <div class="shopinfo">
                                    <div class="productname">${productlist[i][1]}</div>
                                    <div class="productprice">$${productlist[i][5]}</div>
                                </div>
                            </div>
                        </div>
                        <div class="shoplikes">
                            <div class="shoplike"><span class="shopfont">&#xf164</span>${productlist[i][7]}</div>
                            <div class="shopdislike"><span class="shopfont">&#xf165</span>${productlist[i][8]}</div>
                            <div class="shopcomment"><span class="shopfont">&#xf4ad</span>${productlist[i][9]}</div>
                        </div>
                    </div>
                </div>`)
            }
            
        }
    } else {
        $('#allshopdatas').html($('#allshopdatas').html() + `<div>No product</div>`)
    }
}

function getImgList (imgs) {
    let imglist = imgs.split('&')
    if (imglist[imglist.length - 1] === '') {
        imglist.pop()
    }
    if (imglist.length > 5) {
        imglist.splice(5)
    }
    return imglist
}

$('#addcatagroiesdatas').click(function (e) {
    catagroyid = $(e.target).attr('id')
    // console.log($(`#catagroies${catagroyid}`))
    // console.log($(e.target))
    if ($(e.target).hasClass('selected')) {
        $('.allcatagroies').removeClass('selected')
        $('.catagroiestitle').addClass('selected')
        currentcatagroy = 0
        resetProductList()
    } else {
        $('.catagroiestitle').removeClass('selected')
        $('.allcatagroies').removeClass('selected')
        $(e.target).addClass('selected')
        currentcatagroy = catagroyid.slice(10)
        resetProductList()
    }
    // console.log(currentcatagroy)
})

$('.catagroiestitle').click(function () {
    $('.allcatagroies').removeClass('selected')
    $('.catagroiestitle').addClass('selected')
    currentcatagroy = 0
    resetProductList()
})

$('#allshopdatas').click(function (e) {
    // console.log($(e.target).closest('.shopdata').attr('id'))
    if ($(e.target).closest('.shopdata').length) {
        if ($(e.target).hasClass('shoplike') || $(e.target).hasClass('shopfont')) {
            console.log('shoplike')
        }
        else if ($(e.target).hasClass('shopdislike') || $(e.target).hasClass('shopfont')) {
            console.log('shopdislike')
        }
        else if ($(e.target).hasClass('shopcomment') || $(e.target).hasClass('shopfont')) {
            console.log('shopcomment')
        } else {
            let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
            console.log(productid)
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == productid) {
                    let imglist = getImgList(globalproduct[i][2])
                    // console.log(imglist)
                    if (imglist.length > 0) {
                        $('.bigproductimg').html(`<img src="../static/productimg/${imglist[0]}" alt="" width="160px">`)
                    } else {
                        $('.bigproductimg').text(`No picture`)
                    }
                    $('.smallproductimgs').empty()
                    for (let i = 0; i < imglist.length; i++) {
                        $('.smallproductimgs').html($('.smallproductimgs').html() + `
                            <div class="smallproductimg" id="img${i}">
                                <img src="../static/productimg/${imglist[i]}" alt="" width="40px">
                            </div>
                        `)
                    }
                    $('.bigproductname').text(globalproduct[i][1])
                    $('.bigproductdescription').text(globalproduct[i][4])
                    $('.bigproductprice').text(`$${globalproduct[i][5]}`)
                    $('.productlike').html(`<span class="productfont">\uf164</span>${globalproduct[i][7]}`)
                    $('.productdislike').html(`<span class="productfont">\uf165</span>${globalproduct[i][8]}`)
                    $('.productcomment').html(`<span class="productfont">\uf4ad</span>${globalproduct[i][9]}`)
                    $('.smallproductimg').click(function (e) {
                        let imgid = e.currentTarget.id.slice(3)
                        // console.log(imgid)
                        $('.bigproductimg').html(`<img src="../static/productimg/${imglist[imgid]}" alt="" width="160px">`)
                    })
                    
                    break
                }
            }
            $('#productinfobtn').click()
            
        }
    }
})

$('#cartbtn').click(function () {
    if (token) {
        alert('8963')
    } else {
        alert('Please log in first')
    }
})

$('#likebtn').click(function () {
    if (token) {
        alert('4535')
    } else {
        alert('Please log in first')
    }
})

$('#centerbtn').click(function () {
    if (token) {
        alert('4959')
    } else {
        alert('Please log in first')
    }
})

$('#delbuynum').click(function () {
    let buynum = $('#buynum').val()
    buynum = parseInt(buynum)
    if (!isNaN(buynum)) {
        if (buynum > 1) {
            $('#buynum').val(buynum - 1)
        } else {
            $('#buynum').val(1)
        }
    } else {
        $('#buynum').val(1)
    }
})

$('#addbuynum').click(function () {
    let buynum = $('#buynum').val()
    buynum = parseInt(buynum)
    if (!isNaN(buynum)) {
        if (buynum > 0) {
            $('#buynum').val(buynum + 1)
        } else {
            $('#buynum').val(1)
        }
    } else {
        $('#buynum').val(1)
    }
})

poncon.start()

