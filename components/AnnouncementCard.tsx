import styled from 'styled-components'
import Card from './Card'
import Markdown from './Markdown'
import {Announcement} from '../types'


type Props = {
  announcement: Announcement;
}

export default function AnnouncementCard({announcement}: Props) {
  return (
    <Card>
      <Columns>
        <ColumnRight>
          <h2>{announcement.title}</h2>
          <p>{!!announcement.created_ts && announcement.created_ts}</p>
          <p>Fellowship: {announcement.fellowship}</p>
          <Markdown>{announcement.body}</Markdown>
        </ColumnRight>
      </Columns>
    </Card>
  )
}

const Avatar = styled.img`
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
`

const Columns = styled.div`
  display: flex;
  flex-direction: row;
  min-width: 21rem;
`

const ColumnLeft = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 7rem;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 1.5rem;
`

const ColumnRight = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 14rem;
`