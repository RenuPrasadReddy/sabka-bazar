import "../styles/main.scss";
import content from '../components/content.hbs';
import slider from '../components/slider.hbs';
import categoryList from '../components/categoryList.hbs';
// import products from '../products/product.hbs';
import {fetchProductsDetails} from '../products/products';

let path = window.location.pathname.replace('/', '');
// console.log("path", path);
let homeSection = document.querySelector('.main-content');

document.getElementById('start-shopping').addEventListener('click', () => {
    fetchProductsDetails();
})

document.getElementById('home').addEventListener('click', () => {
    fetchHomepageDetails();
})

function fetchHomepageDetails() {
    homeSection.innerHTML = content();
    fetch("http://localhost:5000/banners").then(response => {
        response.json().then(banners => {
            // console.log(banners);

            // change the order bcoz order should start from 0
            let newBanners = banners.map( (banner, index) => {
                return {
                    ...banner,
                    isActive: index === 0 ? true : false,
                    order: banner.order ? banner.order- 1 : banner.order
                }
            })
            // console.table(newBanners);

            // insert carousel
            let carouselSection = document.querySelector('.carousel-banner');
            carouselSection.innerHTML = slider({
                banners : newBanners
            });
        })
    })


    // to fetch categories
    fetch("http://localhost:5000/categories").then(response => {
        response.json().then( categories => {
            console.table(categories);
            let categorySection = document.querySelector('.category-details');
            
            // sort in ascending based on order
            categories.sort(function(a,b){
                return a.order - b.order;
            });

            // remove items with negative order
            let newCategories = categories.filter( category => category.order >= 0);
            // console.table(newCategories);

            // store in localstorage, to access it later in another place (in products)
            localStorage.setItem("categories", JSON.stringify(newCategories));

            categorySection.innerHTML = categoryList({
                categories: newCategories
            });


            
        })
    })
}


if(!path) {
    fetchHomepageDetails();
}