// Fast-glob
import fg from "fast-glob";

function removeExtension(str: string) {
  // Strip compound suffixes (.stories.tsx, .test.tsx, .spec.tsx) in one pass,
  // not just the last extension — path.extname alone would leave ".stories"
  // attached and produce an invalid identifier like "AppBaseFoo.stories".
  return str.replace(/(\.(stories|test|spec))?\.(tsx|jsx)$/, "");
}

export const getComponentImports = () => {
  // Define an array of directory objects to search for components
  const directories = [
    {
      pattern: "./src/app/components/**/*.{tsx,jsx}",
      omit: "./src/app/components",
    },
  ];

  // Search for component files in directories and return their file paths as an array
  const entries = fg.sync(
    directories.map((x) => x.pattern),
    {
      dot: true,
      objectMode: true,
      // Class components (currently just AppBaseErrorBoundary) confuse the
      // auto-import plugin's self-file detection and get a self-referential
      // import injected into their own definition — import them explicitly
      // at the one place they're used instead.
      ignore: [
        "**/*.stories.{tsx,jsx}",
        "**/*.{test,spec}.{tsx,jsx}",
        "**/AppBaseErrorBoundary.{tsx,jsx}",
      ],
    }
  );

  // For each component file, extract the component name and fromPath
  const imports = entries.map((entry: IEntry) => {
    // Replace './src' with '@' in the fromPath
    const fromPath = entry.path.replace(/\.\/src/gi, "@");

    // Return an object with the fromPath and an array containing the component name and its variable name
    return {
      [fromPath]: [[removeExtension(entry.name), removeExtension(entry.name)]],
    };
  });

  return imports;
};
