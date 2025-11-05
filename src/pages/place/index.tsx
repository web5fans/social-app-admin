import { Navigate } from '@/router';
import type { FC } from 'react';



const Home: FC = () => {
  return (
    <Navigate to="/place/badge" replace />
  )
}

export default Home;