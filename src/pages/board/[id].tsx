import { format } from "date-fns"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import styles from './detalhe.module.scss'

import firebase from '../../services/firebase-connection'
import Head from "next/head"
import { FiCalendar } from "react-icons/fi"
import { ParsedUrlQuery } from "querystring"

type Task = {
    id: string,
    created: Date | any,
    createdFormat?: string,
    task: string,
    userId: string,
    userName: string
}

interface TaskProps {
    data: string
}

export default function Task({ data }: TaskProps) {
    const task = JSON.parse(data) as Task

    return (
        <>
            <Head>
                <title>Detalhes: {task.task}</title>
            </Head>
            <article className={styles.container}>
                <div className={styles.actions}>
                    <div>
                        <FiCalendar size={30} color='#fff' />
                        <span>Tarefa criada:</span>
                        <time>{task.createdFormat}</time>
                    </div>
                </div>
                <p>{task.task}</p>
            </article>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {

    const id = (params as ParsedUrlQuery).id
    const session = await getSession({ req });

    if (!session?.vip) {
        return {
            redirect: {
                destination: '/board',
                permanent: false,
            }
        }
    }

    const data = await firebase.firestore().collection('tarefas')
        .doc(String(id))
        .get()
        .then((snapshot) => {
            const t: Task = snapshot.data() as Task;

            const data = {
                id: snapshot.id,
                created: t.created,
                createdFormat: format(t.created.toDate(), 'dd MMMM yyyy'),
                userId: t.userId,
                userName: t.userName,
                task: t.task,
            }

            return JSON.stringify(data);
        })
        .catch((error) => {
            console.log("ERROR: " + error)
            return {};
        });

    if (Object.keys(data).length === 0) {
        return {
            redirect: {
                destination: '/board',
                permanent: false,
            }
        }
    }

    return {
        props: {
            data
        }
    }
}