import { ActiveGrid } from '../components/active-grid/active-grid'
import NoSSR from 'react-no-ssr'
import { useRouter } from 'next/router'

export default function GridContainer() {
  const router = useRouter()
  const {
    query: { base64MIDI }
  }: any = router
  return (
    <div>
      <NoSSR>
        <ActiveGrid base64MIDI={base64MIDI ? base64MIDI : undefined} />
      </NoSSR>
    </div>
  )
}
