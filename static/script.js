let token = JSON.parse(localStorage.getItem("token"))
let globalcatagroies
let globalproduct
let globalcomment
let globallike = []
let globaldislike = []
let currentproductid

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
    // console.log(currentkind)
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
    })
})

function getNewInfo() {
    $.ajax({
        url: '/getinfo',
        type: 'POST',
        contentType: 'application/json',
        success: function (response) {
            globalcatagroies = response.catagories
            globalproduct = response.product
            globallike = []
            globaldislike = []
            for (let i = 0; i < response.like.length; i++) {
                if (response.like[i][3] == token.id) {
                    globallike.push(response.like[i])
                }
            }
            for (let i = 0; i < response.dislike.length; i++) {
                if (response.dislike[i][3] == token.id) {
                    globaldislike.push(response.dislike[i])
                }
            }
            globalcomment = response.comment
            // console.log(globalcatagroies)
            // console.log(globalproduct)
            // console.log(globallike)
            // console.log(globaldislike)
            // console.log(globalcomment)

            resetCatagories()
            resetProductList()

            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == currentproductid) {
                    resetProductInfo(globalproduct[i])
                    break
                }
            }
            resetComment(getProductComment(currentproductid))
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
            let imglist = getImgList(productlist[i][2])
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
                            <div class="shoplike"><span class="shopfont likefont">&#xf164</span>${productlist[i][7]}</div>
                            <div class="shopdislike"><span class="shopfont dislikefont">&#xf165</span>${productlist[i][8]}</div>
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
                            <div class="shoplike"><span class="shopfont likefont">&#xf164</span>${productlist[i][7]}</div>
                            <div class="shopdislike"><span class="shopfont dislikefont">&#xf165</span>${productlist[i][8]}</div>
                            <div class="shopcomment"><span class="shopfont">&#xf4ad</span>${productlist[i][9]}</div>
                        </div>
                    </div>
                </div>`)
            }
            for (let j = 0; j < globallike.length; j++) {
                if (globallike[j][2] == productlist[i][0]) {
                    $(`#product${productlist[i][0]} .shoplikes .shoplike`).html(`<span class="shopfont likefont"><i class="likefont fa-solid fa-thumbs-up" style="color: #ff0000;"></i></span>${productlist[i][7]}`)
                    break
                }
            }
            for (let j = 0; j < globaldislike.length; j++) {
                if (globaldislike[j][2] == productlist[i][0]) {
                    $(`#product${productlist[i][0]} .shoplikes .shopdislike`).html(`<span class="shopfont dislikefont"><i class="dislikefont fa-solid fa-thumbs-down" style="color: #000000;"></i></span>${productlist[i][8]}`)
                    break
                }
            }
        }
    } else {
        $('#allshopdatas').html($('#allshopdatas').html() + `<div>No product</div>`)
    }
}

