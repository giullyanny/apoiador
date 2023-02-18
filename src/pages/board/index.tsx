
import Head from 'next/head'
import { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/client'

import styles from './board.module.scss'
import { FiCalendar, FiClock, FiEdit2, FiPlus, FiTrash, FiX } from 'react-icons/fi'
import { SuporteButton } from '@/components/SupportButton'
import { useState, FormEvent } from 'react'
import firebase from '../../services/firebase-connection'
import { format, formatDistance } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Link from 'next/link'

type TaskList = {
  id: string,
  created: Date,
  createdFormat?: string,
  task: string,
  userId: string,
  userName: string
}

interface BoardProps {
  user: {
    id: string,
    nome: string,
    vip: boolean,
    lastDonate: string | Date
  },
  data: string
}

export default function Board({ user, data }: BoardProps) {
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState<TaskList[]>(JSON.parse(data));
  const [taskEdit, setTaskEdit] = useState<TaskList | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input?.trim() === '') {
      alert("Digita alguma coisa porra?")
      return;
    }

    if (taskEdit) {
      await firebase.firestore().collection('tarefas')
        .doc(taskEdit.id)
        .update({
          task: input
        })
        .then(() => {
          let data = taskList;
          let taskIndex = taskList.findIndex(i => i.id === taskEdit.id)

          data[taskIndex].task = input
          setTaskList(data);

          setInput('')
          setTaskEdit(null)
        })

      return;
    }

    await firebase.firestore().collection('tarefas').add({
      created: new Date(),
      userId: user.id,
      userName: user.nome,
      task: input
    })
      .then((doc) => {
        let data = {
          id: doc.id,
          created: new Date(),
          createdFormat: format(new Date(), 'dd MMMM yyyy'),
          task: input,
          userId: user.id,
          userName: user.nome
        }

        setTaskList([...taskList, data]);
        setInput('');
      })
      .catch((error) => {
        console.log("Error: ", error)
      })
  }

  async function handleDelete(id: string) {
    await firebase.firestore().collection('tarefas').doc(id).delete()
      .then(() => {
        alert('deletado com sucesso!')

        let taskDeleted = taskList.filter(i => {
          return (i.id != id)
        });

        setTaskList(taskDeleted)
      })
      .catch((error) => {
        alert('fudeu! deu erro: ' + error)
      })
  }

  function handleEdit(task: TaskList): void {
    setTaskEdit(task);
    setInput(task.task);
  }

  function handleCancelEdit(): void {
    setTaskEdit(null);
    setInput('');
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.taskListEditWarn}>
            <button onClick={handleCancelEdit}>
              <FiX size={30} color='#ff3526' />
            </button>
            Você está editando uma tarefa!
          </span>
        )}
        <form onSubmit={handleAddTask}>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder='Digite sua tarefa' />
          <button type='submit'>
            <FiPlus size={25} color='#117811f' />
          </button>
        </form>

        <h1>Você tem {taskList.length} tarefa{taskList.length > 1 ? 's' : ''}!</h1>
        <section>
          {taskList.map(task => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.task}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#ffb800" />
                    <time>{task.createdFormat}</time>
                  </div>

                  {user.vip && (
                    <button onClick={() => handleEdit(task)}>
                      <FiEdit2 size={20} color="#fff" />
                      <span>Editar</span>
                    </button>
                  )}
                </div>

                <button onClick={() => handleDelete(task.id)}>
                  <FiTrash size={20} color="#ff3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
        
      </main>
      {user.vip && (
        <div className={styles.vipContainer}>
          <h3>Obrigado por apoiar esse projeto.</h3>
          <div>
            <FiClock size={26} color='#fff' />
            <time>
              
              Última doação foi {formatDistance(new Date(user.lastDonate), new Date(), { locale: ptBR })}.
            </time>
          </div>
        </div>
      )}

      <SuporteButton />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  
  if (!session?.id) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const tasks = await firebase.firestore().collection('tarefas')
    .where('userId', '==', session?.id)
    .orderBy('created', 'asc').get();

  const data = JSON.stringify(tasks.docs.map(t => {
    return {
      id: t.id,
      createdFormat: format(t.data().created.toDate(), 'dd MMMM yyyy'),
      ...t.data()
    }
  }));


  const user = {
    nome: session?.user?.name,
    id: session?.id,
    vip: session?.vip,
    lastDonate: session?.lastDonate,
  }

  return {
    props: {
      user,
      data
    }
  }
}

