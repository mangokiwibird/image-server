import express from "express"
import { createNode } from "./network/ipfs"
import { CID } from "multiformats"
import cors from "cors"
import 'dotenv/config'
import { multiaddr } from "@multiformats/multiaddr"

const app = express()
app.use(cors())


app.get("/get_image", async (req, res) => {
    const hash = req.query.hash
    console.log("0")

    const { unixfs } = await import("@helia/unixfs")
    console.log("1")
    const helia = await createNode()
    console.log("2")

    try {
        console.log("attempting dial")
        const addr = multiaddr(process.env.MULTIADDR_HASHMANAGER)
    // await helia.libp2p.dial(peerIdFromString(process.env.NODEID_HASHMANAGER!!))
        await helia.libp2p.dial(addr)
        console.log("finished dial")
    } catch(e) {
        console.log(e)
    }

    const helia_fs = unixfs(helia)

    const cid = CID.parse(hash?.toString()!!)

    const buffer = Buffer.alloc(1024 * 512)

    let idx = 0

    for await (const buf of helia_fs.cat(cid)) {
        for (const i of buf) {
            buffer.writeUint8(i, idx++)
        }
    }

    helia.stop()

    res.send(buffer.toString("base64"))
})

app.listen(9090, () => {
    console.log("image server up and running")
})