import Link from 'next/link'
import styles from './style.module.scss'

export function SuporteButton (){
    return (
        <div className={styles.doanteContainer}>
            <Link href='/donate'>
            <button>Apoiar</button>
            </Link>
        </div>
    )
}