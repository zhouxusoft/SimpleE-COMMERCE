let token = JSON.parse(localStorage.getItem("token"))
let globalcatagroies
let globalproduct
let globalcomment
let globallike = []
let globaldislike = []
let currentproductid
let globalcartlist

const poncon = new Poncon()

poncon.setPageList(['home', 'login', 'registration', 'cart'])

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
                getNewInfo()
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

$('.toplogo').click(function () {
    window.location.hash = ''
    $('#mainpage').css('display', 'block')
    $('#loginpage').css('display', 'none')
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
            if (token && token.kinds == 'buyer') {
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
    $('#inventorynum').text(`${product[6]}`)
    $('.productlike').html(`<span class="productfont">\uf164</span>${product[7]}`)
    $('.productdislike').html(`<span class="productfont">\uf165</span>${product[8]}`)
    $('.productcomment').html(`<span class="productfont">\uf4ad</span>${product[9]}`)

    if (product[6] > 200) {
        $('#inventorynum').css('color', 'blue')
        $('#buynum').prop('readonly', false)
    } else if (product[6] > 50) {
        $('#inventorynum').css('color', 'green')
        $('#buynum').prop('readonly', false)
    } else if (product[6] > 10) {
        $('#inventorynum').css('color', 'orange')
        $('#buynum').prop('readonly', false)
    } else if (product[6] > 0) {
        $('#inventorynum').css('color', 'red')
        $('#buynum').prop('readonly', false)
    } else {
        $('#buynum').prop('readonly', true)
        $('#inventorynum').css('color', 'black')
    }

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
            if (token && token.kinds == 'buyer') {
                let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
                // console.log(productid)
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
                if (token) {
                    alert('Vendor is unable to operate this option')
                } else {
                    alert('Please log in first')
                }
            }

        }
        else if ($(e.target).hasClass('shopdislike') || $(e.target).hasClass('dislikefont')) {
            if (token && token.kinds == 'buyer') {
                let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
                // console.log(productid)
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
                if (token) {
                    alert('Vendor is unable to operate this option')
                } else {
                    alert('Please log in first')
                }
            }

        } else {
            let productid = $(e.target).closest('.shopdata').attr('id').slice(7)
            // console.log(productid)
            currentproductid = productid
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == productid) {
                    resetProductInfo(globalproduct[i])
                    resetComment(getProductComment(currentproductid))
                    if (globalproduct[i][6] == 0) {
                        $('#buynum').val(0)
                    } else {
                        $('#buynum').val(1)
                    }
                    break
                }
            }
            $('#productinfobtn').click()
        }
    }
})

