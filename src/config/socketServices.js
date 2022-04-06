import io from "socket.io-client";
// const SOCKET_URL = "http://server3.rvtechnologies.in:3005";
const SOCKET_URL = "http://chat.myboatonline.com:3008";

class WSService {
  initializeSocket = (user_id) => {
    try {
      console.log("initializing socket", user_id);

      if (!user_id) {
        console.log("Skipping socket initialization.", "userToken not found");
        return;
      }

      this.socket = io(`${SOCKET_URL}?user_id=${user_id}`, {
        transports: ["websocket"],
        query: {
            user_id: user_id,
        }
      });

      this.socket.on("connect", () => {
        console.log("===== socket connected =====");
      });

      this.socket.on("disconnect", () => {
        console.log("socket disconnected");
      });

      this.socket.on("connect_error", (err) => {
        // console.log('socket connection error: ', err);
        // console.data('socket connection error: ', err);
      });

      this.socket.on("error", (err) => {
        // console.log('socket error: ', err);
        console.log("socket error: ", err);
      });

      // this.socket.on('reconnect_attempt', () => {
      //     console.log('reconnecting');
      //     socket.io.opts.transports = ['polling', 'websocket'];
      // });

      // this.socket.on('connection-Response', (data) => {
      //     console.log('data received from server is: ', data);
      // });
    } catch (error) {
      console.log("initialize token error: ", error);
    }
  };

  emit(event, data = {}) {
    console.log("event to be emitted is>>>: ", event, data);
    this.socket.emit(event, data);
  }

  on(event, cb) {
    console.log("listen event: ", event, cb);

    this.socket.on(event, cb);
  }

  sendMessage(event, data = {}, acknowldge) {
    this.socket.emit(event, data, acknowldge);
  }

  sendChatMessage(
    event,
    chatId,
    text,
    userId,
    receiverId,
    type,
    mediaName,
    tempId
  ) {
    console.log(
      "emitting message: ",
      event,
      chatId,
      text,
      userId,
      receiverId,
      type,
      mediaName,
      tempId
    );
    this.socket.emit(
      event,
      chatId,
      text,
      userId,
      receiverId,
      type,
      mediaName,
      tempId
    );
  }

  isUserTyping(event, userID, chatID) {
    this.socket.emit(event, userID, chatID);
  }

  viewChat(event, userID, chatID) {
    console.log("view chat data is: ", event, userID, chatID);
    this.socket.emit(event, userID, chatID);
  }

  removeListener(listenerName) {
    this.socket.removeListener(listenerName);
  }
}

const socketServices = new WSService();

export default socketServices;
