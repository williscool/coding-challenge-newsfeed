import db, {UserRow, ProjectRow, AnnouncementRow} from '../../db'

type Item =  UserRow | ProjectRow | AnnouncementRow 

export function __resolveType(obj: Item, context: unknown, info: unknown): String | null {
    if(obj.entity_type === "announcement") return 'Announcement'
    if(obj.entity_type === "user") return 'User'
    if(obj.entity_type === "project") return 'Project'
    return null;
  }