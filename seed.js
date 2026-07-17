import dotenv from 'dotenv';
dotenv.config();

import { client } from './db/connector.js';

async function runSeed() {
  try {
    console.log('Connecting to MongoDB for seeding...');
    await client.connect();
    const db = client.db();

    console.log('Clearing existing collections...');
    await db.collection('courts').deleteMany({});
    await db.collection('checklists').deleteMany({});
    await db.collection('games').deleteMany({});
    await db.collection('match_results').deleteMany({});

    console.log('Inserting mock courts (Partner B — Wu Hung Hsiao)...');
    const baseCourts = [
      {
        name: 'Boston Common Basketball Court',
        address: 'Charles St, Boston, MA 02116',
        review: 'Excellent outdoor courts with double rims. Lights stay on until 10 PM. Always active with good games.',
        rating: 4.5,
        sport: 'Basketball',
        createdAt: new Date()
      },
      {
        name: 'Carter Playground Courts',
        address: 'Columbus Ave, Boston, MA 02118',
        review: 'Newly renovated courts. Clean nets and great surface grip for pickleball and tennis. Easy parking nearby.',
        rating: 5,
        sport: 'Basketball',
        createdAt: new Date()
      },
      {
        name: 'Northeastern Recreation Center',
        address: '360 Huntington Ave, Boston, MA 02115',
        review: 'Indoor sports hall with excellent lighting and clean facilities. Hard to reserve peak hours but top quality.',
        rating: 4.8,
        sport: 'Tennis',
        createdAt: new Date()
      },
      {
        name: 'Ramsey Park Basketball Court',
        address: '1917 Washington St, Roxbury, MA 02118',
        review: 'Solid neighborhood court. Rim is slightly low on the south court but clean play area.',
        rating: 3.8,
        sport: 'Basketball',
        createdAt: new Date()
      }
    ];

    const courts = [...baseCourts];
    const sportsList = ['Basketball', 'Pickleball', 'Tennis'];
    const neighborhoods = ['Back Bay', 'Fenway', 'South End', 'Beacon Hill', 'North End', 'Dorchester', 'Roxbury', 'Allston', 'Brighton'];
    
    // Generate 1005 synthetic records to satisfy the >1k requirement
    for (let i = 1; i <= 1005; i++) {
      const sport = sportsList[i % 3];
      const neighborhood = neighborhoods[i % neighborhoods.length];
      courts.push({
        name: `${neighborhood} ${sport} Court #${i}`,
        address: `${100 + i} Commonwealth Ave, Boston, MA 02215`,
        review: `A local favorite for ${sport.toLowerCase()} players. Well maintained with great lighting.`,
        rating: parseFloat((3.5 + (i % 16) * 0.1).toFixed(1)),
        sport: sport,
        createdAt: new Date()
      });
    }

    await db.collection('courts').insertMany(courts);
    console.log(`Seeded ${courts.length} court locations (including >1k synthetic records).`);

    console.log('Inserting mock gear checklists (Partner B — Wu Hung Hsiao)...');
    const checklists = [
      {
        userId: 'Morgan',
        title: 'Morning Pickleball Packing',
        items: [
          { name: 'Pickleball Paddle', checked: true },
          { name: 'Pickleballs (Indoor/Outdoor)', checked: false },
          { name: 'Athletic Shoes', checked: true },
          { name: 'Water Bottle', checked: true },
          { name: 'Extra Towel', checked: false }
        ],
        createdAt: new Date()
      },
      {
        userId: 'Alex',
        title: 'Basketball Practice Gear',
        items: [
          { name: 'High-top Shoes', checked: true },
          { name: 'Size 7 Basketball', checked: true },
          { name: 'Sports Drink', checked: false },
          { name: 'Knee Sleeve', checked: true }
        ],
        createdAt: new Date()
      }
    ];
    await db.collection('checklists').insertMany(checklists);
    console.log(`Seeded ${checklists.length} gear checklists.`);

    console.log('Inserting synthetic pickup games (Partner A — Harini Thirunavukkarasan)...');
    const games = [];
    const gameSports = ['Basketball', 'Pickleball', 'Tennis'];
    const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];
    const hosts = ['Alex', 'Taylor', 'Jordan', 'Morgan', 'Sam', 'Riley', 'Casey', 'Jamie'];
    const gameLocations = [
      'Boston Common Basketball Court',
      'Carter Playground Courts',
      'Northeastern Recreation Center',
      'Ramsey Park Court',
      'Charlesbank Courts',
      'Malcolm X Park',
    ];

    // Generate 1005 synthetic games to satisfy the >1k requirement
    for (let i = 1; i <= 1005; i++) {
      const sport = gameSports[i % gameSports.length];
      const skillLevel = skillLevels[i % skillLevels.length];
      const host = hosts[i % hosts.length];
      const location = gameLocations[i % gameLocations.length];
      const maxPlayers = sport === 'Tennis' ? 2 : sport === 'Pickleball' ? 4 : 6;
      const day = 10 + (i % 18); // days 10-27
      const hour = 8 + (i % 12); // hours 8-19

      games.push({
        sport,
        time: `2026-08-${String(day).padStart(2, '0')}T${String(hour).padStart(2, '0')}:00`,
        skillLevel,
        host,
        location,
        maxPlayers,
        participants: [host],
        description: `Friendly ${sport.toLowerCase()} pickup game. All ${skillLevel.toLowerCase()} players welcome!`,
        createdAt: new Date(),
      });
    }

    await db.collection('games').insertMany(games);
    console.log(`Seeded ${games.length} pickup games (including >1k synthetic records).`);

    console.log('Inserting synthetic match results (Partner A — Harini Thirunavukkarasan)...');
    const matches = [];
    const matchUsers = ['Taylor', 'Alex', 'Jordan', 'Morgan'];
    const outcomes = ['WIN', 'LOSS'];

    // Generate 200 synthetic match results spread across the demo users
    for (let i = 1; i <= 200; i++) {
      const sport = gameSports[i % gameSports.length];
      const userId = matchUsers[i % matchUsers.length];
      const outcome = outcomes[i % outcomes.length];
      const day = 1 + (i % 28);
      const scoreA = 11 + (i % 11);
      const scoreB = 5 + (i % 8);

      matches.push({
        sport,
        userId,
        score: outcome === 'WIN' ? `${scoreA} - ${scoreB}` : `${scoreB} - ${scoreA}`,
        outcome,
        date: `2026-07-${String(day).padStart(2, '0')}`,
        createdAt: new Date(),
      });
    }

    await db.collection('match_results').insertMany(matches);
    console.log(`Seeded ${matches.length} match results.`);

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    console.log('Closing database connection...');
    await client.close();
    process.exit(0);
  }
}

runSeed();
