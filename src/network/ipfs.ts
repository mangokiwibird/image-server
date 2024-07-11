import { FsBlockstore } from "blockstore-fs"
import { FsDatastore } from "datastore-fs"

export const createNode = async () => {
    const { createHelia } = await import("helia")

    const blockstore = new FsBlockstore("./ipfs-storage/")
    const datastore = new FsDatastore("./ipfs-datastore/")
    const helia = await createHelia({
        blockstore,
        datastore
    })
    
    return helia
}