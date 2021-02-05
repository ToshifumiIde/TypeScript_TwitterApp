import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { db } from "../config/firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { Avatar, TextField } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MessageIcon from "@material-ui/icons/Message";
import SendIcon from "@material-ui/icons/Send";

interface PROPS {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}
//TypeScriptの場合、propsのデータ型を定義する必要がある。interface ○○{}で定義

const Post: React.FC<PROPS> = (props) => {
  //上記で定義したPROPSの型をアロー関数定義時に渡す
  const user = useSelector(selectUser);
  const [comment, setComment] = useState<string>("");

  const newComment = (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();
    db.collection("posts2").doc(props.postId).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
    // setComment(e.target.value);
  };
  return (
    <div className={styles.post}>
      Post
      <div className={styles.post_avatar}>
        <Avatar src={props.avatar} />
      </div>
      <div className={styles.post_body}>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={styles.props_headerUser}>@{props.username}</span>
              <span className={styles.props_headerTime}>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
                {/* JavaScriptのDate型に変更するために、 */}
              </span>
            </h3>
          </div>
          <div className={styles.post_tweet}>
            <p>{props.text}</p>
          </div>
        </div>
        {props.image && (
          <div className={styles.post_tweetImage}>
            <img src={props.image} alt="tweetimage" />
          </div>
        )}
        <form action="" onSubmit={newComment}>
          <div className={styles.post_form}>
            <TextField
              className={styles.post_input}
              type="text"
              placeholder="コメントしてみよう"
              value={comment}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setComment(e.target.value);
              }}
            />
            <button
              disabled={!comment}
              className={
                comment ? styles.post_button : styles.post_buttonDisable
              }
              type="submit"
            >
              <SendIcon className={styles.post_sendIcon} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
