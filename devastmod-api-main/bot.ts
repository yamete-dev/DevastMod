import Websocket from "ws";
import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";
var url = require("url");

export class Bot {
  y: number;
  x: number;
  nick: string;
  tokenId: string | null;
  token: string;
  ws: null | Websocket;
  targetLocation: { x: number; y: number };
  goingToTarget: boolean;
  currentMovingTo: number;
  proxyUrl: string | undefined;
  serverId: string;
  constructor(
    nick: string,
    serverId: string,
    token: string | null,
    tokenId: string | null,
    proxyUrl: string | undefined = undefined
  ) {
    this.nick = nick;
    this.tokenId = tokenId;
    if (token == null) this.token = generateRandomToken(20);
    else this.token = token;
    this.ws = null;
    this.x = 0;
    this.y = 0;
    this.targetLocation = { x: 0, y: 0 };
    this.goingToTarget = false;
    this.currentMovingTo = 0;
    this.proxyUrl = proxyUrl;
    this.serverId = serverId;
  }

  connectToWebsocket(
    hostname: string,
    rivetToken: string,
    proxyUrl: string | undefined
  ) {
    const address = `wss://${hostname}:443/?token=${rivetToken}`;
    const wsHeaders = {
      "Accept-Encoding": "gzip, deflate, br, zstd",
      "Accept-Language": "en-US,en;q=0.9,af;q=0.8",
      "Cache-Control": "no-cache",
      Connection: "Upgrade",
      Origin: "https://devast.io",
      Pragma: "no-cache",
      Upgrade: "websocket",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
    };
    if (proxyUrl) {
      var options = url.parse(proxyUrl);

      var agent = new HttpsProxyAgent(options);

      this.ws = new Websocket(address, {
        headers: wsHeaders,
        agent: agent,
      });
    } else {
      this.ws = new Websocket(address, {
        headers: wsHeaders,
      });
    }

    this.ws.binaryType = "arraybuffer";
    this.ws.onerror = this.onerror.bind(this);
    this.ws.onclose = this.onclose.bind(this);
    this.ws.onmessage = this.onmessage.bind(this);
    this.ws.onopen = this.onopen.bind(this);
  }
  onerror(event: Websocket.ErrorEvent) {
    // console.log("ERRORED: ", event);
    this.joinGame();
  }
  onclose(event: Websocket.CloseEvent) {
    // console.log("CLOSED: ", event);
    this.joinGame();
  }
  onmessage(event: Websocket.MessageEvent) {
    if (typeof event.data === "string")
      this.processString(JSON.parse(event.data));
    else this.processBinary(event.data);
  }
  onopen(event: Websocket.Event) {
    console.log("OPENED: ", event);

    this.send([30, this.token, this.tokenId, -1, 0, this.nick, 0, null, 0]);
  }
  send(data: any[]) {
    if (this.ws && this.ws.readyState === Websocket.OPEN) {
      // console.log("Sending: ", data);
      this.ws.send(JSON.stringify(data));
    } else {
      // console.warn("WebSocket not connected or ready");
    }
  }

  processString(data: any) {
    // console.log(data);
  }

