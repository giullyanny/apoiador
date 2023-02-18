import firebase from '../services/firebase-connection'
import { GetStaticProps } from 'next'
import Head from 'next/head'
import styles from '/src/style/home.module.scss'
import { useState } from 'react'

interface HomeProps {
  data: string;
}

type Data = {
  id: string,
  donate: boolean,
  lastDonate: Date,
  image: string
}

export default function Home({ data }: any) {
  const [donaters, setDonaters] = useState<Data[]>(JSON.parse(data));

  return (
    <>
      <Head>
        <title>Board - Organizador de tarefas</title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/board-user.svg" alt="Ferramenta Board" />
        <section className={styles.callToAction}>
          <h1>Uma ferramenta para seu dia a dia Escreva, planeje e organize-se...</h1>
          <p><span>100% Gratuita</span> e online</p>
        </section>

        {donaters.length !== 0 && <h3>Apoiadores</h3>}
        <div className={styles.donaters}>
          {donaters.map(i => (
            <img key={i.id} src={i.image} alt={`Doador: ${i.image}`} />
          ))}
        </div>
      </main>
    </>
  )
}


export const getStaticProps: GetStaticProps = async () => {

  const donaters = await firebase.firestore().collection('users').get();

  const data = JSON.stringify(donaters.docs.map(u => {
    return {
      id: u.id,
      ...u.data()
    }
  }))

  return {
    props: {
      data
    }, revalidate: 60 * 60 // revalidado a cada 60min
  }
}