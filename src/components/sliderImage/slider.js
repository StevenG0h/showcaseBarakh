"use client"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import style from "./slider.module.css"
// import './slider.css'
import style from "./slider.module.css"
import Image from "next/image";
import ProductImage from "../../../public/assets/images/Free_Toiletry.png";

const SliderImages = ({produk}) => {
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
                {
                    produk.map((data)=>{
                        console.log(data.product_images)
                        return (
                            <div key={data.id} className={style.wrap}>
                                <img className={style.imageProduct} src={process.env.NEXT_PUBLIC_BACKEND_URL+"/storage/product/"+data.product_images[0].path} alt="ProductImage"/>
                            </div>
                        )
                    })
                }
            </Slider>
        </div>
    );
}

export default SliderImages;