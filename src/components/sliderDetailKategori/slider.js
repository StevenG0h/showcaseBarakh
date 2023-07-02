import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import Card from "./card/card"

export default function SliderDetail() {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true,
        centerMode: true,
    };
    return (
        <main className="heroCard">
            <div className="container">
                <p className="title">Produk Unit Usaha</p>
                <div className="underline"></div>
            </div>
            <div className="containerSlider">
                <Slider {...settings}>
                    <Card />
                    <Card />
                    <Card />
                    <Card />
                </Slider>
            </div>
        </main>
    );
}
