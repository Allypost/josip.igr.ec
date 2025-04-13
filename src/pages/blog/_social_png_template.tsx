import type { CollectionEntry, RenderResult } from "astro:content";
// @ts-expect-error: dumb stuff
import React from "react";

const linearGradient = (
  rotation: number,
  steps: { color: string; percent: number[] }[],
) => {
  const parts = steps.flatMap((x) =>
    x.percent.map((y) => `${x.color} ${y.toString()}%`),
  );

  return `linear-gradient(${rotation.toString()}deg, ${parts.join(", ")})`;
};

export const SocialTemplate = (
  props: Omit<CollectionEntry<"blog">, "rendered"> & {
    rendered: RenderResult;
  },
) => {
  return (
    <div
      style={{
        fontSize: "40px",
        lineHeight: "1em",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        color: "rgb(28 25 23)",
        backgroundSize: "100px 100px",
        backgroundColor: "rgba(231,229,228,1)",
        backgroundImage: [
          "radial-gradient(circle at 25px 25px, rgba(105,32,165,.1) 4%, transparent 0%)",
          "radial-gradient(circle at 50px 50px, rgba(28,25,23,.17) 2.5%, transparent 0%)",
          "radial-gradient(circle at 25px 75px, rgba(197,139,255,.17) 3.5%, transparent 0%)",
          "radial-gradient(circle at 75px 25px, rgba(197,139,255,.45) 3.0%, transparent 0%)",
          "radial-gradient(circle at 75px 75px, rgba(197,139,255,.8) 1.5%, transparent 0%)",
        ].join(", "),
        padding: "3% 4.5%",
        fontFamily: "IosevkAllyP",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: linearGradient(353, [
            { color: "rgba(105,32,165,1)", percent: [0, 43] },
            { color: "rgba(231,229,228,0)", percent: [43, 100] },
          ]),
        }}
      />
      <div
        style={{
          display: "flex",
          fontWeight: 700,
          fontFamily: "IosevkAllySP",
          fontSize: "2.75em",
          marginTop: "auto",
          marginBottom: "auto",
        }}
      >
        {props.data.title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: "auto",
          marginLeft: "auto",
          alignItems: "flex-end",
          color: "rgb(231 229 228)",
        }}
      >
        <div
          style={{
            width: "30%",
            display: "flex",
            flexDirection: "column",
            opacity: 0.6,
            fontSize: "0.75em",
            marginBottom: "0.5em",
          }}
        >
          <span>{`${String(props.rendered.remarkPluginFrontmatter.wordsOnPage)} words`}</span>
          <span>{props.rendered.remarkPluginFrontmatter.minutesRead}</span>
        </div>
        <div
          style={{
            textAlign: "right",
            width: "70%",
          }}
        >
          {props.data.socialImageAlt ||
            props.data.heroImageAlt ||
            props.data.description.trim().replace(/[^\w]*$/, "")}
        </div>
      </div>
    </div>
  );
};
