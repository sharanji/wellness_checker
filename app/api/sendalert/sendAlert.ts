// pages/api/send-notification.js
import { NextRequest, NextResponse } from 'next/server';
import admin from '../firebase-admin';
import qs from 'qs';

export async function sendAlert(deviceToken: string, title: string, message: string, colorCode: string) {

    try {
        const response = await admin.messaging().send({
            token: deviceToken,
            notification: {
                title: title,
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
        console.error('Error sending message: ');
        return { error: 'Failed to send notification' };
    }

}
