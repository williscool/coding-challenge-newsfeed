import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/router'

import Link from 'next/link'
import Card from './Card'
import UserCard from 'components/UserCard'
import ProjectCard from 'components/ProjectCard'
import AnnouncementCard from 'components/AnnouncementCard'

import {useQuery, gql, NetworkStatus } from '@apollo/client'
import {User, Project, Announcement} from '../types'

import InfiniteScroll from "react-infinite-scroll-component";
import Loader from 'react-loader';

import Skeleton from 'react-loading-skeleton';

const ADMIN_USER = 'admin';
const ANGEL_USER = 'angel';
const WRITER_USER = 'writer';
const FOUNDER_USER = 'founder';

const USER_TYPES = [ADMIN_USER, ANGEL_USER, WRITER_USER, FOUNDER_USER];

export const FEED_QUERY = gql`
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
          created_ts
        }
        ... on Project{
          name
          description
          icon_url
          created_ts
          users {
            id
            name
          }
        }
        ... on User{
          name
          bio
          fellowship
          avatar_url
          created_ts
          projects {
            id
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

type Props = {
  userType: string
}

export default function Feed({userType}: Props) {

  const { handleSubmit, register } = useForm();
  const router = useRouter()
  const [feedState, setFeedState] = useState<feedStateType>({offset:0, hasMore: true});
  const [selectedFeedUserType, setSelectedFeedUserType] = useState(userType);

  const {offset, hasMore} = feedState;

  const {data, error, loading, fetchMore } = useQuery<QueryData, QueryVars>(
    FEED_QUERY, {variables: {offset, userType } } // irl use cache-first but hard to work with user type change
  )
  const feed = data?.feed;

  if (!feed || loading || error) {
    return <Skeleton count={7} width={300} height={200} />
  }

  return (
    <>
        <form onSubmit={handleSubmit((data) => {
          console.log(data)

          router.push({
            pathname: '/',
            query: { userType: data.userType },
          }).then(()=> router.reload())
          
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
        
        <p>Current feed user type: {userType}</p>
        <InfiniteScroll
          dataLength={feed.length}
          next={()=>
              // https://stackoverflow.com/questions/62742379/apollo-3-pagination-with-field-policies
              fetchMore({
                variables: {
                  userType,
                  offset: feed.length // feed length updated from apollo cache. offset state just used for uniq keys now
                }
              })
              .then((fetchMoreResult) =>{
                console.log(fetchMoreResult)
                // https://www.apollographql.com/docs/react/pagination/offset-based/#using-with-a-paginated-read-function
                setFeedState({offset: offset + fetchMoreResult.data.feed.length, hasMore: fetchMoreResult.data.feed.length !== 0})
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

            if(feedItem.entity_type === "announcement"){
              retComp = <AnnouncementCard announcement={feedItem.item as Announcement} />
            }

            return retComp;
          })}
        </InfiniteScroll>
    </>
  )
}