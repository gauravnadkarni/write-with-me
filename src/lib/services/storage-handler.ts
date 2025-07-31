import { AppError } from '../errors/app-error'
import { createClient } from '../supabaseServer'

const SUPABASE_BUCKET_NEW_USER = process.env.SUPABASE_BUCKET_NEW_USER!
const SUPABASE_BUCKET_PATH_NEW_USER = process.env.SUPABASE_BUCKET_PATH_NEW_USER!

export const storeDataInStorage = async (
  payload: Record<string, unknown>,
  bucketName: string,
  path: string,
  fileName: string
) => {
  const supabase = await createClient(process.env.SUPABASE_ANON_KEY!)
  const jsonData = JSON.stringify(payload)
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(
      `${path}/${fileName}`,
      new Blob([jsonData], { type: 'application/json' }),
      {
        contentType: 'application/json',
        upsert: true, // Overwrite if file exists
      }
    )

  if (error) {
    throw new AppError('Error uploading JSON:', 500, error)
  }

  return data
}

export const storeDataInProcessBucket = async (
  payload: Record<string, unknown>,
  fileName: string
) =>
  storeDataInStorage(
    payload,
    SUPABASE_BUCKET_NEW_USER,
    SUPABASE_BUCKET_PATH_NEW_USER,
    fileName
  )
