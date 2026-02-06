import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  code: string;
  language: string;
};

export default function CodeViewer({ code, language }: Props) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      showLineNumbers
      wrapLines
      customStyle={{
        borderRadius: 12,
        padding: "20px",
        fontSize: "14px",
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}
