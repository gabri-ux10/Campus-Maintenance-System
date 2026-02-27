import tailwindcss from "@tailwindcss/postcss";

const ensureDeclarationSourceFile = () => ({
  postcssPlugin: "ensure-declaration-source-file",
  Once(root) {
    const fallbackInput = root.source?.input;
    if (!fallbackInput?.file) return;

    root.walkDecls((decl) => {
      if (decl.source?.input?.file) return;
      decl.source = {
        ...decl.source,
        input: fallbackInput,
      };
    });
  },
});

export default {
  plugins: [
    tailwindcss(),
    ensureDeclarationSourceFile(),
  ],
};
