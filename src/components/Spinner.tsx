import { LoaderCircle } from 'lucide-react'

export interface SpinnerProps {
  rootClasses?: Array<string>
}

const Spinner: React.FC<SpinnerProps> = ({ rootClasses }) => {
  let classes = ['animate-spin', 'text-red-500']
  if (rootClasses) {
    classes = rootClasses.concat(classes)
  }
  return <LoaderCircle className={classes.join(' ')} />
}

export default Spinner
