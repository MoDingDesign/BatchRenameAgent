export interface RenameOperation {
    original: string
    new: string
    reason?: string
}

export interface RenamePlan {
    summary: string
    operations: RenameOperation[]
}
