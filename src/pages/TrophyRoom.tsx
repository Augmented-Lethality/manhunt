import React, { lazy, Suspense } from 'react';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';

import PhoneLoader from '../components/Loaders/PhoneLoader';
import InfoPopup from '../components/Popups/InfoPopup';

const SavedTrophies = lazy(() => import('../components/Trophies/SavedTrophies'));

const TrophyRoom: React.FC = () => {

  const infoMessage = 'Oooh, shiny!\n\nEarn trophies when you win games.'

  return (
    <>
      <Header page='Trophies' />
      <Main style={{ height: '100vh' }}>
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
        <InfoPopup message={infoMessage} />

      </Main>
    </>
  );
};

export default TrophyRoom;
