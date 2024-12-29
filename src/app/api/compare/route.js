import { NextResponse } from 'next/server';
import fs from 'fs/promises';

export const config = {
    api: {
        bodyParser: false, // Disable Next.js's built-in body parsing
    },
};

export async function POST(req) {
    try {
        // Parse form data
        const formData = await req.formData();
        const followersFile = formData.get('followers');
        const followingFile = formData.get('following');

        if (!followersFile || !followingFile) {
            return NextResponse.json(
                { error: 'Please upload both files.' },
                { status: 400 }
            );
        }

        // Read file content
        const followersData = await followersFile.text();
        const followingData = await followingFile.text();

        // Convert data into arrays
        const followers = followersData.split('\n').map((line) => line.trim());
        const following = followingData.split('\n').map((line) => line.trim());

        // Find users not following back
        const notFollowingBack = following.filter((user) => !followers.includes(user));

        return NextResponse.json({ notFollowingBack });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
