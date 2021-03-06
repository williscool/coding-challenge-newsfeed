import {ApolloServer, gql} from 'apollo-server-micro'
import * as resolvers from './resolvers'


// https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/#resolving-a-union
const typeDefs = gql`
  type Project {
    id: Int!
    name: String!
    description: String!
    icon_url: String!
    users: [User!]!
    created_ts: String
  }

  type User {
    id: Int!
    name: String!
    bio: String!
    avatar_url: String!
    fellowship: String!
    projects: [Project!]!
    created_ts: String
  }

  type Announcement {
    id: Int!
    title: String!
    body: String!
    fellowship: String!
    created_ts: String
  }

  union FeedItemInfo = User | Project | Announcement

  type FeedItem {
    entity_id: Int!
    entity_type: String!
    fellowship: String!
    item: FeedItemInfo
  }

  type Query {
    project(id: Int!): Project!
    user(id: Int!): User!
    announcement(id: Int!): Announcement!
    feed(offset: Int, limit: Int, userType: String, before: String!): [FeedItem!]!
  }
`;

export const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});
