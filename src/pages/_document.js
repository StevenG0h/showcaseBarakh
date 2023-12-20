import { Html, Head, Main, NextScript } from 'next/document'


export default function Document() {
  return (
    <Html lang="en">
      <Head />
        <body style={{backgroundColor: "#081B1C", width: '100%' , overflowX: "hidden", margin: '0px'}}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
