"use client"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import style from "./slider.module.css"
// import './slider.css'
import style from "./slider.module.css"
import Image from "next/image";
import ProductImage from "../../public/assets/images/Free_Toiletry.png";

const SliderImages = () => {
    const settings = {
        arrows: false,
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        verticalSwiping: false,
        accessibility: false  
    };
    return (
        <div className="slider_image">
            <Slider {...settings}>
                <div>
                <Image className={style.imageProduct} src={ProductImage} alt="ProductImage"/>
                </div>
                <div> 
                <Image className={style.imageProduct} src={ProductImage} alt="ProductImage"/>
                </div>
                <div>
                <Image className={style.imageProduct} src={ProductImage} alt="ProductImage"/>
                </div>
            </Slider>
        </div>
    );
}

export default SliderImages;