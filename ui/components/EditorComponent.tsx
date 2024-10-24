"use client";

import {
  MDXEditor,
  MDXEditorMethods,
  headingsPlugin,
  imagePlugin,
  listsPlugin,
  quotePlugin,
} from "@mdxeditor/editor";
import { FC } from "react";

interface EditorProps {
  markdown: string;
  editorRef?: React.MutableRefObject<MDXEditorMethods | null>;
}

/**
 * Extend this Component further with the necessary plugins or props you need.
 * proxying the ref is necessary. Next.js dynamically imported components don't support refs.
 */
const Editor: FC<EditorProps> = ({ markdown, editorRef }) => {
  async function imageUploadHandler(image: File) {
    const formData = new FormData();
    formData.append("image", image);
    // send the file to your server and return
    // the URL of the uploaded image in the response
    const response = await fetch("/uploads/new", {
      method: "POST",
      body: formData,
    });
    const json = (await response.json()) as { url: string };
    return json.url;
  }

  return (
    <MDXEditor
      onChange={(e) => console.log(e)}
      ref={editorRef}
      markdown={markdown}
      plugins={[headingsPlugin(), listsPlugin(), quotePlugin()]}
    />
  );
};

export default Editor;
