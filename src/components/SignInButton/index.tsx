import { signIn, signOut, useSession } from 'next-auth/client'

import styles from './style.module.scss'
import { FaGithub } from 'react-icons/fa'
import { FiX } from 'react-icons/fi'

export function SignInButton() {
    const [session] = useSession();

    return session ? (
        <button
            type='button'
            className={styles.signInButton}
            onClick={() => signOut()}
        >
            <img src={session.user?.image??''} alt={ session.user?.name??'' } title={ session.user?.name??'' } />
            Olá { session.user?.name?.split(' ')[0] }
            <FiX color='#737380' className={styles.closeIcon} title="Deseja fazer logoff" />
        </button>
    ) : (
        <button
            type='button'
            className={styles.signInButton}
            onClick={() => signIn('github')}
        >
            <FaGithub color='#ffb800' />
            Entrar com Github
        </button>
    )
}