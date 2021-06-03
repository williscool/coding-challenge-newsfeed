import { useState } from 'react';
import Card from './Card'
import {useQuery, gql} from '@apollo/client'

import InfiniteScroll from "react-infinite-scroll-component";

const OFFSET_INCREMENT = 10;

const FEED_QUERY = gql`
  query feed($offset: Int!) {
    feed(offset: $offset) {
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
  allItems: FeedItem[]
}

export default function Feed() {

  const [feedState, setFeedState] = useState<feedStateType>({offset:0, allItems: [] });

  const {offset, allItems} = feedState;

  const {data, error, loading, fetchMore} = useQuery<QueryData, QueryVars>(
    FEED_QUERY,
    {
      variables: {offset},
    }
  )
  const feed = data?.feed;

  if (!feed || loading || error) {
    return null
  }

  allItems.concat(feed);

  return (
    <>
      {feed.map(p => (
        <InfiniteScroll
          dataLength={allItems.length}
          next={()=>{

              fetchMore({
                variables: {
                  offset
                },
              })

              setFeedState({offset: offset + OFFSET_INCREMENT, allItems})
            } 
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          hasMore={feed.length === 0}
          loader={<h4>Loading...</h4>}
          >
          {feed.map((feedItem) => (

            <Card key={`${feedItem.entity_id}-${feedItem.entity_type}`}>
              <p> {feedItem.entity_type} </p>
            </Card>

          ))}
        </InfiniteScroll>
      ))}
    </>
  )
}