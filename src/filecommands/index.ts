// We'd be fiddling with the filesystem extensively. So it's better to write down some helper functions which make
// creating folders, files, and writing content to that file easy.

import { cwd } from "process"
import { mkdirSync, write } from "fs"
import { writeFile } from "fs/promises"

//A good abstraction of our filesystem can be a map. The keys of the map are names of files and folders. If value for a key
//is an object then it's a folder name, if it's a string then it's a filename.

interface FileStructure {
    [key: string]: string | FileStructure
}

export const createFiles = ({ rootPath, structure }: { rootPath: string, structure: FileStructure }) => {

    for (let [key, val] of Object.entries(structure)) {

        const objectName = `${rootPath}/${key}`

        if (typeof val === "string") {

            writeFile(objectName, val)
            continue
        }

        mkdirSync(objectName)

        createFiles({ rootPath: objectName, structure: val })
    }

}