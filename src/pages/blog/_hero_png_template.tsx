import type { CollectionEntry } from "astro:content";
// @ts-expect-error: dumb stuff
import React from "react";

type BlogExtraProps = Awaited<ReturnType<CollectionEntry<"blog">["render"]>>;

export const HeroTemplate = (
  props: CollectionEntry<"blog"> & {
    rendered: Omit<BlogExtraProps, "Content">;
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
        overflow: "hidden",
        borderRadius: "12px",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "5rem",
          borderRadius: "0 0 100% 100%",
          backgroundColor: "rgba(46,0,84,0.6)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "2rem",
          backgroundColor: "rgba(46,0,84,0.6)",
        }}
      />
      <div
        style={{
          display: "flex",
          fontWeight: 700,
          fontFamily: "IosevkAllySP",
          fontSize: "3em",
          marginTop: "auto",
          marginBottom: "auto",
          textAlign: "center",
          padding: ".5rem",
          paddingTop: "5rem",
          color: "rgb(46,0,84)",
        }}
      >
        {props.data.heroImageAlt || props.data.title}
      </div>
    </div>
  );
};
