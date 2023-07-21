// Author: Durgesh Nandan Sinha
// System: Node v18.16.1

const fs = require('fs');
const path = './examples/example4/';

const getLibraries = async (filePath) => {
    try {
        // Get file elements
        let fileContent = await readFile(filePath);

        // Get name of file by first splitting and taking the last element via slice
        const name = filePath?.split('/')?.slice(-1)?.toString();

        // Create a library node for the tree.
        let library = {
            name,
            path: filePath?.split(name)[0]?.toString(),  //Since path will always be eveything else than fileName (alternative pop())
            children: [],
        };

        for (let line of fileContent.split("\n")) {
            // Check if the line is an import statement.
            if (line?.includes("import")) {

                // Get the child path from the import statement.
                // Trim to remove spaces first. Removing import and keeping rest path.
                let childRelativePath = line?.trim().split(" ")[1];
                let childFileName = childRelativePath?.split('./')[1];
                let childFilePath = library?.path + childFileName?.replace(';', '');

                if (line?.includes("import") && line?.includes("../")) {
                    // change path to root depending upon number of ""../"
                    childRoot = library?.path?.split('/');
                    childRootPath = childRoot?.slice(0, childRoot?.length - 2);
                    childFilePath = childRootPath?.join('/') + '/' + childFileName?.replace(';', '');
                }

                // Recursively calling for children
                let children = await getLibraries(childFilePath);

                // Adding children to library
                library?.children?.push(children);
            }
        }
        // Return the tree.
        return library;
    } catch (error) {
        console.log('Error while processing file:', error.message);
    }
}

const print = (library, depth = 0) => {
    try {
        console.log(" ".repeat(depth * 4) + library.name);

        if (library.children) {
            for (children of library.children) {
                print(children, depth + 1)
            }
        }
    } catch (error) {
        console.log('Error While printing:', error.message);
    }
}

const readFile = async (filePath) => {
    try {
        // Get the file contents.
        let fileContents = await fs.promises.readFile(filePath);

        // Convert the file contents to a string.
        return fileContents.toString();
    } catch (error) {
        console.error('Error reading file:', error.message);
    }
}

// Main function.
const main = async () => {
    // Get the path to the root program.
    let rootPath = path + 'root.prog';
    let tree = await getLibraries(rootPath);

    // Print the tree.
    print(tree);
}

// Call the main function.
main();
