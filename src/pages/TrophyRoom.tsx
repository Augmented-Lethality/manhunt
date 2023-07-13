import React, { lazy, Suspense } from 'react';
import { Container } from '../styles/Container';
import { Header } from '../styles/Header';
import { Main } from '../styles/Main';
// import PageLoader from '../components/Loading';
import PhoneLoader from '../components/Loaders/PhoneLoader';
import InfoPopup from '../components/Popups/InfoPopup';

const SavedTrophies = lazy(() => import('../components/SavedTrophies'));

const TrophyRoom: React.FC = () => {

  const infoMessage = 'Oooh, shiny!\n\nEarn trophies when you win games.'

  return (
    <Container>
      <Header page='Trophies' />
      <Main>
        <div className='content__body'>
          <div style={{ width: '300px', height: '300px' }}>
            <Suspense fallback={<PhoneLoader />}>
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
        <InfoPopup message={infoMessage} />

      </Main>
    </Container>
  );
};

export default TrophyRoom;