$('#cartbtn').click(function () {
    if (token && token.kinds == 'buyer') {
        window.location.hash = '#/cart'
        let toSend = {
            Buyer_id: token.id
        }
        // console.log(toSend)
        $.ajax({
            url: '/getcart',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                // console.log(response.data)
                globalcartlist = response.data
                resetCartList()
            },
            error: function (error) {
                console.log(error)
            }
        })
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

function resetCartResult(pnum, pallprice) {
    $('.numberselect').empty()
    $('.numberselect').text(pnum)
    $('.totalprice').text('$' + pallprice)
}

function resetCartList() {
    let checkeddatas = []
    resetCartResult(0, 0)
    if (globalcartlist.length > 0) {
        let vendorlist = []
        let vendorname = []
        for (let i = 0; i < globalcartlist.length; i++) {
            if (!vendorlist.includes(globalcartlist[i][7])) {
                vendorlist.push(globalcartlist[i][7])
                vendorname.push(globalcartlist[i][8])
            }
        }
        // console.log(vendorlist)
        $('.cartcenter').empty()
        for (let i = 0; i < vendorlist.length; i++) {
            $('.cartcenter').html($('.cartcenter').html() + `
                <div class="form-check cartcheck cartvendor">
                    <input type="checkbox" class="form-check-input datascheck" id="vendor${vendorlist[i]}">
                    <label class="form-check-label">${vendorname[i]}</label>
                </div>
                <div class="cartdatabox" id="vendordata${vendorlist[i]}"></div>`
            )
            for (let j = 0; j < globalcartlist.length; j++) {
                let img = getImgList(globalcartlist[j][6])[0]
                let allprice = globalcartlist[j][2] * globalcartlist[j][9]
                if (globalcartlist[j][7] == vendorlist[i]) {
                    $(`#vendordata${vendorlist[i]}`).html($(`#vendordata${vendorlist[i]}`).html() + `
                        <div class="cartdata">
                            <div class="cartdatainfo" id="cartdatainfo${globalcartlist[j][3]}">
                                <input type="checkbox" class="form-check-input datacheck datacheck${vendorlist[i]}" id="check${globalcartlist[j][0]}" data-vid="${vendorlist[i]}">
                                <div class="cartdataimg">
                                    <img src="../static/productimg/${img}" alt="" width="50px">
                                </div>
                                <div class="cartdataname">${globalcartlist[j][5]}</div>
                                <div class="cartdataprice">$${globalcartlist[j][9]}</div>
                                <div class="buynumborder cartdatanum">
                                    <span class="input-group-text changebuynum delcartnum" id="${globalcartlist[j][3]}" data-vid="check${globalcartlist[j][0]}">-</span>
                                    <input type="number" class="form-control cartnum" id="cartnum${globalcartlist[j][3]}" value="${globalcartlist[j][2]}" readonly>
                                    <span class="input-group-text changebuynum addcartnum" id="${globalcartlist[j][3]}" data-vid="check${globalcartlist[j][0]}">+</span>
                                </div>  
                                <div class="carttatleprice" id="totalprice${globalcartlist[j][3]}">$${allprice}</div>
                            </div>
                        </div>`
                    )
                }
            }
            if (i != vendorlist.length - 1) {
                $('.cartcenter').html($('.cartcenter').html() + `<hr>`)
            }
        }
        $('.delcartnum').click(function (e) {
            let productid = e.target.id
            let sid = 'cartnum' + productid
            // console.log(productid)
            let cartnum = $(`#${sid}`).val()
            cartnum = parseInt(cartnum)
            if (!isNaN(cartnum)) {
                if (cartnum > 0) {
                    $(`#${sid}`).val(cartnum - 1)
                } else {
                    $(`#${sid}`).val(0)
                }
            } else {
                $(`#${sid}`).val(1)
            }
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == productid) {
                    let newprice = globalproduct[i][5] * $(`#${sid}`).val()
                    $(`#totalprice${productid}`).text(`$${newprice}`)
                }
            }
            let pnum = 0
            let pallprice = 0
            for (let i = 0; i < checkeddatas.length; i++) {
                for (let j = 0; j < globalcartlist.length; j++) {
                    if (globalcartlist[j][3] == productid) {
                        globalcartlist[j][2] = $(`#${sid}`).val()
                    }
                    if (checkeddatas[i] == globalcartlist[j][0]) {
                        pnum = pnum + parseInt(globalcartlist[j][2])
                        pallprice = pallprice + globalcartlist[j][2] * globalcartlist[j][9]
                    }
                }
            }
            resetCartResult(pnum, pallprice)
            let toSend = {
                Product_id: productid,
                Quantity: $(`#${sid}`).val(),
                Buyer_id: token.id
            }
            $.ajax({
                url: '/setcart',
                type: 'POST',
                data: JSON.stringify(toSend),
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        $(`#allcheck`).prop('checked', false)
                        checkeddatas = []
                        let toSend = {
                            Buyer_id: token.id
                        }
                        // console.log(toSend)
                        $.ajax({
                            url: '/getcart',
                            type: 'POST',
                            data: JSON.stringify(toSend),
                            contentType: 'application/json',
                            success: function (response) {
                                console.log(response.data)
                                globalcartlist = response.data
                                resetCartList()
                            },
                            error: function (error) {
                                console.log(error)
                            }
                        })
                    }
                },
                error: function (error) {
                    console.log(error)
                }
            })
        })
        $('.addcartnum').click(function (e) {
            let productid = e.target.id
            let sid = 'cartnum' + productid
            let cartnum = $(`#${sid}`).val()
            cartnum = parseInt(cartnum)
            if (!isNaN(cartnum)) {
                if (cartnum > 0) {
                    $(`#${sid}`).val(cartnum + 1)
                } else {
                    $(`#${sid}`).val(1)
                }
            } else {
                $(`#${sid}`).val(1)
            }
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == productid) {
                    let newprice = globalproduct[i][5] * $(`#${sid}`).val()
                    $(`#totalprice${productid}`).text(`$${newprice}`)
                }
            }
            let pnum = 0
            let pallprice = 0
            for (let i = 0; i < checkeddatas.length; i++) {
                for (let j = 0; j < globalcartlist.length; j++) {
                    if (globalcartlist[j][3] == productid) {
                        globalcartlist[j][2] = $(`#${sid}`).val()
                    }
                    if (checkeddatas[i] == globalcartlist[j][0]) {
                        pnum = pnum + parseInt(globalcartlist[j][2])
                        pallprice = pallprice + globalcartlist[j][2] * globalcartlist[j][9]
                    }
                }
            }
            resetCartResult(pnum, pallprice)
            let toSend = {
                Product_id: productid,
                Quantity: $(`#${sid}`).val(),
                Buyer_id: token.id
            }
            $.ajax({
                url: '/setcart',
                type: 'POST',
                data: JSON.stringify(toSend),
                contentType: 'application/json',
                success: function (response) {
                    if (response.success) {
                        let toSend = {
                            Buyer_id: token.id
                        }
                        // console.log(toSend)
                        $.ajax({
                            url: '/getcart',
                            type: 'POST',
                            data: JSON.stringify(toSend),
                            contentType: 'application/json',
                            success: function (response) {
                                console.log(response.data)
                                globalcartlist = response.data
                                resetCartList()
                            },
                            error: function (error) {
                                console.log(error)
                            }
                        })
                    }
                },
                error: function (error) {
                    console.log(error)
                }
            })
        })
        $('#allcheck').click(function () {
            if ($('#allcheck').prop('checked')) {
                // console.log(5455)
                $('.datascheck').prop('checked', true)
                $('.datascheck').trigger('click')
                $('.datascheck').trigger('click')
            } else {
                $('.datascheck').prop('checked', false)
                $('.datascheck').trigger('click')
                $('.datascheck').trigger('click')
            }
        })
        $('.datascheck').click(function () {
            let vid = this.id.slice(6)
            let chooseclass = 'datacheck' + vid
            // console.log(vid)
            if (this.checked) {
                $(`.${chooseclass}`).prop('checked', true)
                $(`.${chooseclass}`).trigger('click')
                $(`.${chooseclass}`).trigger('click')
            } else {
                $(`.${chooseclass}`).prop('checked', false)
                $(`.${chooseclass}`).trigger('click')
                $(`.${chooseclass}`).trigger('click')
            }
        })
        $('.datacheck').click(function () {
            let cartid = this.id.slice(5)
            if (this.checked) {
                checkeddatas.push(cartid)
            } else {
                checkeddatas = checkeddatas.filter(function(item) {
                    return item !== cartid
                })
            }
            let vid = $(this).attr('data-vid')
            // console.log(vid)
            let dataallChecked = true
            let datasallChecked = true
            $(`.datacheck${vid}`).each(function() {
                // console.log(9594)
                if (!$(this).prop('checked')) {  
                    dataallChecked = false
                    return false
                }
            })
            $(`.datacheck`).each(function() {
                if (!$(this).prop('checked')) {  
                    datasallChecked = false
                    return false
                }
            })
            if (dataallChecked) {
                $(`#vendor${vid}`).prop('checked', true)
            } else {
                $(`#vendor${vid}`).prop('checked', false)
            }
            if (datasallChecked) {
                $(`#allcheck`).prop('checked', true)
            } else {
                $(`#allcheck`).prop('checked', false)
            }
            let pnum = 0
            let pallprice = 0
            for (let i = 0; i < checkeddatas.length; i++) {
                for (let j = 0; j < globalcartlist.length; j++) {
                    if (checkeddatas[i] == globalcartlist[j][0]) {
                        pnum = pnum + globalcartlist[j][2]
                        pallprice = pallprice + globalcartlist[j][2] * globalcartlist[j][9]
                    }
                }
            }
            resetCartResult(pnum, pallprice)
            // console.log(checkeddatas)
        })

    } else {
        $('.cartcenter').html(`
            <div class="noitemincart">
                There are no items in your shopping cart
            </div>`
        )
    }
}

