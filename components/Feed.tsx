import Card from './Card'
import {useQuery, gql} from '@apollo/client'

const FEED_QUERY = gql`
  query feed($offset: Int!) {
    feed(offset: $offset) {
      entity_id
      entity_type
      fellowship
    }
  }
`;

type QueryData = {
  feed: FeedItem[]
}

type QueryVars = {
  offset: number;
}

type FeedItem = {
  entity_id: number;
  entity_type: "announcement" | "project" | "user";
  fellowship: "founders" | "angels" | "writers" | "angels-founders";
  created_ts: Date;
}

export default function Feed() {

  const {data, error, loading} = useQuery<QueryData, QueryVars>(
    FEED_QUERY,
    {
      variables: {offset: 0},
    }
  )
  const feed = data?.feed;

  if (!feed || loading || error) {
    return null
  }



  return (
    <>
      {feed.map(p => (
        <Card key={`${p.entity_id}-${p.entity_type}`}>
          <p key={`${p.entity_id}-${p.entity_type}`}> {p.entity_type} </p>
        </Card>
      ))}
    </>
  )
}