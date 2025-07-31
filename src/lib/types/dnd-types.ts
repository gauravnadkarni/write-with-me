export const ItemTypes = {
  DRAFT: 'draft',
}

export interface DraftDragItem {
  type: string
  draftId: string
  folderId: string | null
}
