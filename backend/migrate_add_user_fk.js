import dotenv from 'dotenv';
dotenv.config();
import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

async function migrate() {
    try {
        console.log('Starting migration...');

        // Step 1: Ensure user_id column exists
        console.log('Step 1: Ensuring user_id column exists...');
        await pool.query(`
            DO $
            BEGIN
                IF NOT EXISTS (
                    SELECT 1 FROM information_schema.columns 
                    WHERE table_name='complaints' AND column_name='user_id'
                ) THEN
                    ALTER TABLE complaints ADD COLUMN user_id INTEGER;
                END IF;
            END$;
        `);
        console.log('✓ user_id column ready');

        // Step 2: Update existing complaints to be owned by user 1
        console.log('Step 2: Updating existing complaints to user_id = 1...');
        const updateResult = await pool.query(`
            UPDATE complaints 
            SET user_id = 1 
            WHERE user_id IS NULL;
        `);
        console.log(`✓ Updated ${updateResult.rowCount} complaints to user_id = 1`);

        // Step 3: Add foreign key constraint
        console.log('Step 3: Adding foreign key constraint...');
        
        // First check if constraint already exists
        const constraintCheck = await pool.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'complaints' 
            AND constraint_type = 'FOREIGN KEY'
            AND constraint_name = 'fk_complaints_user';
        `);

        if (constraintCheck.rows.length === 0) {
            await pool.query(`
                ALTER TABLE complaints
                ADD CONSTRAINT fk_complaints_user
                FOREIGN KEY (user_id) 
                REFERENCES users(id)
                ON DELETE SET NULL;
            `);
            console.log('✓ Foreign key constraint added');
        } else {
            console.log('✓ Foreign key constraint already exists');
        }

        // Step 4: Verify the changes
        console.log('\nStep 4: Verifying changes...');
        const verifyResult = await pool.query(`
            SELECT 
                c.id,
                c.notes,
                c.user_id,
                u.username,
                u.email
            FROM complaints c
            LEFT JOIN users u ON c.user_id = u.id
            ORDER BY c.id
            LIMIT 5;
        `);

        console.log('\nFirst 5 complaints:');
        console.table(verifyResult.rows);

        console.log('\n✅ Migration completed successfully!');
        
    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
