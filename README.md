  > [Note]
  > **This repository is a work in progress and will be updated frequently with changes.**

<br>

# ManHunt

In the shadowy underbelly of a civilization lost to corruption, you are the last line against the encroaching darkness. Or, at least, you would be if all of these other bounty hunters would stop getting in the way. The task ahead of you is simple: track down the scum that law enforcement can't - or won't - touch. Your path will be fraught with the dim cascade of neon lights, the the hazey fog of moral ambiguity, and danger! Do you have what it takes to tread the line between right and wrong, and more importantly, can you find your mark before someone else gets them?

<br>

## An Augmented Reality Game of Tag
Man Hunt is a mobile facing web app where users can play games of AR Tag. Upon the start of a game, a single user is randomly selected to be the bounty. All other users become the bounty hunters, and must try to track down the bounty while racing against a clock. A hunter wins by using facial recognition technology on their phone's cameras to confirm that they have captured their mark. If the bounty's face is recognized, the hunter who captured the mark wins the game. If the bounty escapes capture and the timer runs out, the bounty wins the game. Phone will display hints about the other users's locations to aid players to victory.

To play Man Hunt, go to [production link here](productionlinkhere).

Man Hunt is built using Typescript, React, Express, and is hosted on AWS. For more information on our tech stack, see the Techstack section of this readme. 

<br>


## To see the development files:
* Make sure you have Node ^18.
* Download the directory.
* If you're using Mac or Linux, run this command:

    cp .env.example .env

* If you're using Windows, run this command:

    copy .env.example .env

* Go into the new .env file and replace all of the empty strings with the corresponding API Keys ([link one](link), [link two](link), [link three](link))
* Run the following commands in the root directory:

    npm install

    npm run dev

* Open a second terminal in the same directory and run:

    npm start


* Open [https://localhost:3666](https://localhost:3666)

* For production, run:
  npm run build
  npm start

<br>


## To run the database:
* Download Postgresql globally 
* Make sure the Postgresql service is started. 
* Start the Postgresql shell:

    psql -U postgres

* In a separate terminal:

    npm run seed

* In Psql shell, connect to database "manhunt":

    \c manhunt    
    
* To display tables:
    \dt 

## Additional notes

* Used to install styled components:
    npm i -D styled-components@5.3.10 @types/styled-components

## Designed by @Augmented-Lethality:
  *Logan Hochwald*
  @loganhochwald

  *Kalypso Homan* 
  @catcatmcgee

  *Alex Lambert*
  @xanderlambert


## Techstack
* Typescript 
* React 
* Express 
* Node 
* Socket.IO
* Axios
* Sequelize 
* Postgres 
* TensorFlow
* AR.js
* Three.js
* Auth0
* AWS
* SauceLabs
* Cypress
* Chai/Mocha
* Styled Components
* Trello
* Figma
* Nike


## License
This project is licensed under the VERYSECURE License - see the TOTALLYREALLICENSE.md file for details
