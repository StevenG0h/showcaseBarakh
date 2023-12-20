import HTMLFlipBook from "react-pageflip";

export default function flipbook ({children}){
    return (
        <>
        <HTMLFlipBook showCover={false} size="stretch" width={551} height={780} minWidth={'100'} minHeight={'200'}>
            {children}
        </HTMLFlipBook>
      
    </>
    )
}