import { useState } from 'react';
import Card from './Card'
import {useQuery, gql} from '@apollo/client'

import InfiniteScroll from "react-infinite-scroll-component";

const FEED_QUERY = gql`
  query feed($offset: Int, $limit: Int) {
    feed(offset: $offset, limit: $limit) {
      entity_id
      entity_type
      fellowship
      item {
        ... on Announcement{
          title
          body
          fellowship
        }
        ... on Project{
          name
          description
          icon_url
          users {
            name
          }
        }
        ... on User{
          name
          bio
          fellowship
          avatar_url
        }
      }
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

type feedStateType = {
  offset: number
  hasMore: boolean
}

export default function Feed() {

  const [feedState, setFeedState] = useState<feedStateType>({offset:0, hasMore: true});

  const {offset, hasMore} = feedState;

  const {data, error, loading, fetchMore} = useQuery<QueryData, QueryVars>(
    FEED_QUERY,
  )
  const feed = data?.feed;

  if (!feed || loading || error) {
    return null
  }

  return (
    <>
      {
        <InfiniteScroll
          dataLength={feed.length}
          next={()=>
              // https://stackoverflow.com/questions/62742379/apollo-3-pagination-with-field-policies
              fetchMore({
                variables: {
                  offset: feed.length // feed length updated from apollo cache. offset state just used for uniq keys now
                }
              })

              .then((fetchMoreResult) =>{
                console.log(fetchMoreResult)
                // https://www.apollographql.com/docs/react/pagination/offset-based/#using-with-a-paginated-read-function
                setFeedState({offset: offset + fetchMoreResult.data.feed.length, hasMore: fetchMoreResult.data.feed.length !== 0 })
              })
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          >
          {feed.concat(feed).map((feedItem) => {
            const key = `offset-${offset}-${feedItem.entity_id}-${feedItem.entity_type}`;
            return <Card key={key}>
                     <p key={key}> {feedItem.entity_type} </p>
                  </Card>
          })}
        </InfiniteScroll>
      }
    </>
  )
}