import React, { useContext, useEffect, useState } from 'react';

export interface IWhosHuntingProps {
  users: string[];
}

const WhosHunting: React.FunctionComponent<IWhosHuntingProps> = (props) => {

  const { users } = props;

  const [hunted, setHunted] = useState('');

  // randomly pick a user
  useEffect(() => {

    const victim = users[Math.floor(Math.random() * users.length)];
    setHunted(victim);

  }, [])

  return (
    <div>
      <p>{ hunted }, you're being hunted.</p>
    </div>
  );

};

export default WhosHunting;
