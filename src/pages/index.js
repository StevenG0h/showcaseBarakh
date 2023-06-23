
import { Inter } from 'next/font/google'
import Header from '../../component/header/header'
import { Poppins } from 'next/font/google'


const poppins = Poppins({
  weight: '500',
  subsets: ['latin'],
  // display: 'swap'
})

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={poppins.className}>
      <Header/>
    </main>
  )
}
