import db, {UserRow, ProjectRow, FeedItemsRow, AnnouncementRow} from '../../db'

import {user, project, announcement} from "../Query"

// call out to project , anncoucments and such to get info to pupulate mesg.

// TODO: then we can do infinte scroll

// then drop down to show diff users types


// then we shouwl all the parts of the feed items in the ui

// https://stackoverflow.com/a/48241313/511710

type Item =  UserRow | ProjectRow | AnnouncementRow | null

export default async function feed_item(feed_item_row: FeedItemsRow): Promise<Item> {

  let item = null;

  if(feed_item_row.entity_type === "user"){
    // https://www.apollographql.com/docs/apollo-server/data/resolvers/
    
    item = await user(null, {id: feed_item_row.entity_id})
    item.entity_type = feed_item_row.entity_type
  }

  if(feed_item_row.entity_type === "project"){
    // https://www.apollographql.com/docs/apollo-server/data/resolvers/
    item = await project(null, {id: feed_item_row.entity_id})
    item.entity_type = feed_item_row.entity_type
  }
  
  if(feed_item_row.entity_type === "announcement"){
    // https://www.apollographql.com/docs/apollo-server/data/resolvers/
    item = await announcement(null, {id: feed_item_row.entity_id})
    item.entity_type = feed_item_row.entity_type
  }

  if (!item) {
    throw new Error(`feed_item type: ${feed_item_row.entity_type} with id: ${feed_item_row.entity_id} not found`)
  }

  //TODO: put soemthing on the item object so that the __resolveType thing can sort this out

  return item;
}