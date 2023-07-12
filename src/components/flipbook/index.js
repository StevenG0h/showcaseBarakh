import HTMLFlipBook from "react-pageflip";

export default function flipbook (){
    return (
        <>
        <HTMLFlipBook size="stretch" width={'300'} height={'210'}>
            <img key={1} src="http://localhost:3000/assets/image/logo.png"/>
            <img key={2} src="http://localhost:3000/assets/image/banner.png"/>
            <img key={3} src="http://localhost:3000/assets/image/banner2.png"/>
            <img key={4} src="http://localhost:3000/assets/image/logo.png"/>
        </HTMLFlipBook>
      
    </>
    )
}