import dotenv from 'dotenv';
dotenv.config();

import { client } from './db/connector.js';

async function runSeed() {
  try {
    console.log('Connecting to MongoDB for seeding (Partner B Only)...');
    await client.connect();
    const db = client.db();

    console.log('Clearing existing court and checklist collections...');
    await db.collection('courts').deleteMany({});
    await db.collection('checklists').deleteMany({});

    console.log('Inserting mock courts (Partner B — Wu Hung Hsiao)...');
    const courts = [
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
    await db.collection('courts').insertMany(courts);
    console.log(`Seeded ${courts.length} court locations.`);

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

    console.log('Database seeding completed successfully (Partner B only)!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    console.log('Closing database connection...');
    await client.close();
    process.exit(0);
  }
}

runSeed();
