// pages/api/send-notification.js
import { NextRequest, NextResponse } from 'next/server';
import admin from '../firebase-admin';
import qs from 'qs';

export async function sendAlert(userId: string, deviceToken: string, message: string, colorCode: string) {
    // if (req.method === 'POST') {
    // const { token, message } = req.body;

    try {
        const response = await admin.messaging().send({
            token: deviceToken,
            notification: {
                title: 'Excess Usage Alert',
                body: message,
            },
            android: {
                notification: {
                    color: colorCode//"#FF0000" // Example color: Red
                }
            }
        });

        console.log('Successfully sent message:', response.toString());
        return { message: 'Notification sent successfully' };
    } catch (error) {
        console.error('Error sending message:', error);
        return { error: 'Failed to send notification' };
    }
    // } else {
    //     NextResponse.json({ error: 'Failed to send notification' });
    // }
}
