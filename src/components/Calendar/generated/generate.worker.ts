import { generate, GenerateEvent } from "./generate";

addEventListener("message", (event: MessageEvent<GenerateEvent>) => {
  console.log(event.data);
  const result = generate(event.data.courses, event.data.options);
  console.log(result);
  postMessage(result);
});
