import * as yup from 'yup'

export const folderSchema = yup.object().shape({
  title: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  color: yup.string().required('Color is required'),
  id: yup.string().optional(),
})

export type FormData = yup.InferType<typeof folderSchema>
