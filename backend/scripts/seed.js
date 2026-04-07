// backend/scripts/seed.js
import { queryAsync } from '../src/config/database.js';
import bcryptjs from 'bcryptjs';

// Sample foods for seeding
const sampleFoods = [
  { food_name: 'Chicken Breast', category: 'Protein', calories_per_100g: 165, protein_g: 31, carbs_g: 0, fat_g: 3.6 },
  { food_name: 'Beef (Lean)', category: 'Protein', calories_per_100g: 250, protein_g: 26, carbs_g: 0, fat_g: 15 },
  { food_name: 'Salmon', category: 'Protein', calories_per_100g: 208, protein_g: 25, carbs_g: 0, fat_g: 11 },
  { food_name: 'Egg', category: 'Protein', calories_per_100g: 155, protein_g: 13, carbs_g: 1.1, fat_g: 11 },
  { food_name: 'Whey Protein Powder', category: 'Protein', calories_per_100g: 417, protein_g: 80, carbs_g: 8, fat_g: 5 },
  
  { food_name: 'Brown Rice', category: 'Carbs', calories_per_100g: 111, protein_g: 2.6, carbs_g: 23, fat_g: 0.9 },
  { food_name: 'Sweet Potato', category: 'Carbs', calories_per_100g: 86, protein_g: 1.6, carbs_g: 20, fat_g: 0.1 },
  { food_name: 'Oatmeal', category: 'Carbs', calories_per_100g: 389, protein_g: 17, carbs_g: 66, fat_g: 7 },
  { food_name: 'Pasta (Whole Wheat)', category: 'Carbs', calories_per_100g: 124, protein_g: 4.4, carbs_g: 25, fat_g: 0.4 },
  { food_name: 'Banana', category: 'Carbs', calories_per_100g: 89, protein_g: 1.1, carbs_g: 23, fat_g: 0.3 },
  
  { food_name: 'Olive Oil', category: 'Fat', calories_per_100g: 884, protein_g: 0, carbs_g: 0, fat_g: 100 },
  { food_name: 'Almonds', category: 'Fat', calories_per_100g: 579, protein_g: 21, carbs_g: 22, fat_g: 50 },
  { food_name: 'Avocado', category: 'Fat', calories_per_100g: 160, protein_g: 2, carbs_g: 9, fat_g: 15 },
  
  { food_name: 'Broccoli', category: 'Vegetables', calories_per_100g: 34, protein_g: 2.8, carbs_g: 7, fat_g: 0.4 },
  { food_name: 'Spinach', category: 'Vegetables', calories_per_100g: 23, protein_g: 2.9, carbs_g: 3.6, fat_g: 0.4 },
  { food_name: 'Carrots', category: 'Vegetables', calories_per_100g: 41, protein_g: 0.9, carbs_g: 10, fat_g: 0.2 }
];

// Sample supplements
const sampleSupplements = [
  { supplement_name: 'Whey Protein', category: 'Protein', dosage: '25-30g', notes: 'Post-workout' },
  { supplement_name: 'Creatine Monohydrate', category: 'Performance', dosage: '5g daily', notes: 'Strength & muscle' },
  { supplement_name: 'BCAAs', category: 'Amino Acids', dosage: '5-10g', notes: 'Intra-workout' },
  { supplement_name: 'Beta-Alanine', category: 'Performance', dosage: '3-5g daily', notes: 'Endurance' },
  { supplement_name: 'Vitamin D3', category: 'Vitamins', dosage: '2000-4000 IU', notes: 'Daily' },
  { supplement_name: 'Omega-3 Fish Oil', category: 'Health', dosage: '2-3g EPA/DHA', notes: 'Joint health' },
  { supplement_name: 'ZMA', category: 'Minerals', dosage: '30mg zinc', notes: 'Before bed' },
  { supplement_name: 'Caffeine', category: 'Performance', dosage: '100-200mg', notes: 'Pre-workout' }
];

// Sample intensity techniques
const sampleTechniques = [
  { technique_name: 'Drop Sets', description: 'Reduce weight after reaching failure and continue' },
  { technique_name: 'Supersets', description: 'Perform two exercises back-to-back without rest' },
  { technique_name: 'Rest-Pause Sets', description: 'Reach failure, rest briefly, then continue' },
  { technique_name: 'Pyramid Sets', description: 'Increase weight and decrease reps progressively' },
  { technique_name: 'Giant Sets', description: 'Perform 3-4 exercises for same muscle back-to-back' },
  { technique_name: 'Negatives', description: 'Focus on slow eccentric (lowering) phase' },
  { technique_name: 'AMRAP', description: 'As Many Reps As Possible in set time' },
  { technique_name: 'Cluster Sets', description: 'Short rest intervals within set' }
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...\n');

    // Seed Foods
    console.log('📍 Seeding foods...');
    for (const food of sampleFoods) {
      await queryAsync(
        `INSERT INTO foods (food_name, category, calories_per_100g, protein_g, carbs_g, fat_g)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT DO NOTHING`,
        [food.food_name, food.category, food.calories_per_100g, food.protein_g, food.carbs_g, food.fat_g]
      );
    }
    console.log(`✅ Seeded ${sampleFoods.length} foods\n`);

    // Seed Supplements
    console.log('📍 Seeding supplements...');
    for (const supp of sampleSupplements) {
      await queryAsync(
        `INSERT INTO supplements (supplement_name, category, dosage, notes)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT DO NOTHING`,
        [supp.supplement_name, supp.category, supp.dosage, supp.notes]
      );
    }
    console.log(`✅ Seeded ${sampleSupplements.length} supplements\n`);

    // Seed Intensity Techniques
    console.log('📍 Seeding intensity techniques...');
    for (const tech of sampleTechniques) {
      await queryAsync(
        `INSERT INTO intensity_techniques (technique_name, description)
         VALUES ($1, $2)
         ON CONFLICT DO NOTHING`,
        [tech.technique_name, tech.description]
      );
    }
    console.log(`✅ Seeded ${sampleTechniques.length} techniques\n`);

    // Create test admin
    console.log('📍 Creating test admin...');
    const adminPassword = await bcryptjs.hash('admin123', 10);
    await queryAsync(
      `INSERT INTO users (email, password, first_name, last_name, role, is_active)
       VALUES ($1, $2, $3, $4, $5, true)
       ON CONFLICT (email) DO NOTHING`,
      ['admin@test.com', adminPassword, 'Test', 'Admin', 'admin']
    );
    console.log('✅ Created test admin (admin@test.com / admin123)\n');

    // Create test client
    console.log('📍 Creating test client...');
    const clientPassword = await bcryptjs.hash('client123', 10);
    await queryAsync(
      `INSERT INTO users (email, password, first_name, last_name, role, initial_weight_kg, is_active)
       VALUES ($1, $2, $3, $4, $5, 75, true)
       ON CONFLICT (email) DO NOTHING`,
      ['client@test.com', clientPassword, 'Test', 'Client', 'client']
    );
    console.log('✅ Created test client (client@test.com / client123)\n');

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📝 Test Accounts:');
    console.log('  Admin: admin@test.com / admin123');
    console.log('  Client: client@test.com / client123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
seedDatabase();

export { seedDatabase };
