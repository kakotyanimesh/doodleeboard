import WebSocket from "ws";

export interface User {
    ws : WebSocket,
    room : String[],
    userId : string
}