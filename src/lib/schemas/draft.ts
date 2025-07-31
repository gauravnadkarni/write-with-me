import * as yup from 'yup'

export const draftSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  content: yup.string().required('Content is required'),
  id: yup.string().nullable().notRequired(),
  folderId: yup.string().nullable().notRequired(),
})

export type FormData = yup.InferType<typeof draftSchema>
