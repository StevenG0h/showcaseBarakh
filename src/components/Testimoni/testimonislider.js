import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../app/testimonislider.css";
import Card from "../card/page";

const theme = {
    
}

export default function Testimoni({testimoni}) {
    const settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 3,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        centerMode: true,
        responsive: [
            {
                breakpoint: 768,
                settings: { slidesToShow: 2, slidesToScroll: 1, infinite: true }
            },
            {
                breakpoint: 480,
                settings: { slidesToShow: 1, slidesToScroll: 1, infinite: true }
            }
        ]
    };
    return (
        <div className="container">
        <div className="containerTest">
            <h2 className="titleTest">Komentar Mereka</h2>
            <Slider  {...settings}>
                {
                    testimoni.map((map)=>{
                        return <Card row={map}></Card>
                    })
                }
            </Slider>
        </div>
        </div>
    );
}
