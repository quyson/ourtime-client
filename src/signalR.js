import { HubConnectionBuilder } from "@microsoft/signalr";

const signalRService = {
    signalConnection: null,

    startConnection: () => {
        const connection = new HubConnectionBuilder()
        .withUrl('http://localhost:3000/webRTC', {withCredentials: true})
        .build();

        signalRService.signalConnection = connection;
        return connection.start();
    },
}

export default signalRService;