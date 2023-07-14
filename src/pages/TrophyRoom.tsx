import React, { lazy, Suspense } from 'react';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';

import PhoneLoader from '../components/Loaders/PhoneLoader';

const SavedTrophies = lazy(() => import('../components/SavedTrophies'));

const TrophyRoom: React.FC = () => {

  return (
    <>
      <Header page='Trophies' />
      <Main style={{height: '100vh'}}>
        <div className='content__body'>
          <div style={{ width: '300px', height: '300px' }}>
            <Suspense fallback={<PhoneLoader />}>
              <SavedTrophies
                id={0}
                name={''}
                description={''}
                createdAt={''}
                dimension={0}
                dimensionTwo={0}
                dimensionThree={0}
                color={''}
                shape={''}
                tubularSegments={0}
                tubeWidth={0}
              />
            </Suspense>
          </div>
        </div>
      </Main>
    </>
  );
};

export default TrophyRoom;
