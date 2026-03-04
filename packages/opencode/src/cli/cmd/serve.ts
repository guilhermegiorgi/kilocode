import { Server } from "../../server/server"
import { cmd } from "./cmd"
import { withNetworkOptions, resolveNetworkOptions } from "../network"
import { Flag } from "../../flag/flag"
import { Instance } from "../../project/instance" // ggai_change

export const ServeCommand = cmd({
  command: "serve",
  builder: (yargs) => withNetworkOptions(yargs),
  describe: "starts a headless kilo server", // ggai_change
  handler: async (args) => {
    if (!Flag.GGAI_SERVER_PASSWORD) {
      console.log("Warning: GGAI_SERVER_PASSWORD is not set; server is unsecured.")
    }
    const opts = await resolveNetworkOptions(args)
    const server = Server.listen(opts)
    console.log(`kilo server listening on http://${server.hostname}:${server.port}`) // ggai_change
    // ggai_change start - graceful signal shutdown
    const abort = new AbortController()
    const shutdown = async () => {
      try {
        await Instance.disposeAll()
        await server.stop(true)
      } finally {
        abort.abort()
      }
    }
    process.on("SIGTERM", shutdown)
    process.on("SIGINT", shutdown)
    process.on("SIGHUP", shutdown)
    await new Promise((resolve) => abort.signal.addEventListener("abort", resolve))
    // ggai_change end
  },
})
