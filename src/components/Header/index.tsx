import Link from 'next/link'
import { SignInButton } from '../SignInButton'
import styles from './style.module.scss'
import Image from 'next/image'
import logo from '../../../public/images/logo.png'

export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href='/'>
                    <Image src={logo} alt="Logo top" width={60} height={60} color="red" />
                </Link>
                <nav>
                    <Link href='/'>
                        Home
                    </Link>
                    <Link href='/board'>
                        Meu Board
                    </Link>
                </nav>

                <SignInButton />
            </div>
        </header>
    )
}