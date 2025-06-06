// Copyright © 2025 Elysia

import { Navigate } from 'react-router'
import { UrlTree } from '@/constants'

export function Dashboard() {
  return <Navigate to={UrlTree.songList} />
}