$('#likebtn').click(function () {
    if (token && token.kinds == 'buyer') {
        alert('4959')
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

$('#centerbtn').click(function () {
    if (token && token.kinds == 'buyer') {
        alert('4959')
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
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
    checkInput()
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
    checkInput()
})

$('#gocommentbtn').click(function () {
    if (token && token.kinds == 'buyer') {
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
                        getNewInfo()
                        alert(response.message)
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        })
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

function checkInput() {
    // console.log($('#buynum').val())
    let buynum = $('#buynum').val()
    let allprice
    let singleprice
    let inventory
    for (let i = 0; i < globalproduct.length; i++) {
        if (globalproduct[i][0] == currentproductid) {
            singleprice = globalproduct[i][5]
            inventory = globalproduct[i][6]
            break
        }
    }
    if (isNaN(buynum)) {
        $('#buynum').val(1)
    } else if (buynum < 1) {
        $('#buynum').val(1)
    } else if (buynum > inventory) {
        $('#buynum').val(inventory)
    } else if (!Number.isInteger(buynum)) {
        $('#buynum').val(Math.floor(buynum))
    }
    buynum = $('#buynum').val()
    allprice = buynum * singleprice
    allprice = '$' + allprice
    $('.allprice').text(allprice)
}

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
    if (token && token.kinds == 'buyer') {
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
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

$('.productdislike').click(function () {
    if (token && token.kinds == 'buyer') {
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
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

$('#addcart').click(function () {
    if (token && token.kinds == 'buyer') {
        let buynum = $('#buynum').val()
        buynum = parseInt(buynum)
        if (isNaN(buynum)) {
            alert('Not a number!')
            $('#buynum').val(1)
        } else if (buynum < 1) {
            alert('You cannot purchase less than one item.')
        } else if (buynum > 200) {
            alert('An order can purchase up to 200 items at most.')
        } else {
            let toSend = {
                Product_id: currentproductid,
                Quantity: buynum,
                Buyer_id: token.id
            }
            $.ajax({
                url: '/cart',
                type: 'POST',
                data: JSON.stringify(toSend),
                contentType: 'application/json',
                success: function (response) {
                    alert("Added to cart.")
                    $('.productcomment').click()
                    $('#buynum').val(1)
                },
                error: function (error) {
                    console.log(error)
                }
            })
        }
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

$('#buynow').click(function () {
    if (token && token.kinds == 'buyer') {
        let buynum = $('#buynum').val()
        buynum = parseInt(buynum)
        if (isNaN(buynum)) {
            alert('Not a number!')
            $('#buynum').val(1)
        } else if (buynum < 1) {
            alert('You cannot purchase less than one item.')
        } else if (buynum > 200) {
            alert('An order can purchase up to 200 items at most.')
        } else {
            let allprice = 'Price Error'
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == currentproductid) {
                    allprice = buynum * globalproduct[i][5]
                    allprice = '$' + allprice
                    break
                }
            }
            $('.commentborder').html(`
                <div class="priceborder">
                    <div class="mb-2 leftpriceborder">
                        <div>
                            <div class="mt-2 mb-4 allprice">
                                ${allprice}
                            </div>
                        </div>
                        <div class="paywaybtns">
                            <div class="btn-group-vertical">
                                <button type="button" class="btn btn-outline-success" id="wechatpay">WeChat Pay</button>
                                <button type="button" class="btn btn-outline-primary" id="alipay">AliPay</button>
                            </div>
                        </div>
                    </div>
                    <div class="addcommentbtnborder">
                        <div class="paycode mb-2">Choose payment path</div>
                        <button class="btn btn-success disabled" type="button" id="ipayed">I paid</button>
                        <button class="btn btn-danger" type="button" id="inotpayed">Cancle</button>
                    </div>
                </div>`
            )
            $('#inotpayed').click(function () {
                $('.productcomment').click()
            })
            $('#wechatpay').click(function () {
                $('#ipayed').removeClass('disabled')
                $('.paycode').html(`<img src="../static/productimg/wechatpay.png" alt="" width="130px">`)
            })
            $('#alipay').click(function () {
                $('#ipayed').removeClass('disabled')
                $('.paycode').html(`<img src="../static/productimg/alipay.png" alt="" width="130px">`)
            })
            $('#ipayed').click(function () {
                let buynum = $('#buynum').val()
                let allprice = 0
                let Vendors_id = 1
                for (let i = 0; i < globalproduct.length; i++) {
                    if (globalproduct[i][0] == currentproductid) {
                        allprice = buynum * globalproduct[i][5]
                        Vendors_id = globalproduct[i][10]
                        break
                    }
                }
                let toSend = {
                    Product_id: currentproductid,
                    Quantity: buynum,
                    Sum_price: allprice,
                    Vendor_id: Vendors_id,
                    Buyer_id: token.id
                }
                // console.log(toSend)
                $.ajax({
                    url: '/buy',
                    type: 'POST',
                    data: JSON.stringify(toSend),
                    contentType: 'application/json',
                    success: function (response) {
                        alert(response.message)
                        getNewInfo()
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            })
        }
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

$('#backtopurchase').click(function () {
    window.location.hash = ''
    $('#mainpage').css('display', 'block')
    $('#loginpage').css('display', 'none')
})

poncon.start()

