import productsTemplate from './product.hbs';
import desktopCart from '../cart/cart.hbs';
import cartMobTab from '../cart/cartMobileTab.hbs';
import toast from '../components/toast.hbs';

let homeSection = document.querySelector('.main-content');
let addToCartList = [];
let incOrDec = 1;

export function fetchProductsDetails() {
    console.log("in fetchProductsDetails");
    fetch('http://localhost:5000/products').then( productsData => {
        productsData.json().then( products => {
            console.log("prod",products);
            let categories = JSON.parse(localStorage.getItem('categories'));
            // console.table(categories);

            let newProducts = products.map( product => {
                return {
                    ...product,
                    name: product.name.length >=30 ? product.name.substr(0,31) : product.name,
                    description: product?.description?.length >= 100 ?
                                product.description.substr(0,101).concat("...") : product.description
                }
                    
            })

            localStorage.setItem('products', JSON.stringify(newProducts));

            homeSection.innerHTML = productsTemplate({
                products: newProducts,
                categories: categories
            })

            document.querySelectorAll('.btn-buy').forEach( eachBtn => {
                eachBtn.addEventListener('click', e => {
                    addProdductToCart(e);
                })
            })
        })
    })

}

function closeToast() {
    document.getElementById('toast').innerHTML = null;
}

function addProdductToCart(e) {
    let totalCartPrice = 0;
    let modalSection = document.getElementById('modalContent');
    let cartSection = document.querySelector('.main-content');

    console.log("selected id=",e.target.id);
    fetch('http://localhost:5000/addToCart', {method: "POST"})
        .then(resp => {
            resp.json().then( addToCardResp => {
                if(addToCardResp.response === "Success") {
                    console.log("server ok");

                    let productList =localStorage.getItem('products');
                    productList = JSON.parse(productList);
                    // console.log(productList);

                    let selectedProduct = productList?.find( prod => prod.id === e.target.id);
                    console.log(selectedProduct);

                    if(selectedProduct) {
                        selectedProduct.incOrDec = incOrDec;
                        addToCartList.push(selectedProduct);

                        // calculate totalprice of cart
                        addToCartList.map( item => {
                            item['totalProdprice'] = item.price;
                            totalCartPrice = totalCartPrice + (item.price ? item.price : 0);
                        });

                        // console.log(totalCartPrice);
                        console.log(document.body.clientWidth);
                        // if(document.body.clientWidth > 768)  {
                            modalSection.innerHTML = desktopCart({
                                products: addToCartList,
                                itemsCount: addToCartList.length,
                                totalCartPrice: totalCartPrice
                            })
                        // }
                        //  else {
                        //      console.log("width is for tab or mobile");
                        //      modalSection.innerHTML = cartSection({
                        //         products: addToCartList,
                        //         itemsCount: addToCartList.length,
                        //         totalCartPrice: totalCartPrice
                        //     })
                        //  }

                        document.getElementById('totalCartItems').innerHTML = `${addToCartList.length} &nbsp`;
                        document.querySelectorAll('.badge-cart').forEach(item => {
                            item.addEventListener("click",  event => {
                                changeProductQuantity(event);
                            });
                        });
                    }

                    document.getElementById('toast').innerHTML = toast({
                        responseMessage: addToCardResp.responseMessage
                    });
                    document.getElementById('toastCloseBtn').addEventListener('click', closeToast);
                    setTimeout(()=>document.getElementById('toast').innerHTML = null, 1000);
                    
                }
                else {
                    console.log("server not ok");                    
                }
            })
        })
}

function changeProductQuantity(e) {
    let totalCartPrice = 0;
    e.preventDefault();
    let type = e.srcElement.dataset.value;
    let id = e.srcElement.dataset.id;
    let isZero = false;
    let getZeroId;
    let cartSection = document.getElementById('modalContent');

    console.log({type}, {id});
    // console.log({totalCartPrice});

    addToCartList.map( item => {
        if( id==item.id && type == "inc") { // we can just do increment
            console.log("inc");
            id == item.id ? item.incOrDec = item.incOrDec + 1 : '';
            item.totalProdprice = item.price * item.incOrDec;

            // totalCartPrice += item.price; 

        }
        else {
            if(id==item.id &&  type == "dec") {
                console.log("dec");
                if(id==item.id && item.incOrDec == 1) { // we decrementing, if quant is 1, should make it to 0 and remove from list
                    isZero = true;
                    getZeroId = id;
                    addToCartList.splice(addToCartList.findIndex( item => item.id ==id), 1);
                }
                else {
                    id == item.id ? item.incOrDec = item.incOrDec - 1 : '';
                    item.totalProdprice = item.price * item.incOrDec;
                }
            }

        }
    });

    // if(isZero) {
    //     addToCartList.splice(addToCartList.findIndex( item => item.id ==id, 1));
    // }
    addToCartList.map( item => {
        totalCartPrice += item.totalProdprice; 
        // console.log(totalCartPrice);
    });
    cartSection.innerHTML = desktopCart({
        products: addToCartList,
        itemsCount: addToCartList.length,
        totalCartPrice: totalCartPrice
    });

    // add event listener again
    document.querySelectorAll('.badge-cart').forEach(item => {
        item.addEventListener("click",  event => {
            changeProductQuantity(event);
        });
    });
    document.getElementById('totalCartItems').innerHTML = `${addToCartList.length} &nbsp`;    

}


document.getElementById("products").addEventListener('click', fetchProductsDetails);