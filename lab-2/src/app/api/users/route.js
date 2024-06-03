const { db } = require('@vercel/postgres');
const bcrypt = require('bcrypt');

async function hashPassword(password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.error('Error hashing password:', error);
        throw error;
    }
}
export async function POST(request, context) {
    const { name, email, password } = await request.json();

    try {
        const client = await db.connect();
        const hashedPassword = await hashPassword(password);
        await client.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`, [name, email, hashedPassword]);

        await client.end();

        return NextResponse.json({ message: "User created successfully" }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json({ message: "Error creating user", error }, { status: 500 });
    }
}

export async function GET(request, context) {
    try {
        const client = await db.connect();
        const result = await client.query(`SELECT * FROM users`);
        await client.end();

        const users = result.rows;
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ message: "Error fetching users", error }, { status: 500 });
    }
}