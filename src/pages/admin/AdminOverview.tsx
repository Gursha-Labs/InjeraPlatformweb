import { SystemBalance } from '@/api/admin'
import { useQuery } from '@tanstack/react-query'
import React from 'react'

export default function AdminOverview() {

  const { data } = useQuery({
    queryKey: ["SystemBalance"],
    queryFn: SystemBalance,
  })
  return (
    <div>

    </div>
  )
}
