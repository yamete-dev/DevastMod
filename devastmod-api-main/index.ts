// import game from "./engine";
import { Bot, generateRandomToken, getServers } from "./bot";

const proxyUrl = "http://p.webshare.io:9999";
//"http://spukzyvv-AT-BE-CZ-DE-DK-ES-FR-GB-GR-HU-IT-MT-NL-PL-SE-UA-rotate:kw1i6hw739bv@p.webshare.io:80";

async function main() {
  try {
    // getServers().then((servers: any) => {
    //   console.log(servers);
    // });

    // const bot = new Bot("kamor", "9?Ply@>X3dSE8ky?_N3n", null);
    // let bots: Bot[] = [];
    // for (let i = 0; i < 2; i++) {
    //   const bot = new Bot(`SSSS ${i}`, null, null);
    //   bots.push(bot);
    // }
    // getServers().then((servers: any) => {
    //   console.log(servers.lobbies[6]);
    //   bots.forEach((bot) => {
    //     bot.start(servers.lobbies[6].lobby_id);
    //   });
    // });joinServer(servers.lobbies[6].lobby_id).then((data: any) => {
    //   console.log(data);
    // });

    // bot.start(
    //   "91c2b9e3-b0e3-4b8d-b85e-aff4243ed6a9-default.lobby.5767a802-5c7c-4563-a266-33c014f7e244.rivet.run",
    //   "player.eyJ0eXAiOiJKV1QiLCJhbGciOiJFZERTQSJ9.CI3l2ML5MhCNtefG3DIaEgoQSeNNT9fbQG6nNDREn-6yVCIWKhQKEgoQc5wZKfM9RhKDciUvqR8jtw.d5VPSQZxroKknu_CKXY_MeLLZn2jEpbOhepePtmyprdN7yR-GSjfKIpIg4TuxSDAUru1wsG_Yqx_tHE-pbXKCg"
    // );

    const serverId = "b4049aa2-be89-46cb-8b90-4c58509f3f93";
    let bots: Bot[] = [];
    for (let i = 0; i < 50; i++) {
      const bot = new Bot(
        generateRandomToken(8),
        serverId,
        null,
        null,
        proxyUrl
      );
      bots.push(bot);
      bot.joinGame();
      bot.goToLocation(100, 100);
    }

    setInterval(() => {
      bots.forEach((bot) => {
        console.log(bot.x, bot.y);
      });
    }, 1000);
  } catch {}
  // game.engine();
  // global.fetch("https://api.rivet.gg/matchmaker/lobbies/join", {
  //   method: "POST",
  //   headers: headers,
  //   body: JSON.stringify({ lobby_id: nnvVM }),
  // });

  // Start the bot.
  // bot.start();

  // joinServer(servers.lobbies[0].lobby_id).then((data) => {
  //   console.log(data);
  //   game.engine();
  //   game.loadPlayer("test", data);
  //   console.log(game.SERVG);
  //   setInterval(() => {
  //     // console.log(game.x, game.y);
  //   }, 1000); // Keep the process running
  // });
  setInterval(() => {}, 1000); // Keep the process running

  // make 20 bots

  // then have them all join one serv
}
main();
