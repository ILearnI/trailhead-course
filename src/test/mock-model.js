import { simulateReadableStream } from "ai";
import { MockLanguageModelV4 } from "ai/test";

const usage = {
  inputTokens: { total: 3, noCache: 3, cacheRead: undefined, cacheWrite: undefined },
  outputTokens: { total: 5, text: 5, reasoning: undefined },
};

// A model that says the given pieces
export function sayingModel(pieces) {
  return new MockLanguageModelV4({
    doStream: async () => ({
      stream: simulateReadableStream({
        chunks: [
          { type: "text-start", id: "text-1" },
          ...pieces.map((delta) => ({ type: "text-delta", id: "text-1", delta })),
          { type: "text-end", id: "text-1" },
          { type: "finish", finishReason: { unified: "stop", raw: undefined }, usage },
        ],
      }),
    }),
  });
}

// A model that calls a tool, then answers
export function callingModel({ toolName, input, answer }) {
  let calls = 0;
  const finish = (unified) => ({
    type: "finish",
    finishReason: { unified, raw: undefined },
    usage,
  });
  return new MockLanguageModelV4({
    doStream: async () => {
      calls += 1;
      const chunks =
        calls === 1
          ? [
              {
                type: "tool-call",
                toolCallId: "call-1",
                toolName,
                input: JSON.stringify(input),
              },
              finish("tool-calls"),
            ]
          : [
              { type: "text-start", id: "text-1" },
              { type: "text-delta", id: "text-1", delta: answer },
              { type: "text-end", id: "text-1" },
              finish("stop"),
            ];
      return { stream: simulateReadableStream({ chunks }) };
    },
  });
}

// A model that answers with one text
export function textModel(text) {
  return new MockLanguageModelV4({
    doGenerate: async () => ({
      content: [{ type: "text", text }],
      finishReason: { unified: "stop", raw: undefined },
      usage,
      warnings: [],
    }),
  });
}
