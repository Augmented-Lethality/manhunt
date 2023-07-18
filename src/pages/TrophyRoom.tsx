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
      <Main style={{ height: '100vh'}}>
        <div className='content__body' style={{ display: 'flex', justifyContent: 'center', height: '100%'}}>
          <div style={{ width: '20em', height: '20em'}}>
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