  processBinary(data: any) {
    const Uint8Data = new Uint8Array(data);
    // console.log(Uint8Data);
    switch (Uint8Data[0]) {
      case 42:
        this.processEntity(data, Uint8Data);
        break;
      case 33:
        this.processVitals(Uint8Data);
        break;
    }
  }
  processVitals(data: Uint8Array<any>) {
    for (var i = 1; i < data.length; i += 4) {
      const amount = data[i];
      const speedModifier = data[i + 1];
      const type = data[i + 2];
      const max = data[i + 3];
    }
  }
  processEntity(data: any, Uint8Data: Uint8Array<any>) {
    const Uint16Data = new Uint16Array(data);
    const count = (Uint8Data.length - 2) / 20;
    for (var i = 0, i1 = 2, i2 = 1; i < count; i++, i1 += 20, i2 += 10) {
      var WV = null;
      var Wnv = Uint8Data[i1];
      var vWm = Uint8Data[i1 + 1];
      var MN = Uint8Data[i1 + 3];
      var state = Uint16Data[i2 + 2];
      var id = Uint16Data[i2 + 3];
      var WMv = Uint16Data[i2 + 8];
      var nnv = Uint16Data[i2 + 9];
      if (state === 0) {
        //   wNv.remove(Wnv, mV, vWm, MN, WMv);
        continue;
      }
      // console.log(Wnv, id, vWm, MN);
      //   WV = wNv.get(Wnv, mV, vWm, MN);
      this.entity(
        WV,
        Wnv,
        vWm,
        id,
        MN,
        Uint16Data[i2 + 4],
        Uint16Data[i2 + 5],
        Uint16Data[i2 + 6],
        Uint16Data[i2 + 7],
        WMv,
        Uint8Data[i1 + 2],
        state,
        nnv
      );
    }
  }
  entity(
    WV: null,
    Wnv: any,
    vWm: any,
    id: number,
    MN: any,
    x: number,
    y: number,
    wwm: number,
    vWw: number,
    WMv: number,
    WM: any,
    state: number,
    nnv: number
  ) {
    // console.log("entity: ", id, x, y);
    if (id == 0) {
      this.x = x;
      this.y = y;
      if (this.goingToTarget) {
        const movingTo = calculateDirection(
          this.x,
          this.y,
          this.targetLocation.x,
          this.targetLocation.y
        );
        // if (movingTo == 0) this.goingToTarget = false;
        if (this.currentMovingTo != movingTo) {
          this.send([2, movingTo]);
          this.currentMovingTo = movingTo;
        }
      }
    }
  }
  async start(
    hostname: string,
    rivetToken: string,
    proxyUrl: string | undefined = undefined
  ) {
    this.connectToWebsocket(hostname, rivetToken, proxyUrl);

    // setInterval(() => {
    //   // console.log(this.x, this.y);
    // }, 1000);
  }
  goToLocation(x: number, y: number) {
    this.targetLocation = { x, y };
    this.goingToTarget = true;
  }
  joinGame() {
    joinServer(this.serverId, this.proxyUrl).then(async (data: any) => {
      // console.log(data);
      this.start(data.ports.default.hostname, data.player.token, this.proxyUrl);
    });
  }
}
function calculateDirection(
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number
) {
  const diffX = targetX - currentX;
  const diffY = targetY - currentY;

  let movingTo = 0;

  if (diffX > 50) {
    // Moving right
    movingTo += 2;
  } else if (diffX < -50) {
    // Moving left
    movingTo += 1;
  }

  if (diffY > 50) {
    // Moving down
    movingTo += 4;
  } else if (diffY < -50) {
    // Moving up
    movingTo += 8;
  }

  return movingTo;
}

export function generateRandomToken(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?-_@$%^&*()_=+{}[]|;:,.<>/?~`";
  let token = "";
  for (let i = 0; i < length; i++) {
    token += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return token;
}
const fetchHeaders = {
  "Accept-Encoding": "gzip, deflate, br, zstd",
  "Accept-Language": "en-US,en;q=0.9,af;q=0.8",
  "Cache-Control": "no-cache",
  Origin: "https://devast.io",
  Pragma: "no-cache",
  "Sec-CH-UA":
    '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  "Sec-CH-Ua-Mobile": "?0",
  "Sec-CH-Ua-Platform": '"Windows"',
  Referer: "https://devast.io/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
  Accept: "application/json",
};
export async function joinServer(
  lobbyId: string,
  proxyUrl: string | undefined = undefined
) {
  if (proxyUrl) {
    const response = await axios.post(
      "https://api.rivet.gg/matchmaker/lobbies/join",
      { lobby_id: lobbyId },
      { headers: fetchHeaders, httpsAgent: new HttpsProxyAgent(proxyUrl) }
    );
    const data = await response.data;
    return data;
  } else {
    const response = await axios.post(
      "https://api.rivet.gg/matchmaker/lobbies/join",
      { lobby_id: lobbyId },
      { headers: fetchHeaders }
    );
    const data = await response.data;
    return data;
  }
}
export async function getServers() {
  const response = await global.fetch(
    "https://api.rivet.gg/matchmaker/lobbies/list",
    {
      method: "GET",
      headers: fetchHeaders,
    }
  );
  if (!response.ok) throw console.error(response.statusText);
  const data = await response.json();
  return data;
}
