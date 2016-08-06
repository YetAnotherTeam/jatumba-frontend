export class Message {
    public id: number;
    public datetime: string;
    public text: string;
    public author: any;

    constructor(messageData: any) {
        this.id = messageData.id;
        this.datetime = this.formatDate(messageData.datetime);
        this.text = messageData.text;
        this.author = messageData.author;
    }

    formatDate(strDatetime) {
        const date = new Date(strDatetime);
        return date.toLocaleString('ru', {
            day: 'numeric',
            month: 'long',
            hour: 'numeric',
            minute: 'numeric',
        });
    }

}