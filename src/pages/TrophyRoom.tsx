import React, { lazy, Suspense } from 'react';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
import PageLoader from '../components/Loading';

const SavedTrophies = lazy(() => import('../components/SavedTrophies'));

const TrophyRoom: React.FC = () => {

  return (
    <Container>
      <Header page='Trophy Room' />
      <Main style={{}}>
        <div className='content__body'>
          <div style={{ width: '300px', height: '300px' }}>
            <Suspense fallback={<PageLoader />}>
              <SavedTrophies
                id={0}
                name={''}
                description={''}
                createdAt={''}
                dimension={0}
                color={''}
                shape={''}
                tubularSegments={0}
                tubeWidth={0}
              />
            </Suspense>
          </div>
        </div>
      </Main>
    </Container>
  );
};

export default TrophyRoom;
