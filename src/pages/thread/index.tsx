import { Navigate } from '@/router';
import type { FC } from 'react';



const Home: FC = () => {
  return (
    <Navigate to="/post/proposal" replace />
  )
}

export default Home;