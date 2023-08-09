import { HubConnectionBuilder } from "@microsoft/signalr";

const signalRService = {
    signalConnection: null,

    startConnection: () => {
        const connection = new HubConnectionBuilder()
        .withUrl('https://localhost:7015/webRTC', {withCredentials: true})
        .build();

        signalRService.signalConnection = connection;
        return connection.start();
    },
}

export default signalRService;