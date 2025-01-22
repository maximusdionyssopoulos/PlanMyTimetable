import { generate } from "./generate";
import type { GenerateEvent } from "./generate";

addEventListener("message", (event: MessageEvent<GenerateEvent>) => {
  const result = generate(event.data.courses, event.data.options);
  postMessage(result);
});
