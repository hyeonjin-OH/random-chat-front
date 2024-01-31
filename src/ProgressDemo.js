import * as React from "react"
 
import { Progress } from "~/components/ui/progress"
 
export function ProgressDemo() {
  const [progress, setProgress] = React.useState(15)
  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])
  return <Progress value={progress}/>
}