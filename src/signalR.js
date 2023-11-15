import { HubConnectionBuilder } from "@microsoft/signalr";

const signalRService = {
  signalConnection: null,

  startConnection: () => {
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:5169/webRTC", { withCredentials: false })
      .build();

    signalRService.signalConnection = connection;
    return connection.start();
  },
};

export default signalRService;
