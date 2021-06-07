import db, {FeedItemsRow} from '../../db'

const DEFAULT_LIMIT = 10;

type Args = {
  limit: number;
  offset: number;
  userType: string;
  before: string;
}

// https://www.apollographql.com/docs/apollo-server/schema/unions-interfaces/

export default async function feed(parent: unknown, {limit = DEFAULT_LIMIT, offset = 0, userType = 'admin', before}: Args): Promise<FeedItemsRow[]> { 
  let feed_items: FeedItemsRow[] | undefined = undefined;

  // NOTE: default to admin ... irl would not want to make this query twice... but left like this for the compiler
  feed_items = await db.getAll(
    `SELECT * FROM (SELECT id as entity_id, "announcement" as entity_type, fellowship, created_ts FROM announcements 
    UNION ALL
    SELECT id as entity_id, "user" as entity_type, fellowship, created_ts FROM users
    UNION ALL
    SELECT id as entity_id, "project" as entity_type, "angels-founders" as fellowship, created_ts FROM projects
    ) WHERE created_ts <= DATE(?) ORDER BY created_ts DESC LIMIT ? OFFSET ?;
    `, [before, limit, offset]
  )

  if(userType === 'writer') {
    feed_items = await db.getAll(
      `SELECT * FROM (SELECT id as entity_id, "announcement" as entity_type, fellowship, created_ts FROM announcements WHERE fellowship = 'writers' OR fellowship = 'all'
      UNION ALL
      SELECT id as entity_id, "user" as entity_type, fellowship, created_ts FROM users WHERE fellowship = 'writers'
      ) WHERE created_ts <= DATE(?) ORDER BY created_ts DESC LIMIT ? OFFSET ?
      `, [before, limit, offset]
    )
  }

  // NOTE would also refactor this into a function since angel and founders query is similar
  if(userType === 'founders') {
    feed_items = await db.getAll(
      `SELECT * FROM (SELECT id as entity_id, "announcement" as entity_type, fellowship, created_ts FROM announcements WHERE fellowship = 'founders' OR fellowship = 'all'
      UNION ALL
      SELECT id as entity_id, "user" as entity_type, fellowship, created_ts FROM users WHERE fellowship = 'founders' OR fellowship = 'angels'
      UNION ALL
      SELECT id as entity_id, "project" as entity_type, "angels-founders" as fellowship, created_ts FROM projects
      ) WHERE created_ts <= DATE(?) ORDER BY created_ts DESC LIMIT ? OFFSET ?;
      `, [before, limit, offset]
    )
  }
  

  if(userType === 'angel') {
    feed_items = await db.getAll(
      `SELECT * FROM (SELECT id as entity_id, "announcement" as entity_type, fellowship, created_ts FROM announcements WHERE fellowship = 'angel' OR fellowship = 'all'
      UNION ALL
      SELECT id as entity_id, "user" as entity_type, fellowship, created_ts FROM users WHERE fellowship = 'angel' or fellowship = 'founders'
      UNION ALL
      SELECT id as entity_id, "project" as entity_type, "angels-founders" as fellowship, created_ts FROM projects
      ) WHERE created_ts <= DATE(?) ORDER BY created_ts DESC LIMIT ? OFFSET ?
      `, [before, limit, offset]
    )
  }

  if (!feed) {
    throw new Error(`feed at offset ${offset} - limit: ${limit} not found!`)
  }

  return feed_items;
}
