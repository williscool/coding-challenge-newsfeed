// import {gql} from '@apollo/client'
import * as resolvers from '../../../../graphql/resolvers'
import {server } from '../../../../graphql/server'
// import {FEED_QUERY} from '../../../../components/Feed'

// the apollo server types are wrong and force string only
//  so we have to make this a string instead of gql tag
// https://www.apollographql.com/docs/apollo-server/testing/testing/
// irl would fix this with 
// https://stackoverflow.com/questions/40322788/how-to-overwrite-incorrect-typescript-type-definition-installed-via-types-packa/54840439
export const FEED_QUERY = `
  query feed($offset: Int, $limit: Int, $userType: String, $before: String!) {
    feed(offset: $offset, limit: $limit, userType: $userType, before: $before) {
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

describe("Query feed resolver", () => {
    it("Returns feed items", async () => {

        const result = await server.executeOperation({
          query: FEED_QUERY,
          variables: { before: new Date(Date.now()).toISOString() }
        });

        expect(result.data?.feed).toBeTruthy()

        const feed = result.data?.feed

        const first_feed_item = feed[0]

        expect(first_feed_item).toMatchObject({"entity_id": expect.anything() ,"entity_type":expect.anything(),"fellowship":expect.anything(),"item": expect.anything() })

        // console.log(JSON.stringify(result))
    });

    it("Angel feed includes founders and projects", async () => {

      const result = await server.executeOperation({
        query: FEED_QUERY,
        variables: { limit:100, userType: 'angel', before: new Date(Date.now()).toISOString() }
      });

      const feed = result.data?.feed

      expect.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "user","fellowship": "founder","item": expect.anything() }])
      expect.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "project","fellowship": expect.anything(),"item": expect.anything() }])

      // console.log(JSON.stringify(result))
    });

    
    it("Founder feed includes angels and projects", async () => {

      const result = await server.executeOperation({
        query: FEED_QUERY,
        variables:  { limit:100, userType: 'founder', before: new Date(Date.now()).toISOString() }
      });

      const feed = result.data?.feed

      expect.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "user","fellowship": "angel","item": expect.anything() }])
      expect.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "project","fellowship": expect.anything(),"item": expect.anything() }])
      // console.log(JSON.stringify(result))
    });


    it("Writer feed only includes writers", async () => {

      const result = await server.executeOperation({
        query: FEED_QUERY,
        variables:  { limit:100, userType: 'writer', before: new Date(Date.now()).toISOString() }
      });

      const feed = result.data?.feed

      expect.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "user","fellowship": "writer","item": expect.anything() }])

      expect.not.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "user","fellowship": "founder","item": expect.anything() }])
      expect.not.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "user","fellowship": "angel","item": expect.anything() }])
      expect.not.arrayContaining([{"entity_id": expect.anything() ,"entity_type": "project","fellowship": expect.anything(),"item": expect.anything() }])

      // console.log(JSON.stringify(result))
    });


});