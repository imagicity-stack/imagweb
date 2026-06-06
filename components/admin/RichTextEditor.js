import { useEffect, useRef, useState } from "react";
import {
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { getStorageInstance } from "../../lib/firebase/client";

// Uses document.execCommand for formatting. It is technically deprecated but
// remains supported across all current browsers and keeps the editor
// dependency-free and reliable for an internal admin tool.
const exec = (command, value = null) => {
  document.execCommand(command, false, value);
};

const escapeAttr = (value) => String(value || "").replace(/"/g, "&quot;");

export default function RichTextEditor({ value, onChange, uid }) {
  const areaRef = useRef(null);
  const fileRef = useRef(null);
  const [showSource, setShowSource] = useState(false);
  const [source, setSource] = useState(value || "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (areaRef.current && !showSource) {
      if (areaRef.current.innerHTML !== (value || "")) {
        areaRef.current.innerHTML = value || "";
      }
    }
  }, [value, showSource]);

  const emit = () => {
    if (areaRef.current) onChange(areaRef.current.innerHTML);
  };

  const runCommand = (command, commandValue) => {
    areaRef.current?.focus();
    exec(command, commandValue);
    emit();
  };

  const handleLink = () => {
    const url = window.prompt("Link URL:", "https://");
    if (url) {
      areaRef.current?.focus();
      exec("createLink", url);
      emit();
    }
  };

  const uploadImage = (file) => {
    const storage = getStorageInstance();
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const path = `blog/${uid || "admin"}/${Date.now()}-${safeName}`;
    const reference = storageRef(storage, path);
    const task = uploadBytesResumable(reference, file, { contentType: file.type });
    return new Promise((resolve, reject) => {
      task.on(
        "state_changed",
        (snapshot) => {
          setProgress(
            Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)
          );
        },
        reject,
        async () => {
          try {
            resolve(await getDownloadURL(reference));
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file.");
      return;
    }
    setUploading(true);
    setProgress(0);
    try {
      const url = await uploadImage(file);
      const alt = window.prompt("Describe this image for SEO / alt text:", "") || "";
      areaRef.current?.focus();
      const figure = `<figure><img src="${escapeAttr(url)}" alt="${escapeAttr(
        alt
      )}" loading="lazy" />${alt ? `<figcaption>${alt}</figcaption>` : ""}</figure><p><br/></p>`;
      exec("insertHTML", figure);
      emit();
    } catch (error) {
      window.alert(`Image upload failed: ${error.message || error}`);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const blocks = [
    { label: "P", title: "Paragraph", value: "p" },
    { label: "H2", title: "Heading 2", value: "h2" },
    { label: "H3", title: "Heading 3", value: "h3" },
    { label: "❝", title: "Quote", value: "blockquote" }
  ];

  const inline = [
    { label: "B", title: "Bold", command: "bold", style: { fontWeight: 800 } },
    { label: "I", title: "Italic", command: "italic", style: { fontStyle: "italic" } },
    { label: "U", title: "Underline", command: "underline", style: { textDecoration: "underline" } },
    { label: "S", title: "Strikethrough", command: "strikeThrough", style: { textDecoration: "line-through" } }
  ];

  return (
    <div className="editor">
      <div className="editor-toolbar" role="toolbar" aria-label="Formatting">
        <div className="editor-tool-group">
          {blocks.map((block) => (
            <button
              key={block.value}
              type="button"
              title={block.title}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand("formatBlock", block.value)}
            >
              {block.label}
            </button>
          ))}
        </div>
        <div className="editor-tool-group">
          {inline.map((item) => (
            <button
              key={item.command}
              type="button"
              title={item.title}
              style={item.style}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => runCommand(item.command)}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="editor-tool-group">
          <button
            type="button"
            title="Bullet list"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand("insertUnorderedList")}
          >
            • List
          </button>
          <button
            type="button"
            title="Numbered list"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand("insertOrderedList")}
          >
            1. List
          </button>
        </div>
        <div className="editor-tool-group">
          <button
            type="button"
            title="Insert link"
            onMouseDown={(e) => e.preventDefault()}
            onClick={handleLink}
          >
            🔗 Link
          </button>
          <button
            type="button"
            title="Insert image"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => fileRef.current?.click()}
          >
            🖼 Image
          </button>
          <button
            type="button"
            title="Divider"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand("insertHorizontalRule")}
          >
            ― HR
          </button>
          <button
            type="button"
            title="Clear formatting"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => runCommand("removeFormat")}
          >
            ⌫ Clear
          </button>
        </div>
        <div className="editor-tool-group editor-tool-right">
          <button
            type="button"
            className={showSource ? "active" : ""}
            title="Toggle HTML source"
            onClick={() => {
              if (!showSource) setSource(value || "");
              setShowSource((prev) => !prev);
            }}
          >
            {showSource ? "Visual" : "HTML"}
          </button>
        </div>
      </div>

      {showSource ? (
        <textarea
          className="editor-source"
          value={source}
          spellCheck={false}
          onChange={(e) => {
            setSource(e.target.value);
            onChange(e.target.value);
          }}
        />
      ) : (
        <div
          ref={areaRef}
          className="editor-area post-content"
          contentEditable
          suppressContentEditableWarning
          onInput={emit}
          onBlur={emit}
          data-placeholder="Write your story… Use the toolbar to format, add headings, links and images."
        />
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleFile}
      />

      {uploading ? (
        <div className="editor-uploading">
          <span className="admin-spinner small" /> Uploading image… {progress}%
        </div>
      ) : null}
    </div>
  );
}
