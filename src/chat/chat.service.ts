import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatService {

    async getMessage(id: string) {
        const messages = [
            {
                id: '1',
                content: 'Hello, how are you?',
                sender: { id: '1', username: 'Abhijeet' },
                receiver: { id: '2', username: 'Rahul' },
                timestamp: new Date().toISOString(),
            },
            {
                id: '2',
                content: 'Hi Abhijeet, I am good. How about you?',
                sender: { id: '2', username: 'Rahul' },
                receiver: { id: '1', username: 'Abhijeet' },
                timestamp: new Date().toISOString(),
            },
            {
                id: '3',
                content: 'I am doing well, thank you!',
                sender: { id: '1', username: 'Abhijeet' },
                receiver: { id: '2', username: 'Rahul' },
                timestamp: new Date().toISOString(),
            },
        ];
        const msg = messages.find(msg => msg.id === id);

        if (msg) {
            return msg;
        } else {
            throw new Error('No data available');
        }
    }
}
