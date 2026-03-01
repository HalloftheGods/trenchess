
import { LobbyClient } from 'boardgame.io/client';

const PORT = process.env.PORT || 3001;
const server = `http://localhost:${PORT}`;
const lobbyClient = new LobbyClient({ server });

async function testServer() {
  console.log(`Testing server at ${server}...`);
  try {
    // 1. List matches
    console.log('Listing matches...');
    const { matches } = await lobbyClient.listMatches('Trenchess');
    console.log(`Found ${matches.length} matches.`);

    // 2. Create a match
    console.log('Creating a new match...');
    const match = await lobbyClient.createMatch('Trenchess', {
      numPlayers: 2,
      setupData: { mode: '2p-ns' },
    });
    console.log(`Created match with ID: ${match.matchID}`);

    // 3. List matches again
    console.log('Listing matches again...');
    const { matches: updatedMatches } = await lobbyClient.listMatches('Trenchess');
    const found = updatedMatches.some(m => m.matchID === match.matchID);
    
    if (found) {
      console.log('SUCCESS: Server is working correctly!');
      process.exit(0);
    } else {
      console.error('FAILURE: Created match not found in list.');
      process.exit(1);
    }
  } catch (error) {
    console.error('FAILURE: Error connecting to server:', error);
    process.exit(1);
  }
}

testServer();
