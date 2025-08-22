import { Navigate } from '@/router';
import type { FC } from 'react';



const Home: FC = () => {
  return (
    <Navigate to="/setting/banner" replace />
  )
}

export default Home;