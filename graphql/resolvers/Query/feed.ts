import db, {FeedItemsRow} from '../../db'

const LIMIT = 10;

type Args = {
  offset: number;
}

// https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/

export default async function feed(parent: unknown, {offset = 0}: Args): Promise<FeedItemsRow[]> {
  const feed_items: FeedItemsRow[] | undefined = await db.getAll(
    `SELECT id as entity_id, "announcement" as entity_type, fellowship, created_ts FROM announcements 
    UNION ALL
    SELECT id as entity_id, "user" as entity_type, fellowship, created_ts FROM users
    UNION ALL
    SELECT id as entity_id, "project" as entity_type, "angels-founders" as fellowship, created_ts FROM projects
    ORDER BY created_ts DESC LIMIT ${LIMIT} OFFSET ?;
    `, [offset]
  )
  if (!feed) {
    throw new Error(`feed at ${offset} not found!`)
  }
  return feed_items;
}
