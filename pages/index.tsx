import Head from 'next/head'
import Link from 'next/link'
import Layout from 'components/Layout'
import Feed from 'components/Feed'

export default function Home() {
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

      <Feed/>
    </Layout>
  )
}
