import {useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/Layout'
import Feed from 'components/Feed'
import {useRouter} from 'next/router'


export default function Home() {

  const {query, events, reload} = useRouter()
  const {userType} = query

  // NOTE: this is a hack to make sure we reload the pagee each time!
  // to make sure pagination of feed works when changing usertype
  useEffect(() => {
    events.on('routeChangeStart', (url) => window.location.replace(url) )
  }, [])

  return (
    <Layout>
      <Head>
        <title>On Deck Newsfeed</title>
      </Head>
      <h1>Hello there!</h1>
      <p> newsfeed is here!</p>
      <span> Also Check out these pages:</span>
      <ul>
        <li>Project <Link href="/projects/10">Blue Onion Labs</Link></li>
        <li>User <Link href="/users/11">Cai Burris</Link></li>
      </ul>

      <Feed userType={(userType || 'admin') as string}/>
    </Layout>
  )
}
