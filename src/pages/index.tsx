import { Navigate } from '@/router';
import type { FC } from 'react';



const Home: FC = () => {
  return (
    <Navigate to="/thread/list" replace />
  )
}

export default Home;