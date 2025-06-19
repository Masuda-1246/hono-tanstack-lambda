import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { client } from '../integrations/hono/index'


export const Route = createFileRoute('/demo/tanstack-query')({
  component: TanStackQueryDemo,
})

function TanStackQueryDemo() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['people'],
    queryFn: () => client.api.users.$get().then((res) => res.json()),
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error</div>
  if (!data) return <div>No data</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">People list</h1>
      <ul>
        {data.map((person: { name: string }) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  )
}
