import productsTemplate from './product.hbs';
import newCart from '../components/cart.hbs';

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

function addProdductToCart(e) {
    let totalCartPrice = 0;
    let modalSection = document.getElementById('modalContent');
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
                            totalCartPrice = totalCartPrice + (item.price ? item.price : 0);
                        });

                        console.log(totalCartPrice);
                        modalSection.innerHTML = newCart({
                            products: addToCartList,
                            itemsCount: addToCartList.length,
                            totalCartPrice: totalCartPrice
                        })
                    }
                }
                else {
                    console.log("server not ok");                    
                }
            })
        })
}


document.getElementById("products").addEventListener('click', fetchProductsDetails);