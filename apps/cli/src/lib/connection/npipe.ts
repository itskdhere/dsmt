import net from "net";
import http from "http";

function createNamedPipeAgent(pipePath: string): http.Agent {
  const agent = new http.Agent();

  (agent as any).createConnection = function (options: any, callback: any) {
    const socket = net.createConnection(pipePath);

    socket.on("connect", () => {
      if (callback) callback(null, socket);
    });

    socket.on("error", (err: any) => {
      if (callback) callback(err);
    });

    return socket;
  };

  return agent;
}

export { createNamedPipeAgent };
