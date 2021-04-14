import React, { Fragment } from "react";
import noImg from "../photos/no-img.png";
//Mui
import Card from "@material-ui/core/Card";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import "./PostSkeleton.css";
interface Props {}
const PostSkeleton = (props: Props) => {
  const content = Array.from({ length: 5 }).map((item, index) => (
    <Card
      className="card"
      style={{ display: "flex", marginBottom: 20 }}
      key={index}
    >
      <CardMedia
        className="cover"
        style={{ minWidth: 200, objectFit: "cover" }}
        image={noImg}
      />
      <CardContent
        className="content"
        style={{
          width: "100%",
          flexDirection: "column",
          padding: 25,
        }}
      >
        <div className="username"></div>
        <div className="date"></div>
        <div className="fullLine"></div>
        <div className="fullLine"></div>
        <div className="halfLine"></div>
      </CardContent>
    </Card>
  ));
  return <Fragment>{content}</Fragment>;
};

export default PostSkeleton;
