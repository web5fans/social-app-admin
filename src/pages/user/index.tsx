import { Navigate } from '@/router';
import type { FC } from 'react';



const Home: FC = () => {
  return (
    <Navigate to="/user/normal" replace />
  )
}

export default Home;