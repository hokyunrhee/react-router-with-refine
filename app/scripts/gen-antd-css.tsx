import fs from "fs";
import { extractStyle } from "@ant-design/static-style-extract";
import { ConfigProvider } from "antd";

const outputPath = "./app/antd.min.css";

const css = extractStyle((node) => (
  <ConfigProvider theme={{ hashed: false }}>{node}</ConfigProvider>
));

fs.writeFileSync(outputPath, css);
