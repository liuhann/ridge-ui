import { Button } from '@nextui-org/button'
import { NextUIProvider } from '@nextui-org/react'

export default function App () {
  return (
    <NextUIProvider>
      <Button size='md' color='primary'>
        Medium
      </Button>
    </NextUIProvider>

  )
}
