import HTMLFlipBook from "react-pageflip";

export default function flipbook ({children}){
    return (
        <>
        <HTMLFlipBook showCover={true} size="stretch" width={551} height={780} minWidth={'100'} minHeight={'200'}>
            {children}
        </HTMLFlipBook>
      
    </>
    )
}