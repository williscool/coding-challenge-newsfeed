import { useState } from 'react';
import Card from './Card'
import UserCard from 'components/UserCard'
import ProjectCard from 'components/ProjectCard'
import {useQuery, gql, resetCaches, NetworkStatus } from '@apollo/client'
import {User, Project, Announcement} from '../types'

import InfiniteScroll from "react-infinite-scroll-component";
import Loader from 'react-loader';

import Skeleton from 'react-loading-skeleton';
import { useForm } from 'react-hook-form';

const ADMIN_USER = 'admin';
const ANGEL_USER = 'angel';
const WRITER_USER = 'writer';
const FOUNDER_USER = 'founder';

const USER_TYPES = [ADMIN_USER, ANGEL_USER, WRITER_USER, FOUNDER_USER];

const FEED_QUERY = gql`
  query feed($offset: Int, $limit: Int, $userType: String) {
    feed(offset: $offset, limit: $limit, userType: $userType) {
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
          projects {
            name
          }
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
  userType: string;
}

type FeedItem = {
  entity_id: number;
  entity_type: "announcement" | "project" | "user";
  fellowship: "founders" | "angels" | "writers" | "angels-founders";
  created_ts: Date;
  item: User | Project | Announcement
}

type feedStateType = {
  offset: number
  hasMore: boolean
  currentFeedUserType: string
}

const loaderOptions = {
  lines: 13,
  length: 20,
  width: 10,
  radius: 30,
  scale: 1.00,
  corners: 1,
  color: '#000',
  opacity: 0.25,
  rotate: 0,
  direction: 1,
  speed: 1,
  trail: 60,
  fps: 20,
  zIndex: 2e9,
  bottom: '0',
  right: '0',
  shadow: false,
  hwaccel: false,
  position: 'fixed'
};


export default function Feed() {

  const { handleSubmit, register } = useForm();
  const [feedState, setFeedState] = useState<feedStateType>({offset:0, hasMore: true, currentFeedUserType: ADMIN_USER});
  const [selectedFeedUserType, setSelectedFeedUserType] = useState(ADMIN_USER);

  const {offset, hasMore, currentFeedUserType} = feedState;

  const {data, error, loading, refetch, fetchMore, networkStatus} = useQuery<QueryData, QueryVars>(
    FEED_QUERY, {variables: {offset, userType: currentFeedUserType}, fetchPolicy: 'cache-and-network' }
  )
  const feed = data?.feed;

  if (!feed || loading || error || networkStatus === NetworkStatus.refetch) {
    return <Skeleton count={7} height={200} />
  }

  debugger
  return (
    <>
        <form onSubmit={handleSubmit((data) => {
          console.log(data)                                                          
          debugger
          refetch({ 
              userType: data.userType,
              offset: data.length // feed length updated from apollo cache. offset state just used for uniq keys now
          }).then(() => {
            // NOTE: you would want to add the feed type to the data model irl ... this just updates it for subsequet queires
            // it causese an uncessary extra render
            setFeedState({offset: 0, hasMore: true, currentFeedUserType: data.userType })
          })
        })}>
          <label>
            Simulate feed for user type: 
            <select {...register('userType')} value={selectedFeedUserType} onChange={(e) =>  setSelectedFeedUserType(e.target.value)} >
              {USER_TYPES.map((uType) => {
                return <option value={uType} key={uType}>
                        {uType}
                      </option>
              })}
            </select>
          </label>

          <input type="submit" value="Submit" />
        </form>
        <InfiniteScroll
          dataLength={feed.length}
          next={()=>
              // https://stackoverflow.com/questions/62742379/apollo-3-pagination-with-field-policies
              fetchMore({
                variables: {
                  userType: currentFeedUserType,
                  offset: feed.length // feed length updated from apollo cache. offset state just used for uniq keys now
                }
              })
              .then((fetchMoreResult) =>{
                console.log(fetchMoreResult)
                // https://www.apollographql.com/docs/react/pagination/offset-based/#using-with-a-paginated-read-function
                setFeedState({offset: offset + fetchMoreResult.data.feed.length, hasMore: fetchMoreResult.data.feed.length !== 0 , currentFeedUserType})
              })
          }
          endMessage={
            <p style={{ textAlign: 'center' }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          hasMore={hasMore}
          loader={<Loader loaded={false} options={loaderOptions} className="spinner" />}
          >
          {feed.map((feedItem) => {
            const key = `offset-${offset}-${feedItem.entity_id}-${feedItem.entity_type}`;

            let retComp = <Card key={key}>
              <p key={key}> {feedItem.entity_type} </p>
            </Card>

            if(feedItem.entity_type === "user"){
              retComp = <UserCard user={feedItem.item as User} />
            }

            if(feedItem.entity_type === "project"){
              retComp = <ProjectCard project={feedItem.item as Project} />
            }

            return retComp;
          })}
        </InfiniteScroll>
    </>
  )
}