import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Head from 'next/head';
import styles from './style.module.scss'
import { PayPalButtons } from '@paypal/react-paypal-js'
import firebase from '../../services/firebase-connection'
import { useState } from 'react';
import Image from 'next/image';
import rocket from '../../../public/images/rocket.svg'

//cliente id: AYN7TWpomNsrWmP_f0Yw5cJtaK5wXPGzVVSxGoSpRfb0kFTuyQ89d3WkUADm2zbOyqSb4kmV_075PF0S
//<script src="https://www.paypal.com/sdk/js?client-id=YOUR_CLIENT_ID"></script>


interface DonateProps {
    user: {
        nome: string,
        id: string,
        image: string,
    }
}

export default function Donate({ user }: DonateProps) {
    const [vip, setVip] = useState(false)


    async function handleSaveDonate() {
        await firebase.firestore().collection('users')
            .doc(user.id).set({
                donate: true,
                lastDonate: new Date(),
                image: user.image
            })
            .then(() => {
                setVip(true)
            })
    }

    return (
        <>
            <Head>
                <title>Ajude a plataforma board ficar online!</title>
            </Head>
            <main className={styles.container}>
                <Image src={rocket} alt='Seja um apoiador' />

                {(vip) && (
                    <div className={styles.vip}>
                        <img src={user.image} alt={user.nome} />
                        <span>Parabéns você é um novo apoiador!</span>
                    </div>
                )}

                <h1>Seja um apoiador deste projeto! 🏆</h1>
                <h3>Contribua com apenas <span>R$ 1,00</span></h3>
                <strong>Apareça na nossa home, tenha funcionalidades esclusivas.</strong>
                <PayPalButtons
                    createOrder={(data, actions) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: '1'
                                }
                            }]
                        })
                    }}
                    onApprove={async (data, actions) => {
                        return actions.order?.capture().then(async function (details) {
                            await handleSaveDonate()
                        })
                    }}
                />
            </main>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
    const session: any = await getSession({ req });

    console.log(session)

    if (!session?.id) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        }
    }

    const user = {
        nome: session?.user.name,
        id: session?.id,
        image: session?.user.image,
        vip: session?.vip
    }

    return {
        props: {
            user
        }
    };
}