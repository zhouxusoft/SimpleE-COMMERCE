let token = JSON.parse(localStorage.getItem("token"))
let globalcatagroies
let globalproduct
let globalcomment
let globallike = []
let globaldislike = []
let currentproductid
let globalcartlist
let globalallorder
let selectedcart
let checkeddatas = []
let currentpage = 'likelist'
let globalbuyers

const poncon = new Poncon()

poncon.setPageList(['home', 'login', 'registration', 'cart', 'center'])

window.location.hash = ''

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
            window.location.hash = ''
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
        if (globalcatagroies[i][1] != '') {
            $('#addcatagroiesdatas').html($('#addcatagroiesdatas').html() + `<tr><td class="allcatagroies" id="catagroies${globalcatagroies[i][0]}">${globalcatagroies[i][1]}</td></tr>`)
        }
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
    productlist.reverse()
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

$('.searchbtn').click(function () {
    if (window.location.hash == '') {
        let searchkey = new RegExp($('.searchinput').val())
        let result = globalproduct.filter(item => searchkey.test(item[1]))
        // console.log(result)
        resetProduct(result)
    }
})

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
        $('#allcheck').prop('checked', false)
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
                                // console.log(response.data)
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
                                // console.log(response.data)
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
                checkeddatas = checkeddatas.filter(function (item) {
                    return item !== cartid
                })
            }
            let vid = $(this).attr('data-vid')
            // console.log(vid)
            let dataallChecked = true
            let datasallChecked = true
            $(`.datacheck${vid}`).each(function () {
                // console.log(9594)
                if (!$(this).prop('checked')) {
                    dataallChecked = false
                    return false
                }
            })
            $(`.datacheck`).each(function () {
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

$('#cartbuybtn').click(function () {
    if ($('.numberselect').text() > 0) {
        $('#scartbuybtn').click()
        $('.allprice1').text($('.totalprice').text())
    }
})

$('#cartwechatpay').click(function () {
    $('#cartipayed').removeClass('disabled')
    $('.paycode1').html(`<img src="../static/productimg/wechatpay.png" alt="" width="130px">`)
})

$('#cartalipay').click(function () {
    $('#cartipayed').removeClass('disabled')
    $('.paycode1').html(`<img src="../static/productimg/wechatpay.png" alt="" width="130px">`)
})

$('#cartipayed').click(function () {
    $('#cartipayed').addClass('disabled')
    $('.paycode1').html(`Choose payment path`)
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
        cartlist: checkeddatas,
    }
    // console.log(toSend)
    $.ajax({
        url: '/buycart',
        type: 'POST',
        data: JSON.stringify(toSend),
        contentType: 'application/json',
        success: function (response) {
            alert(response.message)
            $(`#allcheck`).prop('checked', false)
            checkeddatas = []
            $('#closeuploadfilemodal1').click()
            $('#cartbtn').click()
        },
        error: function (error) {
            console.log(error)
        }
    })
})

$('#likebtn').click(function () {
    if (token && token.kinds == 'buyer') {
        $('#centerbtn').click()
    } else {
        if (token) {
            alert('Vendor is unable to operate this option')
        } else {
            alert('Please log in first')
        }
    }
})

$('#centerbtn').click(function () {
    if (token) {
        window.location.hash = '#/center'
        $('#looklikelist').addClass('centerselected')
        $('#lookbuyerhistory').removeClass('centerselected')
        $('#lookcomment').removeClass('centerselected')
        if (token.kinds == 'buyer') {
            currentpage = 'likelist'
            $('#lookbuyerhistory').text('Buyer history')
            $('#looklikelist').text('Like list')
        } else {
            currentpage = 'orderlist'
            $('#lookbuyerhistory').text('Product list')
            $('#looklikelist').text('Order list')
        }
        // console.log(toSend)
        $.ajax({
            url: '/order',
            type: 'POST',
            contentType: 'application/json',
            success: function (response) {
                globalallorder = response.data
                globalbuyers = response.buyers
                resetCenter()
                resetChangeInput()
                // console.log(response.data)
                // console.log(response.buyers)
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

function resetChangeInput() {
    $('.centerusername').text(token.name)
    $("#phonechangeinput").attr("placeholder", token.phone)
    $("#emailchangeinput").attr("placeholder", token.email)
    $("#addresschangeinput").attr("placeholder", token.address)
    $("#phonechangeinput").val('')
    $("#emailchangeinput").val('')
    $("#addresschangeinput").val('')
    $("#passwordchangeinput").val('')
}

function getDate(time) {
    let date = new Date(Date.parse(time))
    date = date.toLocaleDateString()
    // console.log(date)
    return date
}

function resetCenter() {
    if (currentpage == 'likelist') {
        // console.log(currentpage)
        $('.centerinfoborder').empty()
        for (let i = globallike.length - 1; i > -1; i--) {
            let img = ''
            let likepname = ''
            let likepprice = 0
            let likenum = 0
            for (let j = 0; j < globalproduct.length; j++) {
                if (globalproduct[j][0] == globallike[i][2]) {
                    img = getImgList(globalproduct[j][2])
                    likepname = globalproduct[j][1]
                    likepprice = globalproduct[j][5]
                    likenum = globalproduct[j][7]
                }
            }
            $('.centerinfoborder').html($('.centerinfoborder').html() + `
                <div class="likelistdata">
                    <div class="likelistdataimg">
                        <img src="../static/productimg/${img[0]}" alt="" width="50px">
                    </div>
                    <div class="likelistdataname">${likepname}</div>
                    <div class="likelistdataprice">$${likepprice}</div>
                    <div class="likelistdatalikenum">
                        &#xf164 <span class="likelistdatanum">${likenum}</span>
                    </div>
                </div>
            `)
        }
    } else if (currentpage == 'buyerhistory') {
        // console.log(currentpage)
        let globalorder = []
        $('.centerinfoborder').empty()
        for (let i = 0; i < globalallorder.length; i++) {
            if (globalallorder[i][8] == token.id) {
                globalorder.push(globalallorder[i])
            }
        }
        for (let i = globalorder.length - 1; i > -1; i--) {
            let pimg = ''
            let pname = ''
            for (let j = 0; j < globalproduct.length; j++) {
                if (globalproduct[j][0] == globalorder[i][7]) {
                    pimg = getImgList(globalproduct[j][2])
                    pname = globalproduct[j][1]
                    pprice = globalproduct[j][5]
                }
            }
            $('.centerinfoborder').html($('.centerinfoborder').html() + `
                <div class="orderlistdataborder">
                    <div class="orderlistdata">
                        <div class="orderlistdataimg1"></div>
                        <div class="orderlistdataname">Productname</div>
                        <div class="orderlistdatanum">Quantity</div>
                        <div class="orderlistdataprice">Total price</div>
                        <div class="orderlistdatatime">Order time</div>
                    </div>
                    <hr class="orderhr">
                    <div class="orderlistdata">
                        <div class="orderlistdataimg">
                            <img src="../static/productimg/${pimg[0]}" alt="" width="50px">
                        </div>
                        <div class="orderlistdataname">${pname}</div>
                        <div class="orderlistdatanum">${globalorder[i][4]}</div>
                        <div class="orderlistdataprice">$${globalorder[i][5]}</div>
                        <div class="orderlistdatatime">${getTime(globalorder[i][3])}</div>
                    </div>
                    <div class="orderlistdatatrack">
                        <div class="orderlistdatatracking">Tracking: <span class="orderlistdatatrackingnum" id="orderlistdatatrackingnum${globalorder[i][0]}">${globalorder[i][2]}</span></div>
                        <div class="orderlistdatatrackarrive">Arrivial date: <span class="orderlistdatatrackarrivedate" id="orderlistdatatrackarrivedate${globalorder[i][0]}">${getDate(globalorder[i][1])}</span></div>
                    </div>
                </div>
            `)

            if (globalorder[i][1] == null) {
                $(`#orderlistdatatrackingnum${globalorder[i][0]}`).text('Not shipped')
            }
            if (globalorder[i][2] == null) {
                $(`#orderlistdatatrackarrivedate${globalorder[i][0]}`).text('Please wait')
            }
        }
    } else if (currentpage == 'comment') {
        // console.log(currentpage)
        $('.centerinfoborder').empty()
        for (let i = globalcomment.length - 1; i > -1; i--) {
            if (globalcomment[i][3] == token.id) {
                let pimg = ''
                let pname = ''
                for (let j = 0; j < globalproduct.length; j++) {
                    if (globalproduct[j][0] == globalcomment[i][6]) {
                        pimg = getImgList(globalproduct[j][2])
                        pname = globalproduct[j][1]
                    }
                }
                $('.centerinfoborder').html($('.centerinfoborder').html() + `
                    <div class="centercomment">
                        <div class="centercommentimg">
                            <img src="../static/productimg/${pimg[0]}" alt="" width="50px">
                        </div>
                        <div class="centercommentname">${pname}</div>
                        <div class="centercommenttext">${globalcomment[i][1]}</div>
                        <div class="centercommenttime">${getTime(globalcomment[i][2])}</div>
                    </div>
                `)
            }
        }
    } else if (currentpage == 'productlist') {
        $('.centerinfoborder').empty()
        $('.centerinfoborder').html($('.centerinfoborder').html() + `
            <div class="addpd">
                <button type="button" class="btn btn-outline-success" id="addproductbtn">Add product</button>
            </div>`
        )
        for (let i = globalproduct.length - 1; i > -1; i--) {
            if (globalproduct[i][10] == token.id) {
                let img = getImgList(globalproduct[i][2])
                $('.centerinfoborder').html($('.centerinfoborder').html() + `
                    <div class="productlistdataborder">
                        <div class="productlistdata">
                            <div class="productlistdataimg1"></div>
                            <div class="productlistdataname">Product name</div>
                            <div class="productlistdatainventory">Inventory</div>
                            <div class="productlistdataprice">Price</div>
                            <div class="changebox"></div>
                        </div>
                        <hr class="orderhr">
                        <div class="productlistdata">
                            <div class="productlistdataimg">
                                <img src="../static/productimg/${img[0]}" alt="" width="50px">
                            </div>
                            <div class="productlistdataname">${globalproduct[i][1]}</div>
                            <div class="productlistdatainventory">${globalproduct[i][6]}</div>
                            <div class="productlistdataprice">$${globalproduct[i][5]}</div>
                            <button type="button" class="btn btn-outline-secondary changeproduct" id="changeproduct${globalproduct[i][0]}">Edit</button>
                        </div>
                    </div>
                `)
            }
        }
        let pid = 0
        $('.changeproduct').click(function () {
            pid = this.id.slice(13)
            $('#editbtn').click()
            $('.addimgborder').empty()
            for (let i = 0; i < globalproduct.length; i++) {
                if (globalproduct[i][0] == parseInt(pid)) {
                    $('#addroducttitle').text('Product edit')
                    let img = getImgList(globalproduct[i][2])
                    $('#changename').val(globalproduct[i][1])
                    $('#changecategory').val('')
                    $('#changeprice').val(globalproduct[i][5])
                    $('#changeinventory').val(globalproduct[i][6])
                    $('#changedescription').val(globalproduct[i][4])
                    for (let j = 0; j < img.length; j++) {
                        $('.addimgborder').html($('.addimgborder').html() + `
                            <div class="addimg">
                                <img src="../static/productimg/${img[j]}" alt="" width="70px">
                            </div>
                        `)
                    }
                    $('.addimgborder').html($('.addimgborder').html() + `
                        <div class="addimgbtn">
                            Upload product photo
                        </div>
                    `)
                    $('.addimgbtn').click(function () {
                        if (img.length >= 5) {
                            alert('Maximum of five images can be uploaded')
                        } else {
                            var fileInput = document.createElement('input')

                            fileInput.type = 'file'
                            fileInput.name = 'img'
                            fileInput.accept = 'image/bmp,image/heic,image/heif,image/jpeg,image/png,image/webp,image/x-icon'

                            fileInput.onchange = function () {
                                let file = this.files[0]
                                // console.log(file.name)
                                let toSend = {
                                    Product_id: pid,
                                    filename: file.name,
                                }
                                const formData = new FormData();
                                formData.append('file', file);
                                $.ajax({
                                    url: '/uploadimg',
                                    type: 'POST',
                                    data: formData,
                                    contentType: false,
                                    processData: false,
                                    success: function (response) {
                                        if (response.success) {
                                            $.ajax({
                                                url: '/img',
                                                type: 'POST',
                                                data: JSON.stringify(toSend),
                                                contentType: 'application/json',
                                                success: function (response) {
                                                    if (response.success) {
                                                        $('.addimgbtn').before(`
                                                            <div class="addimg">
                                                                <img src="../static/productimg/${toSend.filename}" alt="" width="70px">
                                                            </div>
                                                        `)
                                                    }
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
                            }
                            fileInput.click();
                        }
                    })
                    break
                }
            }
        })
        $('#yeschange').off()
        $('#yeschange').click(function () {
            // console.log(pid)
            if (pid == 0) {
                if (imglen > 0 && $('#changename').val() != '' && $('#changecategory').val() != '' && $('#changeprice').val() != '' && $('#changeinventory').val() != '' && $('#changedescription').val() != '') {
                    let toSend = {
                        Product_name: $('#changename').val(),
                        Photo: imglist,
                        Category: $('#changecategory').val(),
                        Product_describe: $('#changedescription').val(),
                        Price: $('#changeprice').val(),
                        Inventory: $('#changeinventory').val(),
                        Vendors_id: token.id
                    }
                    // console.log(toSend)
                    $.ajax({
                        url: '/addproduct',
                        type: 'POST',
                        data: JSON.stringify(toSend),
                        contentType: 'application/json',
                        success: function (response) {
                            alert(response.message)
                            // console.log(response.data)
                            $('#canclecmodal').click()
                            $('#lookbuyerhistory').trigger('click')           
                            $('.addpd').after(`
                                <div class="productlistdataborder">
                                    <div class="productlistdata">
                                        <div class="productlistdataimg1"></div>
                                        <div class="productlistdataname">Product name</div>
                                        <div class="productlistdatainventory">Inventory</div>
                                        <div class="productlistdataprice">Price</div>
                                        <div class="changebox"></div>
                                    </div>
                                    <hr class="orderhr">
                                    <div class="productlistdata">
                                        <div class="productlistdataimg">
                                            <img src="../static/productimg/${getImgList(imglist)[0]}" alt="" width="50px">
                                        </div>
                                        <div class="productlistdataname">${toSend.Product_name}</div>
                                        <div class="productlistdatainventory">${toSend.Inventory}</div>
                                        <div class="productlistdataprice">$${toSend.Price}</div>
                                        <button type="button" class="btn btn-outline-secondary changeproduct" id="changeproduct${response.data[0]}" disabled>Edit</button>
                                    </div>
                                </div>
                            `)
                            getNewInfo()  
                        },
                        error: function (error) {
                            console.log(error)
                        }
                    })
                } else {
                    alert('Please complete the product information.')
                }
            } else {
                let toSend = {
                    Product_id: pid,
                    Product_name: $('#changename').val(),
                    Category: $('#changecategory').val(),
                    Price: $('#changeprice').val(),
                    Inventory: $('#changeinventory').val(),
                    Product_describe: $('#changedescription').val()
                }
                $.ajax({
                    url: '/editproduct',
                    type: 'POST',
                    data: JSON.stringify(toSend),
                    contentType: 'application/json',
                    success: function (response) {
                        if ($('#changeinventory').val() != '') {
                            for (let i = 0; i < globalproduct.length; i++) {
                                if (globalproduct[i][0] == pid) {
                                    globalproduct[i][6] = $('#changeinventory').val()
                                }
                            }
                        }
                        if ($('#changeprice').val() != '') {
                            for (let i = 0; i < globalproduct.length; i++) {
                                if (globalproduct[i][0] == pid) {
                                    globalproduct[i][5] = $('#changeprice').val()
                                }
                            }
                        }
                        alert(response.message)
                        getNewInfo()
                        $('#canclecmodal').click()
                        $('#lookbuyerhistory').click()
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        })
        let imglist
        let imglen
        $('#addproductbtn').click(function () {
            pid = 0
            // console.log(pid)
            $('#addroducttitle').text('Add product')
            $('#editbtn').click()
            $('.addimgborder').empty()
            $('#changename').val('')
            $('#changecategory').val('')
            $('#changeprice').val('')
            $('#changeinventory').val('')
            $('#changedescription').val('')
            $('.addimgborder').html($('.addimgborder').html() + `
                <div class="addimgbtn">
                    Upload product photo
                </div>
            `)
            imglist = ''
            imglen = 0
            $('.addimgbtn').click(function () {

                if (imglen > 4) {
                    alert('Maximum of five images can be uploaded')
                } else {
                    var fileInput = document.createElement('input')

                    fileInput.type = 'file'
                    fileInput.name = 'img'
                    fileInput.accept = 'image/bmp,image/heic,image/heif,image/jpeg,image/png,image/webp,image/x-icon'

                    fileInput.onchange = function () {
                        let file = this.files[0]
                        // console.log(file.name)
                        let filename = file.name
                        const formData = new FormData()
                        formData.append('file', file)
                        $.ajax({
                            url: '/uploadimg',
                            type: 'POST',
                            data: formData,
                            contentType: false,
                            processData: false,
                            success: function (response) {
                                if (response.success) {
                                    imglist = imglist + filename + '&'
                                    imglen = imglen + 1
                                    // console.log(imglist)
                                    $('.addimgbtn').before(`
                                    <div class="addimg">
                                        <img src="../static/productimg/${filename}" alt="" width="70px">
                                    </div>
                                `)
                                }
                            },
                            error: function (error) {
                                console.log(error)
                            }
                        })
                    }
                    fileInput.click();
                }
            })
        })
    } else if (currentpage == 'orderlist') {
        $('.centerinfoborder').empty()
        for (let i = globalallorder.length - 1; i > -1; i--) {
            if (globalallorder[i][6] == token.id) {
                let pname = ''
                let pimg = ''
                let bname = ''
                for (let j = 0; j < globalproduct.length; j++) {
                    if (globalproduct[j][0] == globalallorder[i][7]) {
                        pname = globalproduct[j][1]
                        pimg = getImgList(globalproduct[j][2])
                    }
                }
                for (let x = 0; x < globalbuyers.length; x++) {
                    if (globalbuyers[x][0] == globalallorder[i][8]) {
                        bname = globalbuyers[x][1]
                    }
                }
                $('.centerinfoborder').html($('.centerinfoborder').html() + `
                    <div class="orderlistdataborder">
                        <div class="orderlistdata">
                            <div class="vorderlistdataimg1"></div>
                            <div class="orderlistdataname">Product name</div>
                            <div class="orderlistdataquantity">Quantity</div>
                            <div class="orderlistdatabname">Buyer name</div>
                            <div class="shipbox"></div>
                        </div>
                        <hr class="orderhr">
                        <div class="orderlistdata">
                            <div class="vorderlistdataimg">
                                <img src="../static/productimg/${pimg[0]}" alt="" width="50px">
                            </div>
                            <div class="vorderlistdataname">${pname}</div>
                            <div class="orderlistdataquantity">${globalallorder[i][4]}</div>
                            <div class="orderlistdatabname">${bname}</div>
                            <button type="button" class="btn btn-outline-secondary shipbtn" id="ship${globalallorder[i][0]}">Ship</button>
                        </div>
                    </div>
                `)
                if (globalallorder[i][1] != null) {
                    $(`#ship${globalallorder[i][0]}`).text('Shipped')
                    $(`#ship${globalallorder[i][0]}`).addClass('disabled')
                }
            }
        }
        let currentorderid = 0
        $('.shipbtn').click(function () {
            // console.log(this.id.slice(4))
            $('#goshipbtn').click()
            currentorderid = parseInt(this.id.slice(4))
        })
        $('#yesship').click(function () {
            if ($('#shiptrackinput').val() != '' && $('#shipdateinput').val() != '') {
                // console.log($('#shipdateinput').val())
                let toSend = {
                    Order_id: currentorderid,
                    Arrive_date: $('#shipdateinput').val(),
                    Tracking: $('#shiptrackinput').val()
                }
                $.ajax({
                    url: '/ship',
                    type: 'POST',
                    data: JSON.stringify(toSend),
                    contentType: 'application/json',
                    success: function (response) {
                        alert(response.message)
                        $('#canclemodal').click()
                        $(`#ship${currentorderid}`).text('Shipped')
                        $(`#ship${currentorderid}`).addClass('disabled')
                        $('#shipdateinput').val(null)
                        $('#shiptrackinput').val(null)
                    },
                    error: function (error) {
                        console.log(error)
                    }
                })
            }
        })
    } else if (currentpage == 'vcomment') {
        $('.centerinfoborder').empty()
        let pdlist = []
        for (let i = 0; i < globalproduct.length; i++) {
            if (globalproduct[i][10] == token.id) {
                pdlist.push(globalproduct[i][0])
            }
        }
        for (let i = globalcomment.length - 1; i > -1; i--) {
            for (let x = 0; x < pdlist.length; x++) {
                if (pdlist[x] == globalcomment[i][6]) {
                    let pimg = ''
                    let pname = ''
                    for (let j = 0; j < globalproduct.length; j++) {
                        if (globalproduct[j][0] == globalcomment[i][6]) {
                            pimg = getImgList(globalproduct[j][2])
                            pname = globalproduct[j][1]
                        }
                    }
                    $('.centerinfoborder').html($('.centerinfoborder').html() + `
                        <div class="centercomment">
                            <div class="centercommentimg">
                                <img src="../static/productimg/${pimg[0]}" alt="" width="50px">
                            </div>
                            <div class="centercommentname">${pname}</div>
                            <div class="centercommenttext">${globalcomment[i][1]}</div>
                            <div class="centercommenttime">${getTime(globalcomment[i][2])}</div>
                        </div>
                    `)
                }

            }
        }
    }
}

$('#phonechangebtn').click(function () {
    if ($('#phonechangeinput').val() != '') {
        let toSend = {
            kind: token.kinds,
            bv_id: token.id,
            changedata: 'phone',
            changed: $('#phonechangeinput').val()
        }
        // console.log(toSend)
        $.ajax({
            url: '/change',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
                token = JSON.parse(localStorage.getItem("token"))
                resetChangeInput()
                alert(response.message)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
})

$('#emailchangebtn').click(function () {
    if ($('#emailchangeinput').val() != '') {
        let toSend = {
            kind: token.kinds,
            bv_id: token.id,
            changedata: 'email',
            changed: $('#emailchangeinput').val()
        }
        // console.log(toSend)
        $.ajax({
            url: '/change',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
                token = JSON.parse(localStorage.getItem("token"))
                resetChangeInput()
                alert(response.message)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
})

$('#addresschangebtn').click(function () {
    if ($('#addresschangeinput').val() != '') {
        let toSend = {
            kind: token.kinds,
            bv_id: token.id,
            changedata: 'address',
            changed: $('#addresschangeinput').val()
        }
        // console.log(toSend)
        $.ajax({
            url: '/change',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
                token = JSON.parse(localStorage.getItem("token"))
                resetChangeInput()
                alert(response.message)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
})

$('#passwordchangebtn').click(function () {
    if ($('#passwordchangeinput').val() != '') {
        let toSend = {
            kind: token.kinds,
            bv_id: token.id,
            changedata: 'password',
            changed: $('#passwordchangeinput').val()
        }
        // console.log(toSend)
        $.ajax({
            url: '/change',
            type: 'POST',
            data: JSON.stringify(toSend),
            contentType: 'application/json',
            success: function (response) {
                localStorage.clear()
                localStorage.setItem("token", JSON.stringify(response.userinfo))
                token = JSON.parse(localStorage.getItem("token"))
                resetChangeInput()
                alert(response.message)
            },
            error: function (error) {
                console.log(error)
            }
        })
    }
})

$('#lookbuyerhistory').click(function () {
    $('#lookbuyerhistory').addClass('centerselected')
    $('#looklikelist').removeClass('centerselected')
    $('#lookcomment').removeClass('centerselected')
    if (token.kinds == 'buyer') {
        currentpage = 'buyerhistory'
    } else {
        currentpage = 'productlist'
    }
    resetCenter()
})

$('#looklikelist').click(function () {
    $('#looklikelist').addClass('centerselected')
    $('#lookbuyerhistory').removeClass('centerselected')
    $('#lookcomment').removeClass('centerselected')
    if (token.kinds == 'buyer') {
        currentpage = 'likelist'
    } else {
        currentpage = 'orderlist'
    }
    resetCenter()
})

$('#lookcomment').click(function () {
    $('#lookcomment').addClass('centerselected')
    $('#lookbuyerhistory').removeClass('centerselected')
    $('#looklikelist').removeClass('centerselected')
    if (token.kinds == 'buyer') {
        currentpage = 'comment'
    } else {
        currentpage = 'vcomment'
    }
    resetCenter()
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
                let vendor_id = 0
                for (let i = 0; i < globalproduct.length; i++) {
                    if (globalproduct[i][0] == currentproductid) {
                        vendor_id = globalproduct[i][10]
                        break
                    } 
                }
                let toSend = {
                    Conent: usercomment,
                    Buyer_id: token.id,
                    Buyer_name: token.name,
                    Product_id: currentproductid,
                    Vendor_id: vendor_id
                }
                // console.log(toSend)
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
        if (globalcomment[i][6] == productid) {
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
    checkeddatas = []
    $('#mainpage').css('display', 'block')
    $('#loginpage').css('display', 'none')
})

poncon.start()