function getImgList(imgs) {
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

function resetProductInfo(product) {
    let imglist = getImgList(product[2])
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
    $('.bigproductname').text(product[1])
    $('.bigproductdescription').text(product[4])
    $('.bigproductprice').text(`$${product[5]}`)
    $('.productlike').html(`<span class="productfont">\uf164</span>${product[7]}`)
    $('.productdislike').html(`<span class="productfont">\uf165</span>${product[8]}`)
    $('.productcomment').html(`<span class="productfont">\uf4ad</span>${product[9]}`)
    $('.smallproductimg').click(function (e) {
        let imgid = e.currentTarget.id.slice(3)
        // console.log(imgid)
        $('.bigproductimg').html(`<img src="../static/productimg/${imglist[imgid]}" alt="" width="160px">`)
    })

    for (let j = 0; j < globallike.length; j++) {
        if (globallike[j][2] == product[0]) {
            $('.productlike').html(`<span class="productfont"><i class="fa-solid fa-thumbs-up" style="color: #ff0000;"></i></span>${product[7]}`)
            break
        }
    }
    for (let j = 0; j < globaldislike.length; j++) {
        if (globaldislike[j][2] == product[0]) {
            $('.productdislike').html(`<span class="productfont"><i class="fa-solid fa-thumbs-down" style="color: #000000;"></i></span>${product[8]}`)
            break
        }
    }
}

$('#allshopdatas').click(function (e) {
    // console.log($(e.target).closest('.shopdata').attr('id'))
    if ($(e.target).closest('.shopdata').length) {
        if ($(e.target).hasClass('shoplike') || $(e.target).hasClass('likefont')) {
            let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
            console.log(productid)
            let likeflag = 0
            let dislikeflag = 0
            for (let i = 0; i < globallike.length; i++) {
                if (globallike[i][2] == productid) {
                    likeflag = 1
                    break
                }
            }
            for (let i = 0; i < globaldislike.length; i++) {
                if (globaldislike[i][2] == productid) {
                    dislikeflag = 1
                    break
                }
            }
            let toSend = {
                Product_id: productid,
                likeflag: likeflag,
                dislikeflag: dislikeflag,
                userid: token.id
            }
            $.ajax({
                url: '/like',
                type: 'POST',
                data: JSON.stringify(toSend),
                contentType: 'application/json',
                success: function (response) {
                    getNewInfo()
                },
                error: function (error) {
                    console.log(error)
                }
            })
        }
        else if ($(e.target).hasClass('shopdislike') || $(e.target).hasClass('dislikefont')) {
            let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
            console.log(productid)
            let likeflag = 0
            let dislikeflag = 0
            for (let i = 0; i < globallike.length; i++) {
                if (globallike[i][2] == productid) {
                    likeflag = 1
                    break
                }
            }
            for (let i = 0; i < globaldislike.length; i++) {
                if (globaldislike[i][2] == productid) {
                    dislikeflag = 1
                    break
                }
            }
            let toSend = {
                Product_id: productid,
                likeflag: likeflag,
                dislikeflag: dislikeflag,
                userid: token.id
            }
            $.ajax({
                url: '/dislike',
                type: 'POST',
                data: JSON.stringify(toSend),
                contentType: 'application/json',
                success: function (response) {
                    getNewInfo()
                },
                error: function (error) {
                    console.log(error)
                }
            })
        } else {
            let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
            // console.log(productid)
            currentproductid = productid
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == productid) {
                    resetProductInfo(globalproduct[i])
                    resetComment(getProductComment(currentproductid))
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

$('#gocommentbtn').click(function () {
    if (token) {
        $('.commentborder').html(`
            <div class="mb-2">
                <textarea id="usercommentinput" class="form-control" placeholder="What do you want to say"></textarea>
            </div>
            <div class="addcommentbtnborder">
                <button class="btn btn-outline-secondary" type="button" id="addcommentbtn">Add Comment</button>
            </div>`
        )
        $('#usercommentinput').focus()
        $('#addcommentbtn').click(function () {
            if ($('#usercommentinput').val() != '') {
                let usercomment = $('#usercommentinput').val()
                $('#usercommentinput').val('')
                let toSend = {
                    Conent: usercomment,
                    Buyer_id: token.id,
                    Buyer_name: token.name,
                    Product_id: currentproductid
                }
                $.ajax({
                    url: '/comment',
                    type: 'POST',
                    data: JSON.stringify(toSend),
                    contentType: 'application/json',
                    success: function (response) {
                        alert(response.message)
                        getNewInfo()
                        $('.productfont').click()
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        })
    } else {
        alert('Please log in first')
    }
})

function getTime(timestramp) {
    let date = new Date(Date.parse(timestramp))
    date = date.toLocaleString()
    return date
}

function getProductComment(productid) {
    let productcommentlist = []
    for (let i = 0; i < globalcomment.length; i++) {
        if (globalcomment[i][5] == productid) {
            productcommentlist.push(globalcomment[i])
        }
    }
    return productcommentlist
}

function resetComment(productcommentlist) {
    if (productcommentlist.length > 0) {
        $('.commentborder').empty()
        for (let i = productcommentlist.length - 1; i > -1; i--) {
            $('.commentborder').html($('.commentborder').html() + `
                <div class="usercommentborder">
                    <div class="usercomment">
                        <div class="commentinfo">
                            <div class="commentname">${productcommentlist[i][4]}</div>
                            <div class="commenttime">${getTime(productcommentlist[i][2])}</div>
                        </div>
                        <div class="commenttext">
                            ${productcommentlist[i][1]}
                        </div>
                    </div>
                </div>
            `)
        }
    } else {
        $('.commentborder').html(`No comment`)
    }
}

$('.productcomment').click(function () {
    resetComment(getProductComment(currentproductid))
})

$('.productlike').click(function () {
    if (token) {
        let productid = currentproductid
        let likeflag = 0
        let dislikeflag = 0
        for (let i = 0; i < globallike.length; i++) {
            if (globallike[i][2] == productid) {
                likeflag = 1
                break
            }
        }
        for (let i = 0; i < globaldislike.length; i++) {
            if (globaldislike[i][2] == productid) {
                dislikeflag = 1
                break
            }
        }
        let toSend = {
            Product_id: productid,
            likeflag: likeflag,
            dislikeflag: dislikeflag,
            userid: token.id
        }
        $.ajax({
            url: '/like',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                getNewInfo()
            },
            error: function (error) {
                console.log(error)
            }
        })
    } else {
        alert('Please log in first')
    }
})

$('.productdislike').click(function () {
    if (token) {
        let productid = currentproductid
        let likeflag = 0
        let dislikeflag = 0
        for (let i = 0; i < globallike.length; i++) {
            if (globallike[i][2] == productid) {
                likeflag = 1
                break
            }
        }
        for (let i = 0; i < globaldislike.length; i++) {
            if (globaldislike[i][2] == productid) {
                dislikeflag = 1
                break
            }
        }
        let toSend = {
            Product_id: productid,
            likeflag: likeflag,
            dislikeflag: dislikeflag,
            userid: token.id
        }
        $.ajax({
            url: '/dislike',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                getNewInfo()
            },
            error: function (error) {
                console.log(error)
            }
        })
    } else {
        alert('Please log in first')
    }
})

poncon.start()

