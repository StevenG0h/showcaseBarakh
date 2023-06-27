import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./slider.css";
import Card from "./card/card"

export default function SliderDetail() {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3
    };
    return (
        <div className="containerSlider">
            <Slider {...settings}>
                <Card/>
            </Slider>
        </div>
    );
}